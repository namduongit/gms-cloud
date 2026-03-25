package model

import "time"

type URL struct {
	ID        uint   `gorm:"primaryKey"`
	ShortCode string `gorm:"uniqueIndex"`
	LongURL   string
	CreatedAt time.Time

	UserID uint
	User   User
}
