# SIH25026 NAMASTE-ICD11 EMR Integration: Comprehensive Solution Document

## Executive Summary

This document provides a detailed implementation guide for developing a FHIR R4-compliant terminology microservice that integrates India's NAMASTE codes with WHO's ICD-11 Traditional Medicine Module 2 (TM2) and Biomedicine modules. The solution enables dual-coding capabilities for traditional medicine diagnoses while maintaining compliance with India's 2016 EHR Standards.

## 1. System Architecture Overview

## 1.1 High-Level Architecture

text

`┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │   EMR Frontend  │────│  API Gateway     │────│ Terminology     │ │   (Clinical UI) │    │  (OAuth 2.0 +    │    │ Microservice    │ └─────────────────┘    │   Rate Limiting) │    └─────────────────┘                        └──────────────────┘              │                                                          │ ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │   ABHA Identity │────│  Authentication  │    │ FHIR Server     │ │   Provider      │    │  Service         │    │ (HAPI FHIR)     │ └─────────────────┘    └──────────────────┘    └─────────────────┘                                                           │ ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │ WHO ICD-11 API  │────│ External API     │    │ Database        │ │ (TM2 & Bio)     │    │ Sync Service     │    │ (PostgreSQL)    │ └─────────────────┘    └──────────────────┘    └─────────────────┘`

## 1.2 Core Components

1. **Terminology Microservice**: Core service handling NAMASTE and ICD-11 operations
    
2. **FHIR Server**: HAPI FHIR R4 server for resource management
    
3. **Authentication Service**: OAuth 2.0 with ABHA integration
    
4. **External API Sync Service**: WHO ICD-11 API synchronization
    
5. **Database Layer**: PostgreSQL with FHIR resource storage
    
6. **API Gateway**: Rate limiting, logging, and security
    

## 2. Technical Requirements

## 2.1 Compliance Standards

- **FHIR R4**: Complete compliance with HL7 FHIR R4 specification
    
- **India EHR Standards 2016**: Full adherence to national standards
    
- **ISO 22600**: Access control and security framework
    
- **OAuth 2.0**: ABHA-linked authentication
    
- **SNOMED CT/LOINC**: Semantic interoperability
    
- **ICD-11 Coding Rules**: WHO classification guidelines
    

## 2.2 Technology Stack

text

`Backend:   - Java 17+ with Spring Boot 3.x  - HAPI FHIR 6.x  - PostgreSQL 15+  - Redis (caching)  - Apache Kafka (event streaming) Security:   - Spring Security with OAuth 2.0  - JWT tokens  - ABHA integration APIs:   - REST APIs with OpenAPI 3.0  - GraphQL (optional)  - WebSocket for real-time updates Monitoring:   - Prometheus + Grafana  - ELK Stack (Elasticsearch, Logstash, Kibana)  - Jaeger (distributed tracing)`

## 3. Data Models and FHIR Resources

## 3.1 Core FHIR Resources

## 3.1.1 CodeSystem for NAMASTE

json

`{   "resourceType": "CodeSystem",  "id": "namaste-codes",  "url": "https://ayush.gov.in/fhir/CodeSystem/namaste",  "version": "1.0.0",  "name": "NAMASTECodes",  "title": "National AYUSH Morbidity & Standardized Terminologies Electronic",  "status": "active",  "experimental": false,  "publisher": "Ministry of AYUSH, Government of India",  "description": "Standardized terminology for Ayurveda, Siddha, and Unani disorders",  "content": "complete",  "property": [    {      "code": "system",      "type": "string",      "description": "Traditional medicine system (Ayurveda/Siddha/Unani)"    },    {      "code": "icd11-tm2",      "type": "string",      "description": "Mapped ICD-11 TM2 code"    },    {      "code": "icd11-bio",      "type": "string",      "description": "Mapped ICD-11 Biomedicine code"    }  ] }`

## 3.1.2 ConceptMap for NAMASTE ↔ ICD-11

json

