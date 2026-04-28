package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type File struct {
	gorm.Model

	UUID uuid.UUID `gorm:"type:uuid;uniqueIndex;not null;default:gen_random_uuid()"`

	FileName    string
	ContentType string
	// MiniO object name
	StorageKey string
	Size       uint64
	// Default is false, It will be changed if user want to share
	IsShared bool `gorm:"default:false"`

	AccountID uint `gorm:"index"`

	FolderID *uint   `gorm:"index"`
	Folder   *Folder `gorm:"foreignKey:FolderID;references:ID"`
}
