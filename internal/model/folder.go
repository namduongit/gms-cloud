package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Folder struct {
	gorm.Model

	UUID uuid.UUID `gorm:"type:uuid;uniqueIndex;not null;default:gen_random_uuid()"`

	Name      string `gorm:"size:100;not null"`
	TotalFile uint64
	TotalSize uint64

	FolderParentUUID *string
	FolderParent     *Folder `gorm:"foreignKey:FolderParentUUID;references:UUID"`

	AccountID uint `gorm:"index"`
}
