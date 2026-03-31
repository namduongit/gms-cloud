package model

import "gorm.io/gorm"

type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin"
)

type Account struct {
	gorm.Model

	Email    string `gorm:"unique"`
	Role     Role   `gorm:"default:'user'"`
	Password string

	// One-to-One relationship with Profile
	Profile Profile

	Tokens  []Token
	Folders []Folder
	Files   []File
	URLs    []URL

	// Many-to-One relationship with Plan
	Plan   Plan
	PlanID uint `gorm:"index"`
}
