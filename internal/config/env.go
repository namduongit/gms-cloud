package config

import (
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	DBHost     string
	DBUser     string
	DBPassword string
	DBName     string
	DBPort     string
	DBSSLMode  string
	JWTSecret  string
}

var (
	cfg     AppConfig
	cfgOnce sync.Once
)

func GetConfig() AppConfig {
	cfgOnce.Do(func() {
		if err := godotenv.Load(); err != nil {
			log.Printf("warning: could not load .env file: %v", err)
		}

		cfg = AppConfig{
			DBHost:     getEnv("DB_HOST", "localhost"),
			DBUser:     getEnv("DB_USER", "postgres"),
			DBPassword: getEnv("DB_PASSWORD", ""),
			DBName:     getEnv("DB_NAME", "url_shortener"),
			DBPort:     getEnv("DB_PORT", "5432"),
			DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
			JWTSecret:  getEnv("JWT_SECRET", "secret_key"),
		}
	})

	return cfg
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
