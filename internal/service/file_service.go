package service

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"

	"gorm.io/gorm"
)

func GetFiles(accountID uint) ([]model.File, error) {
	var files []model.File
	err := config.PostgresClient.
		Where("account_id = ?", accountID).
		Preload("Folder").
		Find(&files).Error
	return files, err
}

/**
 * * Delete a file by UUID and reclaim its storage quota.
 * ? @param accountID uint
 * ? @param uuid string
 * ? @return error
 * * Flow: Find file -> Get file size -> Delete file -> Decrease UsedStorage in AccountUsage
 */
func DeleteFileByUUID(accountID uint, uuid string) error {
	return config.PostgresClient.Transaction(func(tx *gorm.DB) error {
		var file model.File
		if err := tx.Where("account_id = ? AND uuid = ?", accountID, uuid).First(&file).Error; err != nil {
			return err
		}

		fileSize := file.Size
		folderID := file.FolderID

		// Delete the file record
		if err := tx.Delete(&file).Error; err != nil {
			return err
		}

		// Reclaim storage quota (decrease UsedStorage)
		if fileSize > 0 {
			if err := tx.Model(&model.AccountUsage{}).
				Where("account_id = ?", accountID).
				UpdateColumn("used_storage", gorm.Expr("GREATEST(used_storage - ?, 0)", fileSize)).Error; err != nil {
				return err
			}
		}

		// Update folder metadata if file was in a folder
		if folderID != nil {
			go updateFolderMetadata(folderID)
		}

		return nil
	})
}
