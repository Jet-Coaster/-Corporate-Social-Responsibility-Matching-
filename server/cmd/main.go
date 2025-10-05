package main

import (
	"csr-volunteer-matching/internal/config"
	"csr-volunteer-matching/internal/handler"
	"csr-volunteer-matching/internal/repository"
	"csr-volunteer-matching/internal/service"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg := config.LoadConfig()
	fmt.Println("Booting server...")

	var gormdb *gorm.DB
	var err error
	if cfg.DatabaseURL != "" {
		fmt.Println("Establishing connection to the database...")
		gormdb, err = gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}
	} else {
		fmt.Println("DATABASE_URL is empty; starting without a DB connection.")
	}

	repo := repository.NewRepository(gormdb)
	svc := service.NewService(repo)
	h := handler.NewHandler(svc)

	// Auto-migrate database
	if gormdb != nil {
		if err := svc.AutoMigrate(); err != nil {
			log.Fatalf("Failed to migrate database: %v", err)
		}
		fmt.Println("Database migration completed successfully")
	}

	router := gin.Default()

	c := cors.DefaultConfig()
	c.AllowOrigins = cfg.AllowOrigins
	c.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	c.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	c.AllowCredentials = true
	router.Use(cors.New(c))

	// base health for LB
	router.GET("/healthz", func(c *gin.Context) { c.Status(http.StatusNoContent) })

	// Register all routes
	h.RegisterRoutes(router)

	fmt.Printf("Starting server on %s\n", cfg.ServerAddress)
	if err := router.Run(cfg.ServerAddress); err != nil {
		log.Fatalf("Failed to run the server: %v", err)
	}
}
