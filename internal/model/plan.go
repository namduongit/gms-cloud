package model

import "gorm.io/gorm"

/*
- Price is VND unit
- If you want to change price, please setup the price carefully
*/
type Plan struct {
	gorm.Model

	Name         string
	Price        int
	StorageLimit int64
	URLLimit     int64

	Accounts []Account
}
