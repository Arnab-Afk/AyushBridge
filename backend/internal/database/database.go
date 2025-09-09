package database

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DB holds database connections
type DB struct {
	MongoDB *mongo.Database
	Redis   *redis.Client
}

// Connect initializes database connections
func Connect(mongoURI, redisURI string) (*DB, error) {
	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	// Test MongoDB connection
	if err := mongoClient.Ping(ctx, nil); err != nil {
		return nil, err
	}

	mongoDB := mongoClient.Database("ayushbridge")
	logrus.Info("Connected to MongoDB")

	// Connect to Redis
	redisOptions, err := redis.ParseURL(redisURI)
	if err != nil {
		logrus.Warn("Failed to parse Redis URL, using default options")
		redisOptions = &redis.Options{
			Addr: "localhost:6379",
		}
	}

	redisClient := redis.NewClient(redisOptions)

	// Test Redis connection
	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := redisClient.Ping(ctx).Err(); err != nil {
		logrus.Warn("Failed to connect to Redis: ", err)
		// Continue without Redis - it's optional for caching
	} else {
		logrus.Info("Connected to Redis")
	}

	return &DB{
		MongoDB: mongoDB,
		Redis:   redisClient,
	}, nil
}

// Close closes database connections
func (db *DB) Close() error {
	if db.MongoDB != nil {
		if err := db.MongoDB.Client().Disconnect(context.Background()); err != nil {
			return err
		}
	}

	if db.Redis != nil {
		if err := db.Redis.Close(); err != nil {
			return err
		}
	}

	return nil
}

// CreateIndexes creates necessary database indexes
func (db *DB) CreateIndexes() error {
	ctx := context.Background()

	// NAMASTE codes indexes
	namasteCollection := db.MongoDB.Collection("namaste_codes")
	_, err := namasteCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"code": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"display": "text", "designations.value": "text"},
		},
		{
			Keys: map[string]interface{}{"system": 1},
		},
		{
			Keys: map[string]interface{}{"properties.code": 1, "properties.value": 1},
		},
	})
	if err != nil {
		return err
	}

	// ICD-11 codes indexes
	icd11Collection := db.MongoDB.Collection("icd11_codes")
	_, err = icd11Collection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"code": 1, "module": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"display": "text"},
		},
		{
			Keys: map[string]interface{}{"module": 1},
		},
		{
			Keys: map[string]interface{}{"parent": 1},
		},
	})
	if err != nil {
		return err
	}

	// WHO Ayurveda codes indexes
	whoAyurvedaCollection := db.MongoDB.Collection("who_ayurveda_codes")
	_, err = whoAyurvedaCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"code": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"display": "text", "sanskrit": "text", "definition": "text"},
		},
		{
			Keys: map[string]interface{}{"category": 1},
		},
	})
	if err != nil {
		return err
	}

	// Concept mappings indexes
	mappingsCollection := db.MongoDB.Collection("concept_mappings")
	_, err = mappingsCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"sourceCode": 1, "source": 1, "target": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"targetCode": 1, "target": 1},
		},
		{
			Keys: map[string]interface{}{"confidence": -1},
		},
	})
	if err != nil {
		return err
	}

	// Audit logs indexes
	auditCollection := db.MongoDB.Collection("audit_logs")
	_, err = auditCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"userId": 1},
		},
		{
			Keys: map[string]interface{}{"timestamp": -1},
		},
		{
			Keys: map[string]interface{}{"action": 1},
		},
		{
			Keys: map[string]interface{}{"resource": 1},
		},
	})
	if err != nil {
		return err
	}

	// Users indexes
	usersCollection := db.MongoDB.Collection("users")
	_, err = usersCollection.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: map[string]interface{}{"abhaId": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"email": 1},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys: map[string]interface{}{"role": 1},
		},
	})
	if err != nil {
		return err
	}

	logrus.Info("Database indexes created successfully")
	return nil
}
