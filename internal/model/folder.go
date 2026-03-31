package model

import (
	"gorm.io/gorm"
)

type Folder struct {
	gorm.Model

	Name       string
	TotalFiles int

	AccountID uint `gorm:"index"`
}
