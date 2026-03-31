package repository

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"

	"gorm.io/gorm"
)

func GetFoldersByUserID(userID uint) ([]model.Folder, error) {
	var folders []model.Folder
	err := config.DBClient.
		Where("account_id = ?", userID).
		Order("created_at DESC").
		Find(&folders).Error
	return folders, err
}

func GetFolderByID(folderID uint) (*model.Folder, error) {
	var folder model.Folder
	err := config.DBClient.
		Where("id = ?", folderID).
		First(&folder).Error
	if err != nil {
		return nil, err
	}
	return &folder, nil
}

func GetFolderByFolderNameAndAccountID(folderName string, accountID uint) (*model.Folder, error) {
	var folder model.Folder
	err := config.DBClient.
		Where("name = ? AND account_id = ?", folderName, accountID).
		First(&folder).Error
	if err != nil {
		return nil, err
	}
	return &folder, nil
}

func CreateFolder(folder *model.Folder) error {
	return config.DBClient.Create(folder).Error
}

func GetFolderByIDAndAccountID(folderID uint, accountID uint) (*model.Folder, error) {
	var folder model.Folder
	err := config.DBClient.Where("id = ? AND account_id = ?", folderID, accountID).First(&folder).Error
	if err != nil {
		return nil, err
	}

	return &folder, nil
}

func CountFilesByFolderID(folderID uint, accountID uint) (int64, error) {
	var total int64
	err := config.DBClient.Model(&model.File{}).Where("folder_id = ? AND account_id = ?", folderID, accountID).Count(&total).Error
	return total, err
}

func DeleteFolderByID(folderID uint, accountID uint) error {
	result := config.DBClient.Where("id = ? AND account_id = ?", folderID, accountID).Delete(&model.Folder{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
