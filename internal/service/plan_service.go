package service

import (
	"url-shortener/internal/model"
	"url-shortener/internal/repository"
)

func GetPlans() ([]model.Plan, error) {
	plans, err := repository.GetPlans()
	if err != nil {
		return nil, err
	}
	return plans, nil
}

func GetPlanByID(planID uint) (*model.Plan, error) {
	plan, err := repository.GetPlanByID(planID)
	if err != nil {
		return nil, err
	}
	return plan, nil
}
