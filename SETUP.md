# Setup Instructions

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: PostgreSQL (Recommended)
```bash
# Install PostgreSQL (if not already installed)
# On macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Create database
createdb coffee_machine

# Update .env.local with your database credentials
DATABASE_URL="postgresql://username:password@localhost:5432/coffee_machine"
```

#### Option B: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name postgres-coffee -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=coffee_machine -p 5432:5432 -d postgres:15

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/coffee_machine"
```

### 3. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Application
```
http://localhost:3000
```

## 📋 Manual Setup Steps

If you prefer to set up manually:

### 1. Create Database
```sql
CREATE DATABASE coffee_machine;
```

### 2. Run Migrations
```bash
npx prisma migrate dev
```

### 3. Seed Data
```bash
npx prisma db seed
```

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists

### TypeScript Errors
- Run `npm install` to install all dependencies
- Run `npx prisma generate` to generate types

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## 🧪 Testing the API

You can test the API endpoints directly:

```bash
# Get status
curl http://localhost:3000/api/coffee-machine/status

# Make espresso
curl -X POST http://localhost:3000/api/coffee-machine/make-espresso

# Fill water
curl -X POST http://localhost:3000/api/coffee-machine/fill-water \
  -H "Content-Type: application/json" \
  -d '{"quantity": 1.5}'
```

## 📁 Project Structure Reference

```
nextjs-coffee-machine/
├── app/                          # Next.js App Router
│   ├── api/coffee-machine/       # API Routes (Backend)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/                   # React Components
│   └── CoffeeMachine/            # Coffee machine components
├── lib/                          # Backend logic
│   ├── services/                 # Business logic
│   └── Recipe.ts                 # Recipe value object
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types
├── prisma/                       # Database schema & migrations
└── public/                       # Static assets
```

## 🎯 Next Steps

Once setup is complete:

1. **Test the application** - Try making coffee and filling containers
2. **Explore the code** - Check out the full-stack architecture
3. **Modify recipes** - Add new coffee types in the service
4. **Deploy** - Ready for Vercel deployment

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Docker
```bash
# Build and run
docker build -t coffee-machine-nextjs .
docker run -p 3000:3000 coffee-machine-nextjs
```

## 📞 Support

If you run into issues:

1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that PostgreSQL is running

The application should now be running at `http://localhost:3000`!
