package model

type Plan struct {
	ID           uint `gorm:"primaryKey"`
	Name         string
	StorageLimit int64
	URLLimit     int

	Users []User
}
