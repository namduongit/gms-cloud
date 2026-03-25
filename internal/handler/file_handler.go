package handler

import (
	"net/http"
	"os"
	"path/filepath"
	"url-shortener/internal/config"
	"url-shortener/internal/model"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func UploadFile(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file not found"})
		return
	}
	filename := uuid.New().String() + filepath.Ext(file.Filename)

	savePath := "../../storage/" + filename

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot save file"})
		return
	}

	f := model.File{
		FileName: file.Filename,
		FilePath: savePath,
		Size:     file.Size,
	}

	config.DB.Create(&f)

	c.JSON(http.StatusOK, gin.H{
		"file_url": "http://localhost:8080/files/" + filename,
	})
}

func GetFile(c *gin.Context) {
	filename := c.Param("filename")

	filePath := "../../storage/" + filename

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "file not found"})
		return
	}

	c.File(filePath)
}
