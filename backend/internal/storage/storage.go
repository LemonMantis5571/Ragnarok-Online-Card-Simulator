package storage

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	_ "github.com/lib/pq"
)

type Storage struct {
	db *sql.DB
}

func NewStorage(dsn string) (*Storage, error) {
	if dsn == "" {
		return nil, fmt.Errorf("database dsn is empty")
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open postgres: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping postgres: %v", err)
	}

	// Optimized connection pool for cloud latency
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	storage := &Storage{db: db}

	if err := storage.migrate(); err != nil {
		return nil, fmt.Errorf("failed to run postgres migrations: %v", err)
	}

	return storage, nil
}

func (s *Storage) migrate() error {
	query := `
	CREATE TABLE IF NOT EXISTS collections (
		user_id TEXT NOT NULL,
		card_id INTEGER NOT NULL,
		quantity INTEGER NOT NULL DEFAULT 1,
		PRIMARY KEY (user_id, card_id)
	);
	CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
	`
	_, err := s.db.Exec(query)
	return err
}

func (s *Storage) Close() error {
	return s.db.Close()
}

func (s *Storage) GetCollection(userID string) (map[int]int, error) {
	query := `SELECT card_id, quantity FROM collections WHERE user_id = $1`
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	collection := make(map[int]int)
	for rows.Next() {
		var cardID, quantity int
		if err := rows.Scan(&cardID, &quantity); err != nil {
			return nil, err
		}
		collection[cardID] = quantity
	}

	return collection, rows.Err()
}

func (s *Storage) AddCards(userID string, cards map[int]int) error {
	if len(cards) == 0 {
		return nil
	}

	var b strings.Builder
	b.WriteString("INSERT INTO collections (user_id, card_id, quantity) VALUES ")

	args := make([]interface{}, 0, len(cards)*3)
	placeholders := make([]string, 0, len(cards))

	i := 0
	for cardID, quantity := range cards {
		p1, p2, p3 := i*3+1, i*3+2, i*3+3
		placeholders = append(placeholders, fmt.Sprintf("($%d, $%d, $%d)", p1, p2, p3))
		args = append(args, userID, cardID, quantity)
		i++
	}

	b.WriteString(strings.Join(placeholders, ", "))
	b.WriteString(`
		ON CONFLICT (user_id, card_id) 
		DO UPDATE SET quantity = collections.quantity + EXCLUDED.quantity
	`)

	_, err := s.db.Exec(b.String(), args...)
	return err
}

func (s *Storage) GetCardQuantity(userID string, cardID int) (int, error) {
	var quantity int
	query := `SELECT quantity FROM collections WHERE user_id = $1 AND card_id = $2`
	err := s.db.QueryRow(query, userID, cardID).Scan(&quantity)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return quantity, err
}
