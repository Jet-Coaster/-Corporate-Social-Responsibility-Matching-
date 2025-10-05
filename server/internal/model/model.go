package model

import (
    "time"
    "gorm.io/gorm"
)

type UserRole string

const (
    RoleAdmin    UserRole = "admin"
    RoleCSRRep   UserRole = "csr_rep"
    RolePIN      UserRole = "pin"
    RolePlatform UserRole = "platform"
)

type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    Username string   `gorm:"type:varchar(100);unique;not null" json:"username"`
    Email    string   `gorm:"type:varchar(255);unique;not null" json:"email"`
    Password string   `gorm:"type:varchar(255);not null" json:"-"`
    Role     UserRole `gorm:"type:varchar(50);not null" json:"role"`
    IsActive bool     `gorm:"default:true" json:"is_active"`
}

type PIN struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    UserID      uint   `gorm:"not null" json:"user_id"`
    User        User   `gorm:"foreignKey:UserID" json:"user"`
    FirstName   string `gorm:"type:varchar(100);not null" json:"first_name"`
    LastName    string `gorm:"type:varchar(100);not null" json:"last_name"`
    Phone       string `gorm:"type:varchar(20)" json:"phone"`
    Address     string `gorm:"type:text" json:"address"`
    DateOfBirth *time.Time `json:"date_of_birth"`
    EmergencyContact string `gorm:"type:varchar(255)" json:"emergency_contact"`
    MedicalInfo string `gorm:"type:text" json:"medical_info"`
    SpecialNeeds string `gorm:"type:text" json:"special_needs"`
}

type CSRRep struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    UserID     uint   `gorm:"not null" json:"user_id"`
    User       User   `gorm:"foreignKey:UserID" json:"user"`
    CompanyID  uint   `gorm:"not null" json:"company_id"`
    Company    Company `gorm:"foreignKey:CompanyID" json:"company"`
    FirstName  string `gorm:"type:varchar(100);not null" json:"first_name"`
    LastName   string `gorm:"type:varchar(100);not null" json:"last_name"`
    Phone      string `gorm:"type:varchar(20)" json:"phone"`
    Department string `gorm:"type:varchar(100)" json:"department"`
    Position   string `gorm:"type:varchar(100)" json:"position"`
}

type Company struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    Name        string `gorm:"type:varchar(255);not null" json:"name"`
    Industry    string `gorm:"type:varchar(100)" json:"industry"`
    Address     string `gorm:"type:text" json:"address"`
    Phone       string `gorm:"type:varchar(20)" json:"phone"`
    Email       string `gorm:"type:varchar(255)" json:"email"`
    Website     string `gorm:"type:varchar(255)" json:"website"`
    Description string `gorm:"type:text" json:"description"`
}

type ServiceCategory struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    Name        string `gorm:"type:varchar(255);not null" json:"name"`
    Description string `gorm:"type:text" json:"description"`
    IsActive    bool   `gorm:"default:true" json:"is_active"`
}

type PINRequest struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    PINID           uint            `gorm:"not null" json:"pin_id"`
    PIN             PIN             `gorm:"foreignKey:PINID" json:"pin"`
    CategoryID      uint            `gorm:"not null" json:"category_id"`
    Category        ServiceCategory `gorm:"foreignKey:CategoryID" json:"category"`
    Title           string          `gorm:"type:varchar(255);not null" json:"title"`
    Description     string          `gorm:"type:text;not null" json:"description"`
    Urgency         string          `gorm:"type:varchar(50);default:'medium'" json:"urgency"`
    Status          string          `gorm:"type:varchar(50);default:'open'" json:"status"`
    PreferredDate   *time.Time      `json:"preferred_date"`
    Location        string          `gorm:"type:varchar(255)" json:"location"`
    SpecialNotes    string          `gorm:"type:text" json:"special_notes"`
    ViewCount       int             `gorm:"default:0" json:"view_count"`
    ShortlistCount  int             `gorm:"default:0" json:"shortlist_count"`
}

type Shortlist struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    CSRRepID  uint        `gorm:"not null" json:"csr_rep_id"`
    CSRRep    CSRRep      `gorm:"foreignKey:CSRRepID" json:"csr_rep"`
    RequestID uint        `gorm:"not null" json:"request_id"`
    Request   PINRequest  `gorm:"foreignKey:RequestID" json:"request"`
    Notes     string      `gorm:"type:text" json:"notes"`
    Priority  string      `gorm:"type:varchar(50);default:'medium'" json:"priority"`
}

