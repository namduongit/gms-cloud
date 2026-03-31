package model

import (
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model

	Name        string
	AccessToken string `gorm:"unique"`
	Description *string

	AccountID uint `gorm:"index"`
}
