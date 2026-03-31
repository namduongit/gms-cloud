package response

import "time"

type FolderResponse struct {
	ID         uint   `json:"id"`
	Name       string `json:"name"`
	TotalFiles int    `json:"total_files"`

	CreatedAt time.Time `json:"created_at"`
}

type FolderListResponse struct {
	OwnerID uint             `json:"owner_id"`
	Folders []FolderResponse `json:"folders"`
}
