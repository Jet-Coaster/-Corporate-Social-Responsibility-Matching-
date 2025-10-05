package service

import (
    "csr-volunteer-matching/internal/model"
    "csr-volunteer-matching/internal/repository"
    "fmt"
    "time"
)

type Service struct { repo *repository.Repository }
func NewService(repo *repository.Repository) *Service { return &Service{repo: repo} }

// ... existing code ...

