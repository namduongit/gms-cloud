package config

import (
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var CLMiniO *minio.Client

func InitCLMiniO() {
	cfg := GetConfig()

	client, err := minio.New(cfg.MinIOEndpoint, &minio.Options{
		Creds: credentials.NewStaticV4(
			cfg.MinIOAccessKey,
			cfg.MinIOSecretKey,
			"",
		),
		// Enable if using HTTPS
		Secure: false,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("Connect to MiniO cloud success")
	CLMiniO = client
}
