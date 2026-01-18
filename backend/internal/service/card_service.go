package service

import (
	"encoding/json"
	"math/rand"
	"os"
	"path/filepath"

	"RagnarokSimulator/internal/model"
)

type CardService struct {
	cards      []model.Card
	mvpCards   []model.Card
	normalCards []model.Card
	mvpRate    float64
}

func NewCardService(cardsFilePath string, mvpRate float64) (*CardService, error) {
	absPath, err := filepath.Abs(cardsFilePath)
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(absPath)
	if err != nil {
		return nil, err
	}

	var cards []model.Card
	if err := json.Unmarshal(data, &cards); err != nil {
		return nil, err
	}

	service := &CardService{
		cards:      cards,
		mvpCards:   make([]model.Card, 0),
		normalCards: make([]model.Card, 0),
		mvpRate:    mvpRate,
	}

	for _, card := range cards {
		if card.IsMVP() {
			service.mvpCards = append(service.mvpCards, card)
		} else {
			service.normalCards = append(service.normalCards, card)
		}
	}

	return service, nil
}

func (cs *CardService) GetAllCards() []model.Card {
	return cs.cards
}

func (cs *CardService) GenerateRandomCard() model.Card {
	if len(cs.mvpCards) > 0 && rand.Float64() < cs.mvpRate {
		return cs.mvpCards[rand.Intn(len(cs.mvpCards))]
	}
	
	if len(cs.normalCards) > 0 {
		return cs.normalCards[rand.Intn(len(cs.normalCards))]
	}
	
	return cs.cards[rand.Intn(len(cs.cards))]
}

func (cs *CardService) OpenPack(cardsPerPack int) []model.Card {
	if cardsPerPack <= 0 {
		cardsPerPack = 8
	}
	
	cards := make([]model.Card, 0, cardsPerPack)
	for i := 0; i < cardsPerPack; i++ {
		cards = append(cards, cs.GenerateRandomCard())
	}
	
	return cards
}

func (cs *CardService) GetCardByID(cardID int) (*model.Card, bool) {
	for _, card := range cs.cards {
		if card.ID == cardID {
			return &card, true
		}
	}
	return nil, false
}
