package response

import "time"

type FolderResponse struct {
	UUID       string    `json:"uuid"`
	Name       string    `json:"name"`
	TotalFiles uint64    `json:"total_files"`
	TotalSize  uint64    `json:"total_size"`
	CreatedAt  time.Time `json:"created_at"`
}

type FolderListResponse struct {
	OwnerUUID string           `json:"owner_uuid"`
	Folders   []FolderResponse `json:"folders"`
}

type FolderDetailResponse struct {
	OwnerUUID string           `json:"owner_uuid"`
	Folder    FolderResponse   `json:"folder"`
	Folders   []FolderResponse `json:"folders"`
	Files     []FileResponse   `json:"files"`
}