`{   "resourceType": "ConceptMap",  "id": "namaste-to-icd11",  "url": "https://ayush.gov.in/fhir/ConceptMap/namaste-to-icd11",  "version": "1.0.0",  "name": "NAMASTEToICD11",  "title": "NAMASTE to ICD-11 TM2 and Biomedicine Mapping",  "status": "active",  "sourceUri": "https://ayush.gov.in/fhir/CodeSystem/namaste",  "targetUri": "http://id.who.int/icd/release/11/mms",  "group": [    {      "source": "https://ayush.gov.in/fhir/CodeSystem/namaste",      "target": "http://id.who.int/icd/release/11/mms",      "element": [        {          "code": "NAM001",          "target": [            {              "code": "TM26.0",              "equivalence": "equivalent",              "comment": "Primary TM2 mapping"            },            {              "code": "5A00",              "equivalence": "wider",              "comment": "Biomedicine mapping"            }          ]        }      ]    }  ] }`

## 3.2 Database Schema

sql

`-- NAMASTE Codes CREATE TABLE namaste_codes (     id UUID PRIMARY KEY,    code VARCHAR(20) UNIQUE NOT NULL,    display VARCHAR(500) NOT NULL,    definition TEXT,    system VARCHAR(20) CHECK (system IN ('ayurveda', 'siddha', 'unani')),    status VARCHAR(20) DEFAULT 'active',    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- ICD-11 Codes (TM2 and Biomedicine) CREATE TABLE icd11_codes (     id UUID PRIMARY KEY,    code VARCHAR(20) UNIQUE NOT NULL,    display VARCHAR(500) NOT NULL,    definition TEXT,    module VARCHAR(20) CHECK (module IN ('tm2', 'biomedicine')),    parent_code VARCHAR(20),    status VARCHAR(20) DEFAULT 'active',    who_updated_at TIMESTAMP,    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Concept Mappings CREATE TABLE concept_mappings (     id UUID PRIMARY KEY,    source_system VARCHAR(50) NOT NULL,    source_code VARCHAR(20) NOT NULL,    target_system VARCHAR(50) NOT NULL,    target_code VARCHAR(20) NOT NULL,    equivalence VARCHAR(20) CHECK (equivalence IN ('equivalent', 'equal', 'wider', 'subsumes', 'narrower', 'specializes', 'inexact', 'unmatched', 'disjoint')),    confidence_score DECIMAL(3,2),    mapping_method VARCHAR(50),    verified_by VARCHAR(100),    verified_at TIMESTAMP,    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ); -- Audit Trail CREATE TABLE audit_logs (     id UUID PRIMARY KEY,    resource_type VARCHAR(50) NOT NULL,    resource_id UUID NOT NULL,    action VARCHAR(20) NOT NULL,    user_id VARCHAR(100),    user_role VARCHAR(50),    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    ip_address INET,    user_agent TEXT,    changes JSONB );`

## 4. API Design Specification

## 4.1 Core Endpoints

## 4.1.1 Terminology Lookup

text

`GET /fhir/CodeSystem/namaste/$lookup Parameters:   - code: string (required)  - system: string (optional)  - version: string (optional)  - displayLanguage: string (default: 'en') Response:   - parameter: [      {name: "display", valueString: "..."},      {name: "system", valueString: "ayurveda"},      {name: "icd11-tm2", valueString: "TM26.0"},      {name: "icd11-bio", valueString: "5A00"}    ]`

## 4.1.2 Auto-complete Search

text

`GET /fhir/ValueSet/namaste/$expand Parameters:   - filter: string (search term)  - count: integer (max results, default: 20)  - offset: integer (pagination)  - system: string (filter by traditional medicine system) Response:   - expansion: {      total: number,      contains: [        {          system: "https://ayush.gov.in/fhir/CodeSystem/namaste",          code: "NAM001",          display: "Vataja Shirashoola"        }      ]    }`

## 4.1.3 Code Translation

text

