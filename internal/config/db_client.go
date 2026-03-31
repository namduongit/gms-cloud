package config

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DBClient *gorm.DB

func InitDBClient() {
	cfg := GetConfig()
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBPort,
		cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	fmt.Println("Connect to MongoDB cloud success")

	DBClient = db
}
