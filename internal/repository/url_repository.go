package repository

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"

	"gorm.io/gorm"
)

func GetByAccountID(accountID uint) ([]model.URL, error) {
	var urls []model.URL
	err := config.DBClient.Where("account_id = ?", accountID).Find(&urls).Error
	return urls, err
}

func CreateURL(url *model.URL) error {
	return config.DBClient.Create(url).Error
}

func GetByShortCode(code string) (*model.URL, error) {
	var url model.URL
	err := config.DBClient.Where("short_code = ?", code).First(&url).Error
	return &url, err
}

func DeleteByShortCode(code string) error {
	result := config.DBClient.Where("short_code = ?", code).Delete(&model.URL{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

func DeleteByIDAndAccountID(id uint, accountID uint) error {
	result := config.DBClient.Where("id = ? AND account_id = ?", id, accountID).Delete(&model.URL{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
