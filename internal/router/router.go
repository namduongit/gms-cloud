package router

import (
	"url-shortener/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.SetTrustedProxies(nil)

	// Auth routes
	r.POST("/register", handler.Register)
	r.POST("/login", handler.Login)

	// URL routes
	r.POST("/shorten", handler.CreateShortURL)
	r.GET("/urls", handler.GetAllURLs)
	r.DELETE("/urls/:code", handler.DeleteURL)
	r.GET("/:code", handler.RedirectURL)

	// File routes
	r.POST("/upload", handler.UploadFile)
	r.GET("/files/:filename", handler.GetFile)

	return r
}
