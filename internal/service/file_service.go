package service

import (
	"url-shortener/internal/model"
	"url-shortener/internal/repository"
)

func SaveFileMetadata(file *model.File) error {
	return repository.CreateFile(file)
}

func ListFiles() ([]model.File, error) {
	return repository.GetAllFiles()
}