type Match struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    CSRRepID     uint       `gorm:"not null" json:"csr_rep_id"`
    CSRRep       CSRRep     `gorm:"foreignKey:CSRRepID" json:"csr_rep"`
    RequestID    uint       `gorm:"not null" json:"request_id"`
    Request      PINRequest `gorm:"foreignKey:RequestID" json:"request"`
    PINID        uint       `gorm:"not null" json:"pin_id"`
    PIN          PIN        `gorm:"foreignKey:PINID" json:"pin"`
    Status       string     `gorm:"type:varchar(50);default:'pending'" json:"status"`
    StartDate    *time.Time `json:"start_date"`
    EndDate      *time.Time `json:"end_date"`
    CompletedAt  *time.Time `json:"completed_at"`
    Rating       *int       `gorm:"type:smallint;check:rating IS NULL OR (rating >= 1 AND rating <= 5)" json:"rating"`
    Feedback     string     `gorm:"type:text" json:"feedback"`
    Notes        string     `gorm:"type:text" json:"notes"`
}

type ViewLog struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    CSRRepID  uint       `gorm:"not null" json:"csr_rep_id"`
    CSRRep    CSRRep     `gorm:"foreignKey:CSRRepID" json:"csr_rep"`
    RequestID uint       `gorm:"not null" json:"request_id"`
    Request   PINRequest `gorm:"foreignKey:RequestID" json:"request"`
    IPAddress string     `gorm:"type:varchar(45)" json:"ip_address"`
    UserAgent string     `gorm:"type:text" json:"user_agent"`
}

type Report struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
    DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
    ReportType string    `gorm:"type:varchar(50);not null" json:"report_type"`
    Period     string    `gorm:"type:varchar(20);not null" json:"period"`
    Data       string    `gorm:"type:jsonb" json:"data"`
    GeneratedAt time.Time `json:"generated_at"`
}

type RequestFilter struct {
    CategoryID *uint      `json:"category_id,omitempty"`
    Status     *string    `json:"status,omitempty"`
    Urgency    *string    `json:"urgency,omitempty"`
    StartDate  *time.Time `json:"start_date,omitempty"`
    EndDate    *time.Time `json:"end_date,omitempty"`
    Location   *string    `json:"location,omitempty"`
    Search     *string    `json:"search,omitempty"`
}

type MatchFilter struct {
    CSRRepID   *uint      `json:"csr_rep_id,omitempty"`
    PINID      *uint      `json:"pin_id,omitempty"`
    CategoryID *uint      `json:"category_id,omitempty"`
    Status     *string    `json:"status,omitempty"`
    StartDate  *time.Time `json:"start_date,omitempty"`
    EndDate    *time.Time `json:"end_date,omitempty"`
}

type Pagination struct {
    Page     int `json:"page"`
    PageSize int `json:"page_size"`
    Total    int `json:"total"`
}

type PaginatedResponse struct {
    Data       interface{} `json:"data"`
    Pagination Pagination  `json:"pagination"`
}

type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User  User   `json:"user"`
}

type CreatePINRequest struct {
    Title           string     `json:"title" binding:"required"`
    Description     string     `json:"description" binding:"required"`
    CategoryID      uint       `json:"category_id" binding:"required"`
    Urgency         string     `json:"urgency"`
    PreferredDate   *time.Time `json:"preferred_date"`
    Location        string     `json:"location"`
    SpecialNotes    string     `json:"special_notes"`
}

type UpdatePINRequest struct {
    Title           *string     `json:"title,omitempty"`
    Description     *string     `json:"description,omitempty"`
    CategoryID      *uint       `json:"category_id,omitempty"`
    Urgency         *string     `json:"urgency,omitempty"`
    Status          *string     `json:"status,omitempty"`
    PreferredDate   *time.Time  `json:"preferred_date,omitempty"`
    Location        *string     `json:"location,omitempty"`
    SpecialNotes    *string     `json:"special_notes,omitempty"`
}

type CreateShortlistRequest struct {
    RequestID uint   `json:"request_id" binding:"required"`
    Notes     string `json:"notes"`
    Priority  string `json:"priority"`
}

type CreateMatchRequest struct {
    RequestID uint       `json:"request_id" binding:"required"`
    StartDate *time.Time `json:"start_date"`
    Notes     string     `json:"notes"`
}

