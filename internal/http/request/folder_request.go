package request

type CreateFolderRequest struct {
	Name             string  `json:"name" validate:"required"`
	FolderParentUUID *string `json:"folder_parent_uuid"`
}

type RenameFolderRequest struct {
	Name string `json:"name" validate:"required"`
}