`POST /fhir/ConceptMap/namaste-to-icd11/$translate Parameters:   - code: string (required)  - system: string (required)  - target: string (icd11-tm2 or icd11-bio)  - reverse: boolean (default: false) Response:   - match: [      {        equivalence: "equivalent",        concept: {          system: "http://id.who.int/icd/release/11/mms",          code: "TM26.0",          display: "Disorders of vata dosha"        }      }    ]`

## 4.1.4 Bundle Upload

text

`POST /fhir/Bundle Headers:   - Authorization: Bearer <JWT_TOKEN>  - Content-Type: application/fhir+json Body: {   "resourceType": "Bundle",  "type": "transaction",  "entry": [    {      "resource": {        "resourceType": "Condition",        "code": {          "coding": [            {              "system": "https://ayush.gov.in/fhir/CodeSystem/namaste",              "code": "NAM001",              "display": "Vataja Shirashoola"            },            {              "system": "http://id.who.int/icd/release/11/mms",              "code": "TM26.0",              "display": "Disorders of vata dosha"            }          ]        }      }    }  ] }`

## 4.2 Authentication Endpoints

## 4.2.1 ABHA Token Validation

text

`POST /auth/validate Headers:   - Authorization: Bearer <ABHA_TOKEN> Response: {   "valid": true,  "user": {    "abha_id": "12345678901234",    "name": "Dr. Rajesh Kumar",    "role": "physician",    "facility": "AIIMS Delhi"  },  "expires_at": "2025-09-01T10:00:00Z" }`

## 5. Implementation Roadmap

## 5.1 Phase 1: Core Infrastructure (Week 1-2)

-  Set up Spring Boot project with HAPI FHIR
    
-  Configure PostgreSQL database
    
-  Implement basic FHIR server
    
-  Set up OAuth 2.0 authentication
    
-  Create CI/CD pipeline
    

## 5.2 Phase 2: NAMASTE Integration (Week 3-4)

-  Parse NAMASTE CSV export
    
-  Create FHIR CodeSystem resource
    
-  Implement terminology lookup endpoint
    
-  Build auto-complete search functionality
    
-  Add validation rules
    

## 5.3 Phase 3: ICD-11 Integration (Week 5-6)

-  Integrate WHO ICD-11 API
    
-  Sync TM2 and Biomedicine modules
    
-  Create ConceptMap resources
    
-  Implement translation endpoints
    
-  Add caching mechanisms
    

## 5.4 Phase 4: Advanced Features (Week 7-8)

-  Bundle upload functionality
    
-  Audit trail implementation
    
-  Version tracking
    
-  Consent management
    
-  Performance optimization
    

## 5.5 Phase 5: Testing & Documentation (Week 9-10)

-  Unit testing (90%+ coverage)
    
-  Integration testing
    
-  Security testing
    
-  Performance testing
    
-  API documentation
    

## 6. Security Implementation

## 6.1 OAuth 2.0 Flow with ABHA

java

`@Configuration @EnableWebSecurity public class SecurityConfig {          @Bean    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {        return http            .oauth2ResourceServer(oauth2 -> oauth2                .jwt(jwt -> jwt                    .jwtAuthenticationConverter(jwtAuthConverter())                    .jwkSetUri("https://abha.gov.in/.well-known/jwks.json")                )            )            .authorizeHttpRequests(auth -> auth                .requestMatchers("/fhir/metadata").permitAll()                .requestMatchers("/fhir/**").authenticated()                .anyRequest().authenticated()            )            .build();    } }`

## 6.2 Audit Trail Implementation

java

`@Component @EventListener public class AuditEventListener {          public void handleResourceCreate(FhirResourceCreatedEvent event) {        AuditLog audit = AuditLog.builder()            .resourceType(event.getResourceType())            .resourceId(event.getResourceId())            .action("CREATE")            .userId(SecurityContextHolder.getContext().getAuthentication().getName())            .timestamp(Instant.now())            .changes(event.getResourceContent())            .build();                     auditRepository.save(audit);    } }`

