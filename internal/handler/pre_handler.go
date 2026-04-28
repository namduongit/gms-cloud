package handler

import (
	"net/http"
	"url-shortener/internal/config"
	"url-shortener/internal/http/request"
	"url-shortener/internal/service"
	"url-shortener/libs"

	"github.com/gin-gonic/gin"
)

func PresignUpload(c *gin.Context) {
	var req request.PresignUploadRequest
	if err := libs.WithBind(c, &req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			),
		)
		return
	}

	accountID := c.GetUint("accountID")

	var folderUUID string
	if req.FolderUUID != nil {
		folderUUID = *req.FolderUUID
	} else {
		folderUUID = ""
	}

	result, err := service.BatchInit(
		c,
		accountID,
		req.Files,
		folderUUID,
	)
	if err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			),
		)
		return
	}

	c.JSON(
		http.StatusOK,
		config.GinResponse(
			result,
			config.RestFulSuccess,
			nil,
			config.RestFulCodeSuccess,
		),
	)
}
