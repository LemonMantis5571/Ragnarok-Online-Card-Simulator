package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"RagnarokSimulator/internal/config"
	"RagnarokSimulator/internal/controller"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
		fmt.Printf("Failed to load config: %v", err)
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// Global rate limit: 100 requests per minute per IP
	r.Use(httprate.LimitByIP(100, 1*time.Minute))

	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	apiController := controller.NewAPIController()

	r.Get("/health", apiController.HealthCheck)

	r.Route("/api", func(r chi.Router) {
		// Specific rate limit for opening packs to prevent automated spamming (20 per minute)
		r.With(httprate.LimitByIP(20, 1*time.Minute)).Post("/packs/open", apiController.OpenPack)

		r.Post("/example", apiController.PostExample)
		r.Get("/cards", apiController.GetCards)
		r.Post("/cards/generate", apiController.GenerateCard)
		r.Get("/collection/{userId}", apiController.GetCollection)
		r.Post("/collection/{userId}", apiController.AddToCollection)
	})

	host := cfg.Server.Host
	if host == "" {
		host = "localhost"
	}

	server := &http.Server{
		Addr:         host + ":" + cfg.Server.Port,
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	log.Printf("Starting server on %s:%s", cfg.Server.Host, cfg.Server.Port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