## 7. Data Synchronization Strategy

## 7.1 NAMASTE CSV Processing

java

`@Service public class NAMASTEImportService {          public void importFromCSV(MultipartFile csvFile) {        try (CSVReader reader = new CSVReader(new InputStreamReader(csvFile.getInputStream()))) {            String[] headers = reader.readNext();            String[] line;                         while ((line = reader.readNext()) != null) {                NAMASTECode code = NAMASTECode.builder()                    .code(line[0])                    .display(line[1])                    .definition(line[2])                    .system(line[3])                    .build();                                     namasteRepository.save(code);                createFHIRCodeSystemConcept(code);            }        }    } }`

## 7.2 WHO ICD-11 API Sync

java

`@Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM public void syncICD11Updates() {     String lastSync = configService.getLastSyncTimestamp();         // Fetch TM2 updates    List<ICD11Concept> tm2Updates = whoApiClient.getTM2Updates(lastSync);    tm2Updates.forEach(this::processICD11Update);         // Fetch Biomedicine updates    List<ICD11Concept> bioUpdates = whoApiClient.getBiomedicineUpdates(lastSync);    bioUpdates.forEach(this::processICD11Update);         configService.setLastSyncTimestamp(Instant.now().toString()); }`

## 8. Testing Strategy

## 8.1 Unit Tests

java

`@ExtendWith(MockitoExtension.class) class TerminologyServiceTest {          @Test    void shouldReturnCorrectNAMASTELookup() {        // Given        String code = "NAM001";        NAMASTECode expectedCode = NAMASTECode.builder()            .code(code)            .display("Vataja Shirashoola")            .system("ayurveda")            .build();                     when(namasteRepository.findByCode(code)).thenReturn(Optional.of(expectedCode));                 // When        Parameters result = terminologyService.lookup(code);                 // Then        assertThat(result.getParameter("display").getValue()).isEqualTo("Vataja Shirashoola");    } }`

## 8.2 Integration Tests

java

`@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) @TestPropertySource(properties = "spring.datasource.url=jdbc:h2:mem:testdb") class TerminologyIntegrationTest {          @Test    void shouldTranslateNAMASTEToICD11() {        // Test complete flow from NAMASTE to ICD-11 translation        given()            .auth().oauth2(getValidJWT())            .contentType("application/fhir+json")            .body(createTranslationRequest())        .when()            .post("/fhir/ConceptMap/namaste-to-icd11/$translate")        .then()            .statusCode(200)            .body("parameter.find{it.name=='result'}.valueBoolean", equalTo(true));    } }`

## 9. Deployment and DevOps

## 9.1 Docker Configuration

text

`FROM openjdk:17-jdk-slim COPY target/namaste-icd11-service.jar app.jar ENV SPRING_PROFILES_ACTIVE=production ENV JVM_OPTS="-Xmx2g -XX:+UseG1GC" EXPOSE 8080 HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \     CMD curl -f http://localhost:8080/actuator/health || exit 1 ENTRYPOINT ["java", "-jar", "/app.jar"]`

## 9.2 Kubernetes Deployment

text

`apiVersion: apps/v1 kind: Deployment metadata:   name: namaste-icd11-service spec:   replicas: 3  selector:    matchLabels:      app: namaste-icd11-service  template:    metadata:      labels:        app: namaste-icd11-service    spec:      containers:      - name: service        image: namaste-icd11-service:latest        ports:        - containerPort: 8080        env:        - name: DATABASE_URL          valueFrom:            secretKeyRef:              name: db-secret              key: url        resources:          requests:            memory: "1Gi"            cpu: "500m"          limits:            memory: "2Gi"            cpu: "1000m"        livenessProbe:          httpGet:            path: /actuator/health            port: 8080          initialDelaySeconds: 60          periodSeconds: 30`

## 10. Monitoring and Observability

## 10.1 Metrics Configuration

java

