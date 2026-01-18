package controller

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"RagnarokSimulator/internal/config"
	"RagnarokSimulator/internal/model"
	"RagnarokSimulator/internal/service"
	"RagnarokSimulator/internal/storage"

	"github.com/go-chi/chi/v5"
)

type APIController struct {
	BaseController
	cardService       *service.CardService
	collectionService *service.CollectionService
}

func NewAPIController() *APIController {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	stor, err := storage.NewStorage(cfg.Database.URL)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	cardsPath := cfg.CardsFile
	cardService, err := service.NewCardService(cardsPath, 0.0025)
	if err != nil {
		log.Fatalf("Failed to initialize card service: %v", err)
	}

	collectionService := service.NewCollectionService(stor)

	return &APIController{
		cardService:       cardService,
		collectionService: collectionService,
	}
}

func (ac *APIController) HealthCheck(w http.ResponseWriter, r *http.Request) {
	ac.JSON(w, http.StatusOK, map[string]interface{}{
		"status":  "ok",
		"message": "API is running",
	})
}

func (ac *APIController) PostExample(w http.ResponseWriter, r *http.Request) {
	var input map[string]any
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		ac.Error(w, http.StatusBadRequest, err)
		return
	}
	input["processed"] = true
	input["receivedAt"] = time.Now().Format(time.RFC3339)
	ac.JSON(w, http.StatusOK, input)
}

func (ac *APIController) GetCards(w http.ResponseWriter, r *http.Request) {
	ac.JSON(w, http.StatusOK, ac.cardService.GetAllCards())
}

func (ac *APIController) OpenPack(w http.ResponseWriter, r *http.Request) {
	var request struct {
		CardsPerPack int    `json:"cardsPerPack,omitempty"`
		UserID       string `json:"userId,omitempty"`
	}
	if r.Body != nil {
		json.NewDecoder(r.Body).Decode(&request)
	}
	if request.CardsPerPack <= 0 {
		request.CardsPerPack = 8
	}

	cards := ac.cardService.OpenPack(request.CardsPerPack)
	if request.UserID != "" {
		if err := ac.collectionService.AddCards(request.UserID, cards); err != nil {
			log.Printf("Error adding cards to collection: %v", err)
		}
	}

	ac.JSON(w, http.StatusOK, map[string]interface{}{
		"cards": cards,
		"count": len(cards),
	})
}

func (ac *APIController) GenerateCard(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UserID string `json:"userId,omitempty"`
	}
	if r.Body != nil {
		json.NewDecoder(r.Body).Decode(&request)
	}

	card := ac.cardService.GenerateRandomCard()
	if request.UserID != "" {
		if err := ac.collectionService.AddCards(request.UserID, []model.Card{card}); err != nil {
			log.Printf("Error adding card to collection: %v", err)
		}
	}
	ac.JSON(w, http.StatusOK, card)
}

func (ac *APIController) GetCollection(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userId")
	if userID == "" {
		ac.JSON(w, http.StatusBadRequest, map[string]string{"error": "userId is required"})
		return
	}

	collection, err := ac.collectionService.GetCollection(userID)
	if err != nil {
		ac.Error(w, http.StatusInternalServerError, err)
		return
	}
	ac.JSON(w, http.StatusOK, collection)
}

func (ac *APIController) AddToCollection(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userId")
	if userID == "" {
		ac.JSON(w, http.StatusBadRequest, map[string]string{"error": "userId is required"})
		return
	}

	var request struct {
		Cards []model.Card `json:"cards"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		ac.Error(w, http.StatusBadRequest, err)
		return
	}

	if err := ac.collectionService.AddCards(userID, request.Cards); err != nil {
		ac.Error(w, http.StatusInternalServerError, err)
		return
	}
	ac.JSON(w, http.StatusOK, map[string]string{"message": "Cards added to collection"})
}
