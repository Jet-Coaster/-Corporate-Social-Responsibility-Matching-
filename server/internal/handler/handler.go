package handler

import (
    "csr-volunteer-matching/internal/model"
    "csr-volunteer-matching/internal/service"
    "net/http"
    "strconv"
    "strings"
    "time"

    "github.com/gin-gonic/gin"
)

type Handler struct {
    svc *service.Service
}

func NewHandler(svc *service.Service) *Handler { return &Handler{svc: svc} }

// Middleware for authentication
func (h *Handler) AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            c.Abort()
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        user, err := h.svc.ValidateToken(tokenString)
        if err != nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        c.Set("user", user)
        c.Next()
    }
}

// Middleware for role-based authorization
func (h *Handler) RequireRole(roles ...model.UserRole) gin.HandlerFunc {
    return func(c *gin.Context) {
        user, exists := c.Get("user")
        if !exists {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
            c.Abort()
            return
        }

        userObj := user.(*model.User)
        for _, role := range roles {
            if userObj.Role == role {
                c.Next()
                return
            }
        }

        c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
        c.Abort()
    }
}

func (h *Handler) RegisterRoutes(r *gin.Engine) {
    // Public routes
    r.GET("/ping", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"message": "pong"}) })

    // Authentication routes
    auth := r.Group("/auth")
    {
        auth.POST("/register", h.Register)
        auth.POST("/login", h.Login)
    }

    // Protected routes
    api := r.Group("/api/v1")
    api.Use(h.AuthMiddleware())
    h.RegisterAPIRoutes(api)
}

func (h *Handler) RegisterAPIRoutes(api *gin.RouterGroup) {
    // User profile routes
    api.GET("/profile", h.GetProfile)
    api.PUT("/profile", h.UpdateProfile)

    // PIN routes
    pin := api.Group("/pin")
    pin.Use(h.RequireRole(model.RolePIN))
    {
        pin.POST("/profile", h.CreatePINProfile)
        pin.GET("/profile", h.GetPINProfile)
        pin.PUT("/profile", h.UpdatePINProfile)
        pin.POST("/requests", h.CreatePINRequest)
        pin.GET("/requests", h.GetPINRequests)
        pin.GET("/requests/:id", h.GetPINRequest)
        pin.PUT("/requests/:id", h.UpdatePINRequest)
        pin.GET("/history", h.GetPINHistory)
    }

    // CSR Rep routes
    csr := api.Group("/csr")
    csr.Use(h.RequireRole(model.RoleCSRRep))
    {
        csr.POST("/profile", h.CreateCSRProfile)
        csr.GET("/profile", h.GetCSRProfile)
        csr.PUT("/profile", h.UpdateCSRProfile)
        csr.GET("/requests", h.SearchRequests)
        csr.GET("/requests/:id", h.GetRequest)
        csr.POST("/shortlist", h.AddToShortlist)
        csr.GET("/shortlist", h.GetShortlist)
        csr.DELETE("/shortlist/:id", h.RemoveFromShortlist)
        csr.POST("/matches", h.CreateMatch)
        csr.GET("/matches", h.GetCSRMatches)
        csr.GET("/matches/:id", h.GetMatch)
        csr.PUT("/matches/:id", h.UpdateMatch)
        csr.GET("/history", h.GetCSRHistory)
    }

    // Admin routes
    admin := api.Group("/admin")
    admin.Use(h.RequireRole(model.RoleAdmin))
    {
        admin.POST("/companies", h.CreateCompany)
        admin.GET("/companies", h.GetAllCompanies)
        admin.POST("/categories", h.CreateServiceCategory)
        admin.GET("/categories", h.GetAllServiceCategories)
        admin.PUT("/categories/:id", h.UpdateServiceCategory)
        admin.POST("/reports", h.GenerateReport)
        admin.GET("/reports", h.GetReports)
    }
}

// Authentication handlers
func (h *Handler) Register(c *gin.Context) {
    var req struct {
        Username string `json:"username" binding:"required"`
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required,min=6"`
        Role     string `json:"role" binding:"required,oneof=pin csr_rep admin platform"`
    }

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user, err := h.svc.RegisterUser(req.Username, req.Email, req.Password, model.UserRole(req.Role))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}

func (h *Handler) Login(c *gin.Context) {
    var req model.LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    response, err := h.svc.Login(req.Username, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, response)
}

func (h *Handler) GetProfile(c *gin.Context) {
    user, _ := c.Get("user")
    c.JSON(http.StatusOK, user)
}

func (h *Handler) UpdateProfile(c *gin.Context) {
    user, _ := c.Get("user")
    userObj := user.(*model.User)

    var req struct { Email string `json:"email"` }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    if req.Email != "" { userObj.Email = req.Email }
    if err := h.svc.UpdateUser(userObj); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, userObj)
}

// Remaining handlers identical to original implementation (PIN, CSR, Admin)
// omitted here for brevity.