`@Component public class CustomMetrics {          private final Counter terminologyLookups = Counter.builder()        .name("terminology_lookups_total")        .description("Total number of terminology lookups")        .tag("system", "namaste")        .register(Metrics.globalRegistry);             private final Timer translationTimer = Timer.builder()        .name("translation_duration")        .description("Time taken for code translation")        .register(Metrics.globalRegistry); }`

## 10.2 Health Checks

java

`@Component public class DatabaseHealthIndicator implements HealthIndicator {          @Override    public Health health() {        try {            long count = namasteRepository.count();            return Health.up()                .withDetail("namaste_codes", count)                .withDetail("database", "accessible")                .build();        } catch (Exception e) {            return Health.down()                .withException(e)                .build();        }    } }`

## 11. Performance Optimization

## 11.1 Caching Strategy

java

`@Service @CacheConfig(cacheNames = "terminology") public class CachedTerminologyService {          @Cacheable(key = "#code + '_' + #system")    public Parameters lookupCode(String code, String system) {        return terminologyService.lookup(code, system);    }         @CacheEvict(allEntries = true)    @Scheduled(fixedDelay = 3600000) // 1 hour    public void clearCache() {        // Cache will be cleared automatically    } }`

## 11.2 Database Optimization

sql

`-- Indexes for performance CREATE INDEX idx_namaste_codes_display ON namaste_codes USING gin(to_tsvector('english', display)); CREATE INDEX idx_namaste_codes_system ON namaste_codes(system); CREATE INDEX idx_concept_mappings_source ON concept_mappings(source_system, source_code); CREATE INDEX idx_concept_mappings_target ON concept_mappings(target_system, target_code); CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id); CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);`

## 12. Compliance Checklist

## 12.1 FHIR R4 Compliance

-  All resources conform to FHIR R4 specification
    
-  Proper use of CodeSystem, ConceptMap, and ValueSet resources
    
-  Bundle transactions supported
    
-  Search parameters implemented correctly
    
-  Proper HTTP status codes returned
    

## 12.2 India EHR Standards 2016

-  FHIR R4 API endpoints
    
-  SNOMED CT and LOINC semantics support
    
-  ISO 22600 access control implementation
    
-  ABHA-linked OAuth 2.0 authentication
    
-  Comprehensive audit trails
    
-  Consent and versioning metadata
    

## 12.3 Security Requirements

-  OAuth 2.0 with ABHA integration
    
-  JWT token validation
    
-  Rate limiting implemented
    
-  Audit logging for all operations
    
-  Data encryption at rest and in transit
    
-  Input validation and sanitization
    

## 13. Sample Implementation Files

## 13.1 Application Properties

text

`# application.yml server:   port: 8080  servlet:    context-path: / spring:   application:    name: namaste-icd11-service     datasource:    url: jdbc:postgresql://localhost:5432/namaste_icd11    username: ${DB_USERNAME:namaste_user}    password: ${DB_PASSWORD:namaste_password}    driver-class-name: org.postgresql.Driver     jpa:    hibernate:      ddl-auto: validate    properties:      hibernate:        dialect: org.hibernate.dialect.PostgreSQLDialect        format_sql: true    show-sql: false     security:    oauth2:      resourceserver:        jwt:          jwk-set-uri: https://abha.gov.in/.well-known/jwks.json          issuer-uri: https://abha.gov.in   cache:    type: redis    redis:      host: localhost      port: 6379      timeout: 2000ms hapi:   fhir:    server:      path: /fhir    validation:      enabled: true      request_only: true management:   endpoints:    web:      exposure:        include: health,info,metrics,prometheus  endpoint:    health:      show-details: always logging:   level:    ca.uhn.fhir: INFO    org.springframework.security: DEBUG    com.ayush.namaste: DEBUG`

This comprehensive solution document provides the foundation for implementing the NAMASTE-ICD11 EMR integration system. The approach ensures FHIR R4 compliance, security best practices, and scalable architecture while meeting all requirements specified in the SIH25026 problem statement.

Add to follow-up

Check sources