package handler

import (
	"net/http"
	"url-shortener/internal/config"
	"url-shortener/internal/http/response"
	"url-shortener/internal/model"
	"url-shortener/internal/service"

	"github.com/gin-gonic/gin"
)

func GetFiles(c *gin.Context) {
	account := c.MustGet("account").(*model.Account)

	files, err := service.GetFiles(account.ID)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			),
		)
	}

	fileResponses := make([]response.FileResponse, len(files))
	for i, file := range files {
		var folderName = "root"
		var folderUUID *string = nil
		if file.FolderID != nil {
			folderName = file.Folder.Name
			uuidStr := file.Folder.UUID.String()
			folderUUID = &uuidStr
		}
		fileResponses[i] = response.FileResponse{
			UUID:        file.UUID.String(),
			FileName:    file.FileName,
			ContentType: file.ContentType,
			Size:        file.Size,
			IsShared:    file.IsShared,
			FolderUUID:  folderUUID,
			FolderName:  folderName,
			UploadedAt:  file.CreatedAt,
		}
	}

	response := response.FileListResponse{
		OwnerUUID: account.UUID.String(),
		Files:     fileResponses,
	}

	c.JSON(
		http.StatusOK,
		config.GinResponse(
			response,
			config.RestFulSuccess,
			nil,
			config.RestFulCodeSuccess,
		))
}

func DeleteFile(c *gin.Context) {
	account := c.MustGet("account").(*model.Account)

	fileUUID := c.Param("uuid")

	err := service.DeleteFileByUUID(account.ID, fileUUID)
	if err != nil {
		c.JSON(
			http.StatusNotFound,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulNotFound,
				config.RestFulCodeNotFound,
			))
		return
	}

	c.JSON(http.StatusOK, config.GinResponse(
		nil,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

func ShareFile(c *gin.Context) {

}

func UnShareFile(c *gin.Context) {

}

func DownloadFile(c *gin.Context) {

}
