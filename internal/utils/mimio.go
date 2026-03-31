package utils

import (
	"mime/multipart"
	"strconv"
)

func GenStorageKey(accountID uint, folderID *uint, file *multipart.FileHeader) string {
	contentType := genLocation(file.Header.Get("Content-Type"))
	var storageKey string

	storageKey = contentType + "/"

	if folderID != nil {
		storageKey += strconv.FormatUint(uint64(accountID), 10) + "/" + strconv.FormatUint(uint64(*folderID), 10) + "/" + file.Filename
	} else {
		storageKey += strconv.FormatUint(uint64(accountID), 10) + "/" + file.Filename
	}

	return storageKey
}

func GetFileType(contentType string) string {
	switch contentType {
	case "image/jpeg", "image/png", "image/gif", "image/jpg":
		return "image"
	case "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation":
		return "document"
	default:
		return "private"
	}
}

/*
go-shortener
- image: image files (jpg, png, gif, jpeg)
- document: pdf, docx, xlsx, pptx,...
- private: compressed files (zip, rar, 7z,...), code files (go, js, py,...),
other files that are not in image and document category
*/
func genLocation(contentType string) string {
	switch contentType {
	case "image/jpeg", "image/png", "image/gif", "image/jpg":
		return "image"
	case "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation":
		return "document"
	default:
		return "private"
	}
}
