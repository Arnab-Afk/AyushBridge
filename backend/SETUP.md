# AyushBridge Backend Setup Instructions

## Prerequisites

Before running the backend server, you need to set up the following services:

### 1. PostgreSQL Database

#### Install PostgreSQL (if not already installed):

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use chocolatey: `choco install postgresql`

**Using Docker (Recommended for development):**
```bash
docker run --name ayushbridge-postgres \
  -e POSTGRES_DB=ayushbridge_db \
  -e POSTGRES_USER=ayushbridge_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:15
```

#### Manual Setup:
1. Create a database user:
```sql
CREATE USER ayushbridge_user WITH PASSWORD 'your_secure_password';
```

2. Create the database:
```sql
CREATE DATABASE ayushbridge_db OWNER ayushbridge_user;
```

3. Grant privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE ayushbridge_db TO ayushbridge_user;
```

### 2. Redis Cache

#### Install Redis:

**Windows:**
- Use WSL2 or download from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run --name ayushbridge-redis -p 6379:6379 -d redis:7`

**Using Docker (Recommended):**
```bash
docker run --name ayushbridge-redis \
  -p 6379:6379 \
  -d redis:7
```

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ayushbridge_db
DB_USER=ayushbridge_user
DB_PASSWORD=your_secure_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Database Migrations

```bash
npm run db:migrate
```

### 6. Seed Initial Data (Optional)

```bash
npm run db:seed
```

### 7. Start the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Docker Compose Setup (All-in-One)

For easy development setup, you can use Docker Compose:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ayushbridge_db
      POSTGRES_USER: ayushbridge_user
      POSTGRES_PASSWORD: your_secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```

## Verification

Once everything is set up, verify the installation:

1. **Health Check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **API Documentation:**
   Open http://localhost:3000/api-docs in your browser

3. **FHIR Metadata:**
   ```bash
   curl http://localhost:3000/fhir/metadata
   ```

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Redis Connection Error:**
   - Ensure Redis is running
   - Check Redis configuration in `.env`

3. **Port Already in Use:**
   - Change the PORT in `.env` file
   - Kill the process using the port: `netstat -ano | findstr :3000`

4. **Module Not Found Errors:**
   - Run `npm install` again
   - Delete `node_modules` and run `npm install`

### Development Tips:

1. **View Logs:**
   ```bash
   tail -f logs/combined-$(date +%Y-%m-%d).log
   ```

2. **Database Inspection:**
   ```bash
   psql -h localhost -U ayushbridge_user -d ayushbridge_db
   ```

3. **Redis Inspection:**
   ```bash
   redis-cli -h localhost -p 6379
   ```

## Next Steps

1. Set up WHO ICD-11 API credentials
2. Configure ABHA OAuth integration
3. Import NAMASTE terminology data
4. Set up monitoring and logging
5. Configure production deployment
