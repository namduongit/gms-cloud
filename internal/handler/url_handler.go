package handler

import (
	"net/http"
	"url-shortener/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CreateURLRequest struct {
	URL string `json:"url"`
}

func CreateShortURL(c *gin.Context) {
	var req CreateURLRequest

	if err := c.ShouldBindJSON(&req); err != nil || req.URL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	code, err := service.CreateShortURL(req.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot create short url"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"short_url": "http://localhost:8080/" + code,
	})
}

func RedirectURL(c *gin.Context) {
	code := c.Param("code")

	longURL, err := service.GetLongURL(code)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "url not found"})
		return
	}

	c.Redirect(http.StatusFound, longURL)
}

func GetAllURLs(c *gin.Context) {
	urls, err := service.ListURLs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot fetch urls"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": urls})
}

func DeleteURL(c *gin.Context) {
	code := c.Param("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing code"})
		return
	}

	if err := service.DeleteURL(code); err != nil {
		status := http.StatusInternalServerError
		if err == gorm.ErrRecordNotFound {
			status = http.StatusNotFound
		}
		c.JSON(status, gin.H{"error": "cannot delete url"})
		return
	}

	c.Status(http.StatusNoContent)
}
