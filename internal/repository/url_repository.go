package repository

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"

	"gorm.io/gorm"
)

func CreateURL(url *model.URL) error {
	return config.DB.Create(url).Error
}

func GetByShortCode(code string) (*model.URL, error) {
	var url model.URL
	err := config.DB.Where("short_code = ?", code).First(&url).Error
	return &url, err
}

func GetAllURLs() ([]model.URL, error) {
	var urls []model.URL
	err := config.DB.Order("created_at DESC").Find(&urls).Error
	return urls, err
}

func DeleteByShortCode(code string) error {
	result := config.DB.Where("short_code = ?", code).Delete(&model.URL{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
