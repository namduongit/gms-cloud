package model

import "gorm.io/gorm"

type Profile struct {
	gorm.Model

	Username    string `gorm:"uniqueIndex"`
	AvatarURL   string
	FullName    string
	CompanyName string
	Address     string
	Phone       string

	AccountID uint `gorm:"index"`
}
