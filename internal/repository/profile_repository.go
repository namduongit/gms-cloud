package repository

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"
)

func CreateProfile(profile *model.Profile) (*model.Profile, error) {
	err := config.DBClient.Create(profile).Error
	return profile, err
}

func GetProfileByAccountID(accountID uint) (*model.Profile, error) {
	var profile model.Profile
	err := config.DBClient.Where("account_id = ?", accountID).First(&profile).Error
	if err != nil {
		return nil, err
	}

	return &profile, nil
}

func UpdateProfileByAccountID(accountID uint, updates map[string]any) (*model.Profile, error) {
	if err := config.DBClient.Model(&model.Profile{}).Where("account_id = ?", accountID).Updates(updates).Error; err != nil {
		return nil, err
	}

	return GetProfileByAccountID(accountID)
}
