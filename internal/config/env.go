package config

import (
	"log"
	"os"
	"strconv"
	"sync"

	"github.com/joho/godotenv"
)

type Environment string

const (
	Development Environment = "DEVELOPMENT"
	Production  Environment = "PRODUCTION"
)

type AppConfig struct {
	// Environment production
	ENV Environment

	// Server & Client
	Port       string
	ServerHost string
	ClientHost string

	// Secret key for JWT and Token
	JWTSecret string
	// Secret key for API
	APISecret string

	// Mail server configuration
	MailHost     string
	MailPort     int
	MailUsername string
	MailPassword string
	MailSecret   string

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// MiniO
	MiniOFinalBucketName string
	MinIOTmpBucketName   string
	MinIOEndpoint        string
	MiniOLocalEndpoint   string
	MinIOAccessKey       string
	MinIOSecretKey       string

	// Redis
	RedisHost     string
	RedisPassword string
	RedisDB       int

	// Stream
	StreamUrl     string
	ReplaceStream string
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
			/* Environment */
			ENV: Environment(getEnv("ENV", string(Development))),

			/* Server & Client */
			Port:       getEnv("PORT", "8080"),
			ServerHost: getEnv("SERVER_HOST", "http://localhost:8080"),
			ClientHost: getEnv("CLIENT_HOST", "http://localhost:5173"),

			/* Secret key for JWT and Token */
			JWTSecret: getEnv("JWT_SECRET", "secret-key"),
			/* API Secret for verification account */
			APISecret: getEnv("API_SECRET", "api-secret"),

			/* Mail server configuration */
			MailHost: getEnv("MAIL_HOST", "smtp.gmail.com"),
			MailPort: func() int {
				port, err := strconv.Atoi(getEnv("MAIL_PORT", "587"))
				if err != nil {
					log.Printf("warning: invalid MAIL_PORT, using default: %v", err)
					return 587
				}
				return port
			}(),
			MailUsername: getEnv("MAIL_USERNAME", "email@gmail.com"),
			MailPassword: getEnv("MAIL_PASSWORD", "password"),
			MailSecret:   getEnv("MAIL_SECRECT", "mail-secret"),

			/* Database Configuration - Postgres */
			DBHost:     getEnv("DB_HOST", "localhost"),
			DBPort:     getEnv("DB_PORT", "5432"),
			DBUser:     getEnv("DB_USER", "postgres"),
			DBPassword: getEnv("DB_PASSWORD", ""),
			DBName:     getEnv("DB_NAME", "gms-cloud"),
			DBSSLMode:  getEnv("DB_SSLMODE", "disable"),

			/* MinIO Configuration */
			MiniOFinalBucketName: getEnv("MINIO_FINAL_BUCKET_NAME", "gms-cloud"),
			MinIOTmpBucketName:   getEnv("MINIO_TMP_BUCKET_NAME", "temp-bucket"),
			MinIOEndpoint:        getEnv("MINIO_ENDPOINT", "localhost:9000"),
			MiniOLocalEndpoint:   getEnv("MINIO_LOCAL_ENDPOINT", "localhost:9000"),
			MinIOAccessKey:       getEnv("MINIO_ACCESS_KEY", "access-key"),
			MinIOSecretKey:       getEnv("MINIO_SECRET_KEY", "secret-key"),

			/* Redis Configuration */
			RedisHost:     getEnv("REDIS_HOST", "localhost:6379"),
			RedisPassword: getEnv("REDIS_PASSWORD", ""),
			RedisDB: func() int {
				db, err := strconv.Atoi(getEnv("REDIS_DB", "0"))
				if err != nil {
					log.Printf("warning: invalid REDIS_DB, using default: %v", err)
					return 0
				}
				return db
			}(),
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
