package handler

import (
	"net/http"
	"strconv"
	"strings"
	"url-shortener/internal/config"
	"url-shortener/internal/model/response"
	"url-shortener/internal/service"

	"github.com/gin-gonic/gin"
)

func GetFolders(c *gin.Context) {
	accountID := c.GetUint("accountID")
	_, err := service.GetAccountByID(accountID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, config.GinErrorResponse(
			err.Error(),
			config.RestFulInternalError,
			config.RestFulCodeInternalError,
		))
		return
	}

	folders, err := service.GetFoldersByUserID(accountID)
	if err != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			err.Error(),
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	folderResponses := make([]response.FolderResponse, len(folders))
	for i, folder := range folders {
		folderResponses[i] = response.FolderResponse{
			ID:         folder.ID,
			Name:       folder.Name,
			TotalFiles: folder.TotalFiles,
			CreatedAt:  folder.CreatedAt,
		}
	}

	response := response.FolderListResponse{
		OwnerID: accountID,
		Folders: folderResponses,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		response,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

type CreateFolderRequest struct {
	Name string `json:"name" binding:"required"`
}

func CreateFolder(c *gin.Context) {
	accountID := c.GetUint("accountID")
	_, err := service.GetAccountByID(accountID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, config.GinErrorResponse(
			err.Error(),
			config.RestFulInternalError,
			config.RestFulCodeInternalError,
		))
		return
	}

	var req CreateFolderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			config.InvalidRequestBody,
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	existingFolder, _ := service.GetFolderByFolderNameAndAccountID(req.Name, accountID)

	if existingFolder != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			config.FolderNameExists,
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	folder, err := service.CreateFolder(accountID, req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, config.GinErrorResponse(
			err.Error(),
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	response := response.FolderResponse{
		ID:         folder.ID,
		Name:       folder.Name,
		TotalFiles: folder.TotalFiles,
		CreatedAt:  folder.CreatedAt,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		response,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

func DeleteFolder(c *gin.Context) {
	accountID := c.GetUint("accountID")
	_, err := service.GetAccountByID(accountID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, config.GinErrorResponse(
			err.Error(),
			config.RestFulInternalError,
			config.RestFulCodeInternalError,
		))
		return
	}

	folderID64, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			"Invalid folder id",
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	err = service.DeleteFolderByID(accountID, uint(folderID64))
	if err != nil {
		if strings.Contains(err.Error(), "Folder has files") {
			c.JSON(http.StatusBadRequest, config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
			return
		}

		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, config.GinErrorResponse(
				err.Error(),
				config.RestFulNotFound,
				config.RestFulCodeNotFound,
			))
			return
		}

		c.JSON(http.StatusInternalServerError, config.GinErrorResponse(
			err.Error(),
			config.RestFulInternalError,
			config.RestFulCodeInternalError,
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
