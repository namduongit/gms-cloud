package utils

import (
	"strconv"
	"url-shortener/internal/model"
)

func BuildTmpKey(accountID uint, fileName string, folder *model.Folder) string {
	var destination string
	destination += strconv.Itoa(int(accountID)) + "/"
	if folder != nil {
		destination += strconv.FormatUint(uint64(folder.ID), 10) + "/"
	}
	destination += fileName
	return destination
}

func BuildFinalKey(accountID uint, fileName string, folder *model.Folder) string {
	var destination string
	destination += cfg.MiniOFinalBucketName + "/"
	destination += strconv.Itoa(int(accountID)) + "/"
	if folder != nil {
		destination += strconv.FormatUint(uint64(folder.ID), 10) + "/"
	}
	destination += fileName
	return destination
}
