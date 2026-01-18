package config

import (
	"log"
	"path/filepath"
	"runtime"
	"time"

	"github.com/caarlos0/env/v8"
	"github.com/joho/godotenv"
)

type Config struct {
	Server struct {
		Host         string        `env:"SERVER_HOST"`
		Port         string        `env:"PORT" envDefault:"8089"`
		ReadTimeout  time.Duration `env:"SERVER_READ_TIMEOUT"`
		WriteTimeout time.Duration `env:"SERVER_WRITE_TIMEOUT"`
	}
	Environment string `env:"ENV"`
	Database    struct {
		URL string `env:"DATABASE_URL"`
	}
	CardsFile string `env:"CARDS_FILE"`
}

func Load() (*Config, error) {
	// Try loading .env from current directory, then backend root, then project root
	godotenv.Load() // current dir

	configDir := getConfigDir()
	backendRoot := filepath.Dir(filepath.Dir(configDir))
	projectRoot := filepath.Dir(backendRoot)

	godotenv.Load(filepath.Join(backendRoot, ".env"))
	godotenv.Load(filepath.Join(projectRoot, ".env"))

	var cfg Config
	if err := env.Parse(&cfg); err != nil {
		return nil, err
	}

	if cfg.Server.Host == "" {
		cfg.Server.Host = "0.0.0.0"
	}

	if cfg.Database.URL == "" {
		log.Printf("WARNING: DATABASE_URL not set in environment or .env files")
	}

	if cfg.CardsFile == "" {
		cfg.CardsFile = "internal/db/cards_with_mvp.json"
	}
	if cfg.Environment == "" {
		cfg.Environment = "development"
	}

	if !filepath.IsAbs(cfg.CardsFile) {
		cfg.CardsFile = filepath.Join(backendRoot, cfg.CardsFile)
		cfg.CardsFile = filepath.Clean(cfg.CardsFile)
	}

	return &cfg, nil
}

func getConfigDir() string {
	_, filename, _, _ := runtime.Caller(0)
	return filepath.Dir(filename)
}
