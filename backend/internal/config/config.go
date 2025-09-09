package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

// Config holds all configuration for the application
type Config struct {
	// Server Configuration
	Port    string
	GinMode string
	LogLevel string

	// Database Configuration
	MongoURI string
	RedisURI string

	// WHO ICD-11 API Configuration
	ICD11 ICD11Config

	// ABHA OAuth Configuration
	ABHA ABHAConfig

	// Security Configuration
	JWTSecret     string
	EncryptionKey string

	// CORS Configuration
	CORS CORSConfig

	// Rate Limiting
	RateLimit RateLimitConfig

	// Monitoring
	PrometheusPort string

	// Sync Configuration
	Sync SyncConfig
}

// ICD11Config holds WHO ICD-11 API configuration
type ICD11Config struct {
	APIURL       string
	ClientID     string
	ClientSecret string
}

// ABHAConfig holds ABHA OAuth configuration
type ABHAConfig struct {
	AuthURL      string
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

// CORSConfig holds CORS configuration
type CORSConfig struct {
	AllowedOrigins []string
	AllowedMethods []string
	AllowedHeaders []string
}

// RateLimitConfig holds rate limiting configuration
type RateLimitConfig struct {
	RequestsPerMinute int
	Burst            int
}

// SyncConfig holds synchronization configuration
type SyncConfig struct {
	ICD11Interval time.Duration
	NAMASTECSVPath string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found, using environment variables")
	}

	config := &Config{
		Port:    getEnv("PORT", "8080"),
		GinMode: getEnv("GIN_MODE", "debug"),
		LogLevel: getEnv("LOG_LEVEL", "info"),

		MongoURI: getEnv("MONGO_URI", "mongodb://localhost:27017/ayushbridge"),
		RedisURI: getEnv("REDIS_URI", "redis://localhost:6379"),

		ICD11: ICD11Config{
			APIURL:       getEnv("ICD11_API_URL", "https://id.who.int/icd/release/11"),
			ClientID:     getEnv("ICD11_CLIENT_ID", ""),
			ClientSecret: getEnv("ICD11_CLIENT_SECRET", ""),
		},

		ABHA: ABHAConfig{
			AuthURL:      getEnv("ABHA_AUTH_URL", "https://abha.abdm.gov.in/auth"),
			ClientID:     getEnv("ABHA_CLIENT_ID", ""),
			ClientSecret: getEnv("ABHA_CLIENT_SECRET", ""),
			RedirectURI:  getEnv("ABHA_REDIRECT_URI", "http://localhost:8080/auth/abha/callback"),
		},

		JWTSecret:     getEnv("JWT_SECRET", "default-secret-change-in-production"),
		EncryptionKey: getEnv("ENCRYPTION_KEY", "change-this-32-char-secret-key!!!"),

		CORS: CORSConfig{
			AllowedOrigins: getEnvSlice("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
			AllowedMethods: getEnvSlice("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
			AllowedHeaders: getEnvSlice("CORS_ALLOWED_HEADERS", []string{"Content-Type", "Authorization", "X-Requested-With"}),
		},

		RateLimit: RateLimitConfig{
			RequestsPerMinute: getEnvInt("RATE_LIMIT_REQUESTS_PER_MINUTE", 100),
			Burst:            getEnvInt("RATE_LIMIT_BURST", 10),
		},

		PrometheusPort: getEnv("PROMETHEUS_PORT", "9090"),

		Sync: SyncConfig{
			ICD11Interval:  getEnvDuration("ICD11_SYNC_INTERVAL", 24*time.Hour),
			NAMASTECSVPath: getEnv("NAMASTE_CSV_PATH", "./data/namaste.csv"),
		},
	}

	return config, nil
}

// getEnv gets an environment variable with a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

// getEnvInt gets an environment variable as integer with a fallback value
func getEnvInt(key string, fallback int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return fallback
}

// getEnvDuration gets an environment variable as duration with a fallback value
func getEnvDuration(key string, fallback time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return fallback
}

// getEnvSlice gets an environment variable as slice with a fallback value
func getEnvSlice(key string, fallback []string) []string {
	if value := os.Getenv(key); value != "" {
		// Simple split by comma - you might want to use a more sophisticated parser
		result := make([]string, 0)
		for _, item := range strings.Split(value, ",") {
			if trimmed := strings.TrimSpace(item); trimmed != "" {
				result = append(result, trimmed)
			}
		}
		if len(result) > 0 {
			return result
		}
	}
	return fallback
}
