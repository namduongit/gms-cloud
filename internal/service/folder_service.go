package service

import (
	"errors"
	"strings"
	"url-shortener/internal/model"
	"url-shortener/internal/repository"
)

func GetFoldersByUserID(userID uint) ([]model.Folder, error) {
	folders, err := repository.GetFoldersByUserID(userID)
	if err != nil {
		return nil, err
	}

	return folders, nil
}

func GetFolderByID(folderID uint) (*model.Folder, error) {
	return repository.GetFolderByID(folderID)
}

func GetFolderByFolderNameAndAccountID(folderName string, accountID uint) (*model.Folder, error) {
	return repository.GetFolderByFolderNameAndAccountID(folderName, accountID)
}
func CreateFolder(userID uint, name string) (*model.Folder, error) {
	folder := model.Folder{
		AccountID: userID,
		Name:      name,
	}

	if err := repository.CreateFolder(&folder); err != nil {
		return nil, err
	}

	return &folder, nil
}

func DeleteFolderByID(accountID uint, folderID uint) error {
	_, err := repository.GetFolderByIDAndAccountID(folderID, accountID)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			return errors.New("Folder not found")
		}

		return err
	}

	totalFiles, err := repository.CountFilesByFolderID(folderID, accountID)
	if err != nil {
		return err
	}

	if totalFiles > 0 {
		return errors.New("Folder has files")
	}

	err = repository.DeleteFolderByID(folderID, accountID)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			return errors.New("Folder not found")
		}

		return err
	}

	return nil
}
