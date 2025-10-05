package config

import (
    "os"
    "strings"
)

type Config struct {
    ServerAddress string
    DatabaseURL   string
    AllowOrigins  []string
}

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

func LoadConfig() *Config {
    return &Config{
        ServerAddress: getenv("SERVER_ADDRESS", ":8080"),
        DatabaseURL:   getenv("DATABASE_URL", ""),
        AllowOrigins:  strings.Split(getenv("CORS_ALLOW_ORIGINS", "http://127.0.0.1:5500,http://127.0.0.1:5501"), ","),
    }
}

