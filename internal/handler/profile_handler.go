package handler

import (
	"net/http"
	"strings"

	"url-shortener/internal/config"
	"url-shortener/internal/model/response"
	"url-shortener/internal/service"

	"github.com/gin-gonic/gin"
)

type UpdateProfileRequest struct {
	Username    *string `json:"username"`
	AvatarURL   *string `json:"avatar_url"`
	FullName    *string `json:"full_name"`
	CompanyName *string `json:"company_name"`
	Address     *string `json:"address"`
	Phone       *string `json:"phone"`
}

func GetProfile(c *gin.Context) {
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

	profile, err := service.GetProfileByAccountID(accountID)
	if err != nil {
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

	res := response.ProfileResponse{
		Username:    profile.Username,
		AvatarURL:   profile.AvatarURL,
		FullName:    profile.FullName,
		CompanyName: profile.CompanyName,
		Address:     profile.Address,
		Phone:       profile.Phone,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		res,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

func UpdateProfile(c *gin.Context) {
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

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			config.InvalidRequestBody,
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	updates := map[string]any{}
	if req.Username != nil {
		updates["username"] = *req.Username
	}
	if req.AvatarURL != nil {
		updates["avatar_url"] = *req.AvatarURL
	}
	if req.FullName != nil {
		updates["full_name"] = *req.FullName
	}
	if req.CompanyName != nil {
		updates["company_name"] = *req.CompanyName
	}
	if req.Address != nil {
		updates["address"] = *req.Address
	}
	if req.Phone != nil {
		updates["phone"] = *req.Phone
	}

	profile, err := service.UpdateProfileByAccountID(accountID, updates)
	if err != nil {
		if strings.Contains(err.Error(), "No profile fields to update") {
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

	res := response.ProfileResponse{
		Username:    profile.Username,
		AvatarURL:   profile.AvatarURL,
		FullName:    profile.FullName,
		CompanyName: profile.CompanyName,
		Address:     profile.Address,
		Phone:       profile.Phone,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		res,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}
