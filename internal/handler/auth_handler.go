package handler

import (
	"net/http"
	"strings"
	"url-shortener/internal/config"
	"url-shortener/internal/model/response"
	"url-shortener/internal/service"
	"url-shortener/internal/utils"

	"github.com/gin-gonic/gin"
)

var cfg = config.GetConfig()

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(
			http.StatusBadRequest,
			config.GinErrorResponse(
				err.Error(),
				config.RestFulInvalid,
				config.RestFulCodeInvalid,
			))
		return
	}

	account, err := service.Register(req.Email, req.Password)

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

	service.PreloadPlanForAccount(account)

	response := response.RegisterResponse{
		Email:    account.Email,
		Role:     string(account.Role),
		PlanName: account.Plan.Name,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		response,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, config.GinErrorResponse(
			err.Error(),
			config.RestFulInvalid,
			config.RestFulCodeInvalid,
		))
		return
	}

	account, err := service.Login(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, config.GinErrorResponse(
			err.Error(),
			config.RestFulUnauthorized,
			config.RestFulCodeUnauthorized,
		))
		return
	}

	service.PreloadPlanForAccount(account)

	tokenString, _ := utils.GenerateToken(
		map[string]any{
			"uid":   account.ID,
			"email": account.Email,
			"plan":  account.Plan.Name,
		}, string(cfg.JWTSecret), string(account.Role), int(account.ID),
	)

	response := response.LoginResponse{
		Email:    account.Email,
		Role:     string(account.Role),
		PlanName: account.Plan.Name,
	}

	secureCookie := cfg.ENV == config.Production
	// If true, the cookie will only be sent over HTTPS. In production, this should be true.
	// In development, you might want to set it to false if you're not using HTTPS locally.
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "accessToken",
		Value:    *tokenString,
		Path:     "/",
		MaxAge:   24 * 60 * 60,
		HttpOnly: true,
		Secure:   secureCookie,
		SameSite: http.SameSiteLaxMode,
	})

	c.JSON(http.StatusOK, config.GinResponse(
		response,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

/* Ignore */

func AuthConfig(c *gin.Context) {
	tokenStr, err := c.Cookie("accessToken")
	authenticated := false

	if err == nil && strings.TrimSpace(tokenStr) != "" {
		authenticated = utils.VerifyToken(tokenStr, string(cfg.JWTSecret))
		if !authenticated {
			clearAccessTokenCookie(c)
		}
	} else {
		clearAccessTokenCookie(c)
	}

	response := response.AuthConfigResponse{
		IsAuthenticated: authenticated,
	}

	c.JSON(http.StatusOK, config.GinResponse(
		response,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

func Logout(c *gin.Context) {
	clearAccessTokenCookie(c)

	c.JSON(http.StatusOK, config.GinResponse(
		nil,
		config.RestFulSuccess,
		nil,
		config.RestFulCodeSuccess,
	))
}

func clearAccessTokenCookie(c *gin.Context) {
	secureCookie := cfg.ENV == config.Production
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   secureCookie,
		SameSite: http.SameSiteLaxMode,
	})
}
