package controller

import (
	"encoding/json"
	"net/http"
)

type BaseController struct{}

func (bc *BaseController) JSON(w http.ResponseWriter, statusCode int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (bc *BaseController) Error(w http.ResponseWriter, statusCode int, err error) {
	bc.JSON(w, statusCode, map[string]string{
		"error": err.Error(),
	})
}
