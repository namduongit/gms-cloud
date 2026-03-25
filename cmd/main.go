package main

import (
	"url-shortener/internal/config"
	"url-shortener/internal/model"
	"url-shortener/internal/router"
)

func main() {
	config.ConnectDB()

	config.DB.AutoMigrate(
		&model.Plan{},
		&model.User{},
		&model.URL{},
		&model.File{},
	)

	config.DB.FirstOrCreate(&model.Plan{}, model.Plan{
		Name:         "Free",
		StorageLimit: 10 * 1024 * 1024 * 1024,
		URLLimit:     20,
	})

	router := router.SetupRouter()
	router.Run(":8080")
}
