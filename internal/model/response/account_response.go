package response

type LoginResponse struct {
	Email    string `json:"email"`
	Role     string `json:"role"`
	PlanName string `json:"plan_name"`
}

type RegisterResponse struct {
	Email    string `json:"email"`
	Role     string `json:"role"`
	PlanName string `json:"plan_name"`
}

type AuthConfigResponse struct {
	IsAuthenticated bool `json:"is_authenticated"`
}
