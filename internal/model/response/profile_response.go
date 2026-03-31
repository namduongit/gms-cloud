package response

type ProfileResponse struct {
	Username    string `json:"username"`
	AvatarURL   string `json:"avatar_url"`
	FullName    string `json:"full_name"`
	CompanyName string `json:"company_name"`
	Address     string `json:"address"`
	Phone       string `json:"phone"`
}
