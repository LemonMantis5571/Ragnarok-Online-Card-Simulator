package model

type Card struct {
	ID          int    `json:"id"`
	AegisName   string `json:"AegisName"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	MVP         bool   `json:"mvp,omitempty"`
	Description string `json:"Description"`
}

func (c *Card) IsMVP() bool {
	return c.MVP
}
