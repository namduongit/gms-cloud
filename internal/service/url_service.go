package service

import (
	"strings"
	"url-shortener/internal/model"
	"url-shortener/internal/repository"

	"github.com/google/uuid"
)

func CreateShortURL(longURL string) (string, error) {
	code := strings.ReplaceAll(uuid.New().String(), "-", "")[:6]

	url := model.URL{
		ShortCode: code,
		LongURL:   longURL,
	}

	err := repository.CreateURL(&url)
	if err != nil {
		return "", err
	}

	return code, nil
}

func GetLongURL(code string) (string, error) {
	url, err := repository.GetByShortCode(code)
	if err != nil {
		return "", err
	}

	return url.LongURL, nil
}

func ListURLs() ([]model.URL, error) {
	return repository.GetAllURLs()
}

func DeleteURL(code string) error {
	return repository.DeleteByShortCode(code)
}
