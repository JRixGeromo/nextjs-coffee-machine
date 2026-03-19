# Deployment Guide

## 🚀 Quick Start Development

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Docker)

### Option 1: Automatic Setup
```bash
# Install dependencies
npm install

# Run automatic setup (creates database, migrations, seed data)
npm run setup

# Start development server
npm run dev
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Start PostgreSQL with Docker
docker run --name postgres-coffee -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=coffee_machine -p 5432:5432 -d postgres:15

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Initialize database
npm run db:init

# Start development server
npm run dev
```

Open: http://localhost:3000

---

## 🐳 Docker Deployment

### Development with Docker
```bash
# Start development environment
docker-compose --profile dev up

# Stop containers
docker-compose --profile dev down
```

### Production with Docker
```bash
# Build and run production
docker-compose up

# Stop containers
docker-compose down
```

### Individual Docker Commands
```bash
# Build image
docker build -t coffee-machine-nextjs .

# Run with existing database
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/coffee_machine" \
  coffee-machine-nextjs
```

---

## ☁️ Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- PostgreSQL database (Vercel Postgres or external)

### Step 1: Prepare for Deployment
```bash
# Build for production
npm run build

# Test production build locally
npm run start
```

### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Step 3: Environment Variables
Set these in Vercel dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret string

### Step 4: Database Setup
```bash
# Run migrations on production database
npx prisma migrate deploy

# Seed production data (optional)
npx prisma db seed
```

---

## 🚀 Railway Deployment

### Step 1: Prepare Project
```bash
# Add Railway to project
npm install -g @railway/cli
railway login

# Initialize Railway
railway init
```

### Step 2: Configure
```bash
# Add PostgreSQL service
railway add postgresql

# Set environment variables
railway variables set NEXTAUTH_SECRET="your-secret"
```

### Step 3: Deploy
```bash
# Deploy to Railway
railway up

# Run migrations
railway run npx prisma migrate deploy
```

---

## 🌐 DigitalOcean App Platform

### Step 1: Prepare
```bash
# Install doctl
curl -sSL https://sh.rustup.rs | sh
```

### Step 2: Create App
```bash
# Create app
doctl apps create --spec spec.yaml

# Deploy
doctl apps create-deployment <app-id>
```

---

## 📋 Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# Next.js
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="random-secret-string"
```

### Optional Variables
```bash
# Environment
NODE_ENV="production"

# Logging
LOG_LEVEL="info"
```

---

## 🔧 Production Checklist

### Before Deployment
- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] Prisma migrations tested
- [ ] Build process successful
- [ ] Error handling tested
- [ ] Security headers configured

### After Deployment
- [ ] Application loads successfully
- [ ] Database connectivity working
- [ ] All API endpoints functional
- [ ] Error pages working
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Test connection
npx prisma db pull --print

# Reset database
npx prisma migrate reset
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

#### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Vercel Deployment
```bash
# Check logs
vercel logs

# Redeploy
vercel --prod
```

### Performance Optimization

#### Database
```bash
# Analyze queries
npx prisma analyze

# View database
npx prisma studio
```

#### Next.js
```bash
# Build analyzer
npm install @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## 📊 Monitoring

### Application Monitoring
- Vercel Analytics (built-in)
- Sentry for error tracking
- LogRocket for session replay

### Database Monitoring
- Prisma Studio for local development
- PgHero for PostgreSQL metrics
- Database logs for production

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🎯 Best Practices

### Security
- Use environment variables for secrets
- Enable HTTPS in production
- Validate all inputs
- Use parameterized queries (Prisma handles this)

### Performance
- Enable Next.js caching
- Use CDN for static assets
- Optimize database queries
- Monitor bundle size

### Reliability
- Implement error boundaries
- Add health check endpoints
- Use database transactions
- Set up proper logging

### Scalability
- Use connection pooling
- Implement horizontal scaling
- Add load balancing
- Consider serverless architecture

---

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Review build process
5. Monitor resource usage

The application should now be deployed and accessible at your domain! 🎉
