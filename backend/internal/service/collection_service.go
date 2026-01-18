package service

import (
	"RagnarokSimulator/internal/model"
	"RagnarokSimulator/internal/storage"
)

type CollectionService struct {
	storage *storage.Storage
}

func NewCollectionService(storage *storage.Storage) *CollectionService {
	return &CollectionService{
		storage: storage,
	}
}

func (cs *CollectionService) GetCollection(userID string) (*model.Collection, error) {
	cardQuantities, err := cs.storage.GetCollection(userID)
	if err != nil {
		return nil, err
	}

	collection := &model.Collection{
		UserID:     userID,
		Entries:    make([]model.CollectionEntry, 0),
		TotalCards: 0,
	}

	for cardID, quantity := range cardQuantities {
		collection.Entries = append(collection.Entries, model.CollectionEntry{
			CardID:   cardID,
			Quantity: quantity,
		})
		collection.TotalCards += quantity
	}

	return collection, nil
}

func (cs *CollectionService) AddCards(userID string, cards []model.Card) error {
	cardMap := make(map[int]int)
	for _, card := range cards {
		cardMap[card.ID]++
	}

	return cs.storage.AddCards(userID, cardMap)
}

func (cs *CollectionService) GetCardQuantity(userID string, cardID int) (int, error) {
	return cs.storage.GetCardQuantity(userID, cardID)
}
