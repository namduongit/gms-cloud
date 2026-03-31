package main

import (
	"fmt"
	"url-shortener/internal/config"
	"url-shortener/internal/model"
	"url-shortener/internal/router"
)

func main() {
	var port = config.GetConfig().Port
	var serverDirect = config.GetConfig().ServerDirect

	config.InitDBClient()
	config.InitCLMiniO()

	config.DBClient.AutoMigrate(
		&model.Plan{},
		&model.Account{},
		&model.Profile{},
		&model.URL{},
		&model.Folder{},
		&model.File{},
		&model.Token{},
	)

	// Init 3 plans: Free, Pro, Enterprise
	// Free plan: 1 GB storage, 20 URLs
	// Pro plan: 10 GB storage, 100 URLs
	// Enterprise plan: 100 GB storage, 1000 URLs
	config.DBClient.FirstOrCreate(&model.Plan{}, model.Plan{
		Name:         "Pro",
		StorageLimit: 10 * 1024 * 1024 * 1024,
		URLLimit:     100,
	})

	config.DBClient.FirstOrCreate(&model.Plan{}, model.Plan{
		Name:         "Enterprise",
		StorageLimit: 100 * 1024 * 1024 * 1024,
		URLLimit:     1000,
	})

	config.DBClient.FirstOrCreate(&model.Plan{}, model.Plan{
		Name:         "Free",
		StorageLimit: 10 * 1024 * 1024 * 1024,
		URLLimit:     20,
	})

	router := router.SetupRouter()
	fmt.Println("Server running on: ", serverDirect)
	router.Run(":" + port)
}
