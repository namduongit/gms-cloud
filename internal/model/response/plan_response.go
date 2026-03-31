package response

type PlanResponse struct {
	ID           uint   `json:"id"`
	Name         string `json:"name"`
	Price        int    `json:"price"`
	StorageLimit int64  `json:"storage_limit"`
	URLLimit     int64  `json:"url_limit"`
}
