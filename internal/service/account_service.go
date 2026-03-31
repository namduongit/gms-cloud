package service

import (
	"errors"
	"strconv"
	"strings"
	"url-shortener/internal/config"
	"url-shortener/internal/model"
	"url-shortener/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

func Register(email, password string) (*model.Account, error) {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(password), 10)

	var plan model.Plan
	config.DBClient.Where("name = ?", "Free").First(&plan)

	account := model.Account{
		Email:    email,
		Password: string(hashed),
		PlanID:   plan.ID,
		Role:     model.RoleUser,
	}

	if err := repository.CreateAccount(&account); err != nil {
		if strings.Contains(err.Error(), "duplicate") {
			return nil, errors.New("Email already exists")
		}
		return nil, err
	}

	profile := model.Profile{
		Username:    strconv.FormatUint(uint64(account.ID), 10),
		AvatarURL:   "",
		FullName:    "",
		CompanyName: "",
		Address:     "",
		Phone:       "",

		AccountID: account.ID,
	}

	go repository.CreateProfile(&profile)

	return &account, nil
}

func Login(email, password string) (*model.Account, error) {
	account, err := repository.GetAccountByEmail(email)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			return nil, errors.New("Email does not exist")
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)); err != nil {
		return nil, errors.New("Password is incorrect")
	}

	return account, nil
}

func GetAccountByID(id uint) (*model.Account, error) {
	account, err := repository.GetAccountByID(id)
	if err != nil && strings.Contains(err.Error(), "record not found") {
		return nil, errors.New("Not found account")
	}
	return account, nil
}

func PreloadPlanForAccount(account *model.Account) error {
	err := repository.PreloadPlanForAccount(account)
	if err != nil && strings.Contains(err.Error(), "record not found") {
		return errors.New("Not found account")
	}
	return err
}

func GetProfileByAccountID(accountID uint) (*model.Profile, error) {
	profile, err := repository.GetProfileByAccountID(accountID)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			return nil, errors.New("Profile not found")
		}

		return nil, err
	}

	return profile, nil
}

func UpdateProfileByAccountID(accountID uint, updates map[string]any) (*model.Profile, error) {
	if len(updates) == 0 {
		return nil, errors.New("No profile fields to update")
	}

	profile, err := repository.UpdateProfileByAccountID(accountID, updates)
	if err != nil {
		if strings.Contains(err.Error(), "record not found") {
			return nil, errors.New("Profile not found")
		}

		return nil, err
	}

	return profile, nil
}
