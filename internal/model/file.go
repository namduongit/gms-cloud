package model

import "time"

type File struct {
	ID        uint `gorm:"primaryKey"`
	FileName  string
	FilePath  string
	Size      int64
	CreatedAt time.Time

	UserID uint
	User   User
}
