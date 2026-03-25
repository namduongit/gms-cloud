package repository

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"
)

func CreateFile(file *model.File) error {
	return config.DB.Create(file).Error
}

func GetAllFiles() ([]model.File, error) {
	var files []model.File
	err := config.DB.Order("created_at DESC").Find(&files).Error
	return files, err
}
