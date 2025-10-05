package repository

import (
	"csr-volunteer-matching/internal/model"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

// Auto-migrate all models
func (r *Repository) AutoMigrate() error {
	return r.db.AutoMigrate(
		&model.User{},
		&model.PIN{},
		&model.CSRRep{},
		&model.Company{},
		&model.ServiceCategory{},
		&model.PINRequest{},
		&model.Shortlist{},
		&model.Match{},
		&model.ViewLog{},
		&model.Report{},
	)
}

// User operations
func (r *Repository) CreateUser(user *model.User) error { return r.db.Create(user).Error }
func (r *Repository) GetUserByUsername(username string) (*model.User, error) {
	var user model.User
	err := r.db.Where("username = ?", username).First(&user).Error
	return &user, err
}
func (r *Repository) GetUserByID(id uint) (*model.User, error) {
	var user model.User
	err := r.db.First(&user, id).Error
	return &user, err
}
func (r *Repository) UpdateUser(user *model.User) error { return r.db.Save(user).Error }

// PIN operations
func (r *Repository) CreatePIN(pin *model.PIN) error { return r.db.Create(pin).Error }
func (r *Repository) GetPINByUserID(userID uint) (*model.PIN, error) {
	var pin model.PIN
	err := r.db.Preload("User").Where("user_id = ?", userID).First(&pin).Error
	return &pin, err
}
func (r *Repository) UpdatePIN(pin *model.PIN) error { return r.db.Save(pin).Error }

// CSR Rep operations
func (r *Repository) CreateCSRRep(csrRep *model.CSRRep) error { return r.db.Create(csrRep).Error }
func (r *Repository) GetCSRRepByUserID(userID uint) (*model.CSRRep, error) {
	var csrRep model.CSRRep
	err := r.db.Preload("User").Preload("Company").Where("user_id = ?", userID).First(&csrRep).Error
	return &csrRep, err
}
func (r *Repository) UpdateCSRRep(csrRep *model.CSRRep) error { return r.db.Save(csrRep).Error }

// Company operations
func (r *Repository) CreateCompany(company *model.Company) error { return r.db.Create(company).Error }
func (r *Repository) GetCompanyByID(id uint) (*model.Company, error) {
	var company model.Company
	err := r.db.First(&company, id).Error
	return &company, err
}
func (r *Repository) GetAllCompanies() ([]model.Company, error) {
	var companies []model.Company
	err := r.db.Find(&companies).Error
	return companies, err
}

// Service Category operations
func (r *Repository) CreateServiceCategory(category *model.ServiceCategory) error {
	return r.db.Create(category).Error
}
func (r *Repository) GetServiceCategoryByID(id uint) (*model.ServiceCategory, error) {
	var category model.ServiceCategory
	err := r.db.First(&category, id).Error
	return &category, err
}
func (r *Repository) GetAllServiceCategories() ([]model.ServiceCategory, error) {
	var categories []model.ServiceCategory
	err := r.db.Where("is_active = ?", true).Find(&categories).Error
	return categories, err
}
func (r *Repository) UpdateServiceCategory(category *model.ServiceCategory) error {
	return r.db.Save(category).Error
}

// PIN Request operations
func (r *Repository) CreatePINRequest(request *model.PINRequest) error {
	return r.db.Create(request).Error
}
func (r *Repository) GetPINRequestByID(id uint) (*model.PINRequest, error) {
	var request model.PINRequest
	err := r.db.Preload("PIN").Preload("PIN.User").Preload("Category").First(&request, id).Error
	return &request, err
}
func (r *Repository) GetPINRequestsByPINID(pinID uint) ([]model.PINRequest, error) {
	var requests []model.PINRequest
	err := r.db.Preload("Category").Where("pin_id = ?", pinID).Find(&requests).Error
	return requests, err
}
func (r *Repository) SearchPINRequests(filter model.RequestFilter, page, pageSize int) ([]model.PINRequest, int64, error) {
	var requests []model.PINRequest
	var total int64
	query := r.db.Model(&model.PINRequest{}).Preload("PIN").Preload("PIN.User").Preload("Category")
	if filter.CategoryID != nil {
		query = query.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Urgency != nil {
		query = query.Where("urgency = ?", *filter.Urgency)
	}
	if filter.StartDate != nil {
		query = query.Where("created_at >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("created_at <= ?", *filter.EndDate)
	}
	if filter.Location != nil {
		query = query.Where("location ILIKE ?", "%"+*filter.Location+"%")
	}
	if filter.Search != nil {
		query = query.Where("(title ILIKE ? OR description ILIKE ?)", "%"+*filter.Search+"%", "%"+*filter.Search+"%")
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&requests).Error
	return requests, total, err
}
func (r *Repository) UpdatePINRequest(request *model.PINRequest) error {
	return r.db.Save(request).Error
}
func (r *Repository) IncrementViewCount(requestID uint) error {
	return r.db.Model(&model.PINRequest{}).Where("id = ?", requestID).UpdateColumn("view_count", gorm.Expr("view_count + 1")).Error
}
func (r *Repository) IncrementShortlistCount(requestID uint) error {
	return r.db.Model(&model.PINRequest{}).Where("id = ?", requestID).UpdateColumn("shortlist_count", gorm.Expr("shortlist_count + 1")).Error
}

// Shortlist operations
func (r *Repository) CreateShortlist(shortlist *model.Shortlist) error {
	return r.db.Create(shortlist).Error
}
func (r *Repository) GetShortlistByCSRRepID(csrRepID uint) ([]model.Shortlist, error) {
	var shortlists []model.Shortlist
	err := r.db.Preload("Request").Preload("Request.PIN").Preload("Request.PIN.User").Preload("Request.Category").Where("csr_rep_id = ?", csrRepID).Find(&shortlists).Error
	return shortlists, err
}
func (r *Repository) GetShortlistByID(id uint) (*model.Shortlist, error) {
	var shortlist model.Shortlist
	err := r.db.Preload("Request").Preload("Request.PIN").Preload("Request.PIN.User").Preload("Request.Category").First(&shortlist, id).Error
	return &shortlist, err
}
func (r *Repository) DeleteShortlist(id uint) error { return r.db.Delete(&model.Shortlist{}, id).Error }
func (r *Repository) CheckShortlistExists(csrRepID, requestID uint) (bool, error) {
	var count int64
	err := r.db.Model(&model.Shortlist{}).Where("csr_rep_id = ? AND request_id = ?", csrRepID, requestID).Count(&count).Error
	return count > 0, err
}

// Match operations
func (r *Repository) CreateMatch(match *model.Match) error {
	return r.db.Omit(clause.Associations).Create(match).Error
}
func (r *Repository) GetMatchByID(id uint) (*model.Match, error) {
	var match model.Match
	err := r.db.Preload("CSRRep").Preload("CSRRep.User").Preload("CSRRep.Company").Preload("Request").Preload("Request.Category").Preload("PIN").Preload("PIN.User").First(&match, id).Error
	return &match, err
}
func (r *Repository) SearchMatches(filter model.MatchFilter, page, pageSize int) ([]model.Match, int64, error) {
	var matches []model.Match
	var total int64
	query := r.db.Model(&model.Match{}).Preload("CSRRep").Preload("CSRRep.User").Preload("CSRRep.Company").Preload("Request").Preload("Request.Category").Preload("PIN").Preload("PIN.User")
	if filter.CSRRepID != nil {
		query = query.Where("csr_rep_id = ?", *filter.CSRRepID)
	}
	if filter.PINID != nil {
		query = query.Where("pin_id = ?", *filter.PINID)
	}
	if filter.CategoryID != nil {
		query = query.Joins("JOIN pin_requests ON matches.request_id = pin_requests.id").Where("pin_requests.category_id = ?", *filter.CategoryID)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.StartDate != nil {
		query = query.Where("created_at >= ?", *filter.StartDate)
	}
	if filter.EndDate != nil {
		query = query.Where("created_at <= ?", *filter.EndDate)
	}
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	offset := (page - 1) * pageSize
	err := query.Offset(offset).Limit(pageSize).Order("created_at DESC").Find(&matches).Error
	return matches, total, err
}
func (r *Repository) UpdateMatch(match *model.Match) error { return r.db.Save(match).Error }

// View Log operations
func (r *Repository) CreateViewLog(viewLog *model.ViewLog) error { return r.db.Create(viewLog).Error }

// Report operations
func (r *Repository) CreateReport(report *model.Report) error { return r.db.Create(report).Error }
func (r *Repository) GetReportsByType(reportType string, limit int) ([]model.Report, error) {
	var reports []model.Report
	query := r.db.Where("report_type = ?", reportType).Order("generated_at DESC")
	if limit > 0 {
		query = query.Limit(limit)
	}
	err := query.Find(&reports).Error
	return reports, err
}

// Statistics operations
func (r *Repository) GetRequestStats(startDate, endDate time.Time) (map[string]interface{}, error) {
	stats := make(map[string]interface{})
	var totalRequests int64
	if err := r.db.Model(&model.PINRequest{}).Where("created_at BETWEEN ? AND ?", startDate, endDate).Count(&totalRequests).Error; err != nil {
		return nil, err
	}
	stats["total_requests"] = totalRequests

	var statusStats []struct {
		Status string
		Count  int64
	}
	if err := r.db.Model(&model.PINRequest{}).Select("status, count(*) as count").Where("created_at BETWEEN ? AND ?", startDate, endDate).Group("status").Scan(&statusStats).Error; err != nil {
		return nil, err
	}
	stats["by_status"] = statusStats

	var urgencyStats []struct {
		Urgency string
		Count   int64
	}
	if err := r.db.Model(&model.PINRequest{}).Select("urgency, count(*) as count").Where("created_at BETWEEN ? AND ?", startDate, endDate).Group("urgency").Scan(&urgencyStats).Error; err != nil {
		return nil, err
	}
	stats["by_urgency"] = urgencyStats

	var totalMatches int64
	if err := r.db.Model(&model.Match{}).Where("created_at BETWEEN ? AND ?", startDate, endDate).Count(&totalMatches).Error; err != nil {
		return nil, err
	}
	stats["total_matches"] = totalMatches

	var completedMatches int64
	if err := r.db.Model(&model.Match{}).Where("status = ? AND created_at BETWEEN ? AND ?", "completed", startDate, endDate).Count(&completedMatches).Error; err != nil {
		return nil, err
	}
	stats["completed_matches"] = completedMatches
	return stats, nil
}
