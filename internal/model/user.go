package model

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Email    string `gorm:"unique"`
	Password string

	PlanID uint
	Plan   Plan

	URLs  []URL
	Files []File
}
