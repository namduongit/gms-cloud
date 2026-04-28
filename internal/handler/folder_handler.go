package handler

import (
	"net/http"
	"url-shortener/internal/config"
	"url-shortener/internal/http/request"
	"url-shortener/internal/http/response"
	"url-shortener/internal/model"
	"url-shortener/internal/service"
	"url-shortener/libs"

	"github.com/gin-gonic/gin"
)

func GetFolders(c *gin.Context) {
	account := c.MustGet("account").(*model.Account)

	folders, err := service.GetFolders(account.ID)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	folderResponses := make([]response.FolderResponse, len(folders))
	for i, folder := range folders {
		folderResponses[i] = response.FolderResponse{
			UUID:       folder.UUID.String(),
			Name:       folder.Name,
			TotalFiles: folder.TotalFile,
			TotalSize:  folder.TotalSize,
			CreatedAt:  folder.CreatedAt,
		}
	}

	resp := response.FolderListResponse{
		OwnerUUID: account.UUID.String(),
		Folders:   folderResponses,
	}

	c.JSON(
		http.StatusOK,
		config.GinResponse(
			resp,
			config.RestFulSuccess,
			nil,
			config.RestFulCodeSuccess,
		))
}

func CreateFolder(c *gin.Context) {
	var req request.CreateFolderRequest
	if err := libs.WithBind(c, &req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	account := c.MustGet("account").(*model.Account)

	folder, err := service.CreateFolder(account.ID, req.Name)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	resp := response.FolderResponse{
		UUID:       folder.UUID.String(),
		Name:       folder.Name,
		TotalFiles: folder.TotalFile,
		TotalSize:  folder.TotalSize,
		CreatedAt:  folder.CreatedAt,
	}

	c.JSON(
		http.StatusOK,
		config.GinResponse(
			resp,
			config.RestFulSuccess,
			nil,
			config.RestFulCodeSuccess,
		))
}

func GetFolderDetail(c *gin.Context) {
	account := c.MustGet("account").(*model.Account)
	folderUUID := c.Param("uuid")

	// Get the folder
	folder, err := service.GetFolderByUUID(folderUUID)
	if err != nil {
		c.JSON(
			http.StatusNotFound,
			config.GinErrorResponse(
				"Folder not found",
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	// Verify ownership
	if folder.AccountID != account.ID {
		c.JSON(
			http.StatusForbidden,
			config.GinErrorResponse(
				"You don't have permission to access this folder",
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	// Get all folders for the account
	folders, err := service.GetFolders(account.ID)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	folderResponses := make([]response.FolderResponse, len(folders))
	for i, f := range folders {
		folderResponses[i] = response.FolderResponse{
			UUID:       f.UUID.String(),
			Name:       f.Name,
			TotalFiles: f.TotalFile,
			TotalSize:  f.TotalSize,
			CreatedAt:  f.CreatedAt,
		}
	}

	// Get files in this folder
	files, err := service.GetFilesByFolderUUID(account.ID, folderUUID)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	fileResponses := make([]response.FileResponse, len(files))
	for i, file := range files {
		folderName := ""
		if file.Folder != nil {
			folderName = file.Folder.Name
		}

		var folderUUIDPtr *string
		if file.FolderID != nil {
			folderUUIDStr := file.Folder.UUID.String()
			folderUUIDPtr = &folderUUIDStr
		}

		fileResponses[i] = response.FileResponse{
			UUID:        file.UUID.String(),
			FileName:    file.FileName,
			ContentType: file.ContentType,
			Size:        file.Size,
			IsShared:    file.IsShared,
			FolderUUID:  folderUUIDPtr,
			FolderName:  folderName,
			UploadedAt:  file.CreatedAt,
		}
	}

	folderResponse := response.FolderResponse{
		UUID:       folder.UUID.String(),
		Name:       folder.Name,
		TotalFiles: folder.TotalFile,
		TotalSize:  folder.TotalSize,
		CreatedAt:  folder.CreatedAt,
	}

	resp := response.FolderDetailResponse{
		OwnerUUID: account.UUID.String(),
		Folder:    folderResponse,
		Folders:   folderResponses,
		Files:     fileResponses,
	}

	c.JSON(
		http.StatusOK,
		config.GinResponse(
			resp,
			config.RestFulSuccess,
			nil,
			config.RestFulCodeSuccess,
		))
}

/**
 * * Delete folder and all related files, reclaim storage quota
 * TODO: Verify ownership -> Delete all files in folder (reclaim quota) -> Delete folder
 */
func DeleteFolder(c *gin.Context) {
	account := c.MustGet("account").(*model.Account)
	folderUUID := c.Param("uuid")

	folder, err := service.GetFolderByUUID(folderUUID)
	if err != nil {
		c.JSON(
			http.StatusNotFound,
			config.GinErrorResponse(
				"Folder not found",
				config.RestFulNotFound,
				config.RestFulCodeNotFound,
			))
		return
	}

	if folder.AccountID != account.ID {
		c.JSON(
			http.StatusForbidden,
			config.GinErrorResponse(
				"You don't have permission to delete this folder",
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	if err := service.DeleteFolder(account.ID, folder); err != nil {
		c.JSON(
			http.StatusInternalServerError,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
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

/**
 * * Rename folder
 * TODO: Verify ownership -> Update folder name
 */
func RenameFolder(c *gin.Context) {
	var req request.RenameFolderRequest
	if err := libs.WithBind(c, &req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	account := c.MustGet("account").(*model.Account)
	folderUUID := c.Param("uuid")

	folder, err := service.GetFolderByUUID(folderUUID)
	if err != nil {
		c.JSON(
			http.StatusNotFound,
			config.GinErrorResponse(
				"Folder not found",
				config.RestFulNotFound,
				config.RestFulCodeNotFound,
			))
		return
	}

	if folder.AccountID != account.ID {
		c.JSON(
			http.StatusForbidden,
			config.GinErrorResponse(
				"You don't have permission to rename this folder",
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	if err := service.RenameFolder(folder, req.Name); err != nil {
		c.JSON(
			http.StatusInternalServerError,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	resp := response.FolderResponse{
		UUID:       folder.UUID.String(),
		Name:       folder.Name,
		TotalFiles: folder.TotalFile,
		TotalSize:  folder.TotalSize,
		CreatedAt:  folder.CreatedAt,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		resp,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}
