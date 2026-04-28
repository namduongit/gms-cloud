package request

type CreateFolderRequest struct {
	Name string `json:"name" validate:"required"`
}

type RenameFolderRequest struct {
	Name string `json:"name" validate:"required"`
}

