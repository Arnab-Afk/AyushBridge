package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// NAMASTECode represents a NAMASTE terminology code
type NAMASTECode struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Code         string             `bson:"code" json:"code" binding:"required"`
	Display      string             `bson:"display" json:"display" binding:"required"`
	System       string             `bson:"system" json:"system"`
	Language     string             `bson:"language" json:"language"`
	Designations []Designation      `bson:"designations" json:"designations"`
	Properties   []Property         `bson:"properties" json:"properties"`
	Version      string             `bson:"version" json:"version"`
	Status       string             `bson:"status" json:"status"`
	Created      time.Time          `bson:"created" json:"created"`
	Updated      time.Time          `bson:"updated" json:"updated"`
}

// ICD11Code represents an ICD-11 code (TM2 or Biomedicine)
type ICD11Code struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Code          string             `bson:"code" json:"code" binding:"required"`
	Display       string             `bson:"display" json:"display" binding:"required"`
	System        string             `bson:"system" json:"system"`
	Module        string             `bson:"module" json:"module"` // "tm2" or "biomedicine"
	Parent        string             `bson:"parent" json:"parent"`
	Linearization string             `bson:"linearization" json:"linearization"`
	Version       string             `bson:"version" json:"version"`
	LastSync      time.Time          `bson:"lastSync" json:"lastSync"`
	Properties    []Property         `bson:"properties" json:"properties"`
	Children      []string           `bson:"children" json:"children"`
}

// WHO Ayurveda Code represents WHO standardized international terminologies for Ayurveda
type WHOAyurvedaCode struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Code         string             `bson:"code" json:"code" binding:"required"`
	Display      string             `bson:"display" json:"display" binding:"required"`
	System       string             `bson:"system" json:"system"`
	Category     string             `bson:"category" json:"category"` // e.g., "dosha", "rasa", "virya"
	Sanskrit     string             `bson:"sanskrit" json:"sanskrit"`
	Definition   string             `bson:"definition" json:"definition"`
	Designations []Designation      `bson:"designations" json:"designations"`
	Properties   []Property         `bson:"properties" json:"properties"`
	Version      string             `bson:"version" json:"version"`
	Created      time.Time          `bson:"created" json:"created"`
	Updated      time.Time          `bson:"updated" json:"updated"`
}

// ConceptMapping represents a mapping between two code systems
type ConceptMapping struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Source       string             `bson:"source" json:"source"`
	Target       string             `bson:"target" json:"target"`
	SourceCode   string             `bson:"sourceCode" json:"sourceCode"`
	TargetCode   string             `bson:"targetCode" json:"targetCode"`
	Equivalence  string             `bson:"equivalence" json:"equivalence"` // "equivalent", "wider", "narrower", "inexact"
	Confidence   float64            `bson:"confidence" json:"confidence"`
	Comment      string             `bson:"comment" json:"comment"`
	ValidatedBy  string             `bson:"validatedBy" json:"validatedBy"`
	ValidatedAt  time.Time          `bson:"validatedAt" json:"validatedAt"`
	Version      string             `bson:"version" json:"version"`
	LastUpdated  time.Time          `bson:"lastUpdated" json:"lastUpdated"`
}

// Designation represents alternative displays for a code
type Designation struct {
	Language string `bson:"language" json:"language"`
	Value    string `bson:"value" json:"value"`
	Use      string `bson:"use,omitempty" json:"use,omitempty"` // "preferred", "synonym", "abbreviation"
}

// Property represents additional properties for a code
type Property struct {
	Code  string      `bson:"code" json:"code"`
	Value interface{} `bson:"value" json:"value"`
	Type  string      `bson:"type" json:"type"` // "string", "boolean", "integer", "decimal"
}

// SearchResult represents search results with metadata
type SearchResult struct {
	Codes    []interface{} `json:"codes"`
	Total    int           `json:"total"`
	Page     int           `json:"page"`
	PageSize int           `json:"pageSize"`
	Query    string        `json:"query"`
	System   string        `json:"system,omitempty"`
}

// TranslationRequest represents a code translation request
type TranslationRequest struct {
	Code   string `json:"code" binding:"required"`
	System string `json:"system" binding:"required"`
	Target string `json:"target" binding:"required"`
}

// TranslationResponse represents a code translation response
type TranslationResponse struct {
	Result  bool              `json:"result"`
	Matches []TranslationMatch `json:"matches,omitempty"`
	Message string            `json:"message,omitempty"`
}

// TranslationMatch represents a single translation match
type TranslationMatch struct {
	Equivalence string  `json:"equivalence"`
	Code        string  `json:"code"`
	Display     string  `json:"display"`
	System      string  `json:"system"`
	Confidence  float64 `json:"confidence"`
}

// HealthCheck represents system health status
type HealthCheck struct {
	Status    string            `json:"status"`
	Timestamp time.Time         `json:"timestamp"`
	Services  map[string]string `json:"services"`
	Version   string            `json:"version"`
}

// AuditLog represents an audit trail entry
type AuditLog struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    string             `bson:"userId" json:"userId"`
	Action    string             `bson:"action" json:"action"`
	Resource  string             `bson:"resource" json:"resource"`
	Details   map[string]interface{} `bson:"details" json:"details"`
	IP        string             `bson:"ip" json:"ip"`
	UserAgent string             `bson:"userAgent" json:"userAgent"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
}

// User represents a system user
type User struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ABHAID      string             `bson:"abhaId" json:"abhaId"`
	Email       string             `bson:"email" json:"email"`
	Name        string             `bson:"name" json:"name"`
	Role        string             `bson:"role" json:"role"` // "clinician", "administrator", "auditor"
	Institution string             `bson:"institution" json:"institution"`
	Active      bool               `bson:"active" json:"active"`
	LastLogin   time.Time          `bson:"lastLogin" json:"lastLogin"`
	Created     time.Time          `bson:"created" json:"created"`
	Updated     time.Time          `bson:"updated" json:"updated"`
}

// Constants for code systems
const (
	// Code Systems
	NAMASTESystem      = "https://ayush.gov.in/fhir/CodeSystem/namaste"
	ICD11System        = "http://id.who.int/icd/release/11/mms"
	WHOAyurvedaSystem  = "https://who.int/fhir/CodeSystem/ayurveda"

	// ICD-11 Modules
	TM2Module         = "tm2"
	BiomedicineModule = "biomedicine"

	// Equivalence types
	EquivalenceEquivalent = "equivalent"
	EquivalenceWider      = "wider"
	EquivalenceNarrower   = "narrower"
	EquivalenceInexact    = "inexact"

	// User roles
	RoleClinician     = "clinician"
	RoleAdministrator = "administrator"
	RoleAuditor       = "auditor"

	// Status values
	StatusActive   = "active"
	StatusInactive = "inactive"
	StatusDraft    = "draft"
)
