package model
type CollectionEntry struct {
	CardID   int `json:"cardId"`
	Quantity int `json:"quantity"`
}
type Collection struct {
	UserID    string             `json:"userId"`
	Entries   []CollectionEntry  `json:"entries"`
	TotalCards int               `json:"totalCards"`
}

func (c *Collection) AddCard(cardID int, quantity int) {
	for i := range c.Entries {
		if c.Entries[i].CardID == cardID {
			c.Entries[i].Quantity += quantity
			c.TotalCards += quantity
			return
		}
	}
	c.Entries = append(c.Entries, CollectionEntry{
		CardID:   cardID,
		Quantity: quantity,
	})
	c.TotalCards += quantity
}

func (c *Collection) GetCardQuantity(cardID int) int {
	for _, entry := range c.Entries {
		if entry.CardID == cardID {
			return entry.Quantity
		}
	}
	return 0
}
