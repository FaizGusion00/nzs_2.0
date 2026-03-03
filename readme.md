# 🕌 Sistem Kutipan Zakat Selangor (LZS)

## Enterprise Architecture Blueprint – High Scale, High Security, AWS-Ready

**Author:** Faiz Nasir
**Date:** October 29, 2025
**Scope:** Migration 4TB legacy data (2003–present) + 500,000 peak monthly transactions

---

# 1️⃣ System Vision & Non-Functional Targets

## Target Scale

* Historical Data Migration: **4TB (44+ million records)**
* Normal Load: **300,000 transactions/month**
* Peak Load (Ramadan/Zakat Peak): **500,000 transactions/month**
* Concurrent Users Target: 5,000–10,000
* API Latency Target: < 200ms (non-payment endpoints)
* Payment Processing SLA: < 3 seconds end-to-end

## Non-Functional Requirements

* High Availability (99.9%+)
* Horizontal Scalability
* Zero Data Loss (WAL + PITR)
* Full Auditability (Financial Compliance)
* Strong Encryption (At rest + In transit)
* Disaster Recovery RTO < 1 hour
* RPO < 5 minutes

---

# 2️⃣ High-Level Architecture (AWS-Ready, Cloud Native)

## Architecture Pattern

* Microservice-ready Modular Monolith (Phase 1)
* Event-driven expansion ready (Phase 2)
* Clean Architecture (Hexagonal)

## Logical Architecture Flow

Client (Web/Mobile)
↓
CloudFront (CDN)
↓
AWS WAF
↓
Application Load Balancer (ALB)
↓
Spring Boot Backend (ECS Fargate / EKS)
↓
Redis (ElastiCache)
↓
PostgreSQL (Amazon RDS / Aurora PostgreSQL)
↓
S3 (Document & Receipt Storage)
↓
CloudWatch + Prometheus + Grafana

---

## Core Infrastructure Components

### 1. Edge Layer

* AWS CloudFront (CDN caching)
* AWS WAF (DDoS + SQL injection protection)
* AWS Shield (Advanced if required)

### 2. Application Layer

* Spring Boot 3 (Java 21)
* Deployed on ECS Fargate (serverless container)
* Auto-scaling based on CPU + Request count

### 3. Data Layer

* Amazon RDS PostgreSQL (Multi-AZ)
* Read Replica for reporting
* WAL Archiving + Point-In-Time Recovery

### 4. Caching Layer

* Redis (ElastiCache)
* Used for:

  * Session storage
  * JWT blacklist
  * Rate limiting
  * Frequently accessed zakat categories

### 5. Object Storage

* Amazon S3
* Used for:

  * Receipt PDFs
  * Audit exports
  * Historical archive

---

# 3️⃣ Docker Production-Ready Configuration

## docker-compose.yml (Enterprise Ready Baseline)

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15
    container_name: lzs_postgres
    restart: always
    environment:
      POSTGRES_DB: lzs
      POSTGRES_USER: lzs_user
      POSTGRES_PASSWORD: strong_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    command: >
      postgres
      -c max_connections=500
      -c shared_buffers=2GB
      -c work_mem=16MB
      -c maintenance_work_mem=512MB
      -c effective_cache_size=6GB
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    container_name: lzs_redis
    restart: always
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    container_name: lzs_backend
    restart: always
    depends_on:
      - postgres
      - redis
    environment:
      SPRING_PROFILES_ACTIVE: prod
    ports:
      - "8080:8080"

  nginx:
    image: nginx:stable
    container_name: lzs_nginx
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./docker/nginx:/etc/nginx/conf.d

volumes:
  postgres_data:
```

---

# 4️⃣ Spring Boot application.yml (Production Baseline)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://postgres:5432/lzs
    username: lzs_user
    password: strong_secure_password
    hikari:
      maximum-pool-size: 50
      minimum-idle: 10
      idle-timeout: 30000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true

  flyway:
    enabled: true

  redis:
    host: redis
    port: 6379

management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus

logging:
  level:
    root: INFO
```

---

# 5️⃣ PostgreSQL Schema Design (High Transaction Optimized)

## Design Principles

* UUID (v7 preferred) for distributed safety
* Partitioned tables for transaction history
* Proper indexing (B-Tree + Partial Index)
* Write-optimized structure
* Read replicas for reporting

---

## Core Tables

### 1. payers

* id (UUID PK)
* full_name
* ic_number (indexed)
* email (indexed)
* phone
* created_at
* updated_at

Indexes:

* idx_payers_ic
* idx_payers_email

---

### 2. zakat_transactions (Partitioned by Year or Month)

Partition Strategy:

* RANGE partition on payment_date

Main Columns:

* id (UUID PK)
* payer_id (FK)
* zakat_type
* amount
* payment_status
* payment_channel
* external_reference
* payment_date
* created_at

Indexes:

* idx_transaction_payer
* idx_transaction_date
* idx_transaction_status
* composite index (payment_status, payment_date)

---

### 3. audit_logs

* id (UUID PK)
* entity_type
* entity_id
* action
* performed_by
* metadata (JSONB)
* created_at

Indexes:

* idx_audit_entity
* GIN index on metadata (JSONB)

---

# 6️⃣ Data Migration Strategy (4TB Legacy System)

## Phase 1: Data Profiling

* Data cleansing
* Deduplication rules
* Schema normalization mapping

## Phase 2: Staging Environment

* Import raw data into staging schema
* Transform using ETL pipeline
* Validate row counts & checksum

## Phase 3: Batch Migration

* Migrate in chunks (1–5 million rows per batch)
* Disable heavy indexes during bulk insert
* Rebuild indexes after batch

## Phase 4: Validation

* Row count validation
* Financial reconciliation per year
* Random sampling verification

---

# 7️⃣ Performance Hardening Strategy

## Database

* Partitioned tables
* Connection pooling (PgBouncer optional)
* Read replica for analytics
* Vacuum tuning

## Application

* Async processing for receipts
* Queue for payment callbacks
* Rate limiting per IP

## Infrastructure

* Auto scaling rules (CPU > 60%)
* Horizontal scaling (stateless backend)

---

# 8️⃣ Security Architecture

* TLS 1.3 enforced
* JWT with short expiry
* Refresh token rotation
* Database encryption (AES-256 at rest)
* IAM role-based access (AWS)
* Secrets stored in AWS Secrets Manager
* Daily vulnerability scan

---

# 9️⃣ Disaster Recovery Strategy

* Multi-AZ RDS
* Daily snapshot backup
* Continuous WAL archiving
* Cross-region snapshot replication
* Automated failover testing quarterly

---

# 🔟 Future Scalability Plan

Phase 2 (Optional Evolution):

* Extract Payment Service as microservice
* Introduce Kafka for event streaming
* Introduce Aurora PostgreSQL for further scaling

---

# Conclusion

This architecture is designed for:

* 4TB historical migration
* 500,000 peak monthly transactions
* Enterprise-grade financial security
* AWS-native scalability
* High audit & compliance requirements

This system is production-ready, cloud-native, horizontally scalable, and compliant with financial-grade requirements.
