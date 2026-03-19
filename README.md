# Coffee Machine - Next.js 14 Full-Stack

A modern full-stack Coffee Machine application built with Next.js 14, TypeScript, PostgreSQL, and Tailwind CSS. This demonstrates a complete full-stack implementation without any traditional backend framework.

## 🎯 Challenge Details

### Core Requirements
- ✅ Make Espresso (8g coffee, 24ml water)
- ✅ Make Double Espresso (16g coffee, 48ml water) 
- ✅ Make Americano (16g coffee, 148ml water)
- ✅ Check machine status
- ✅ Fill water container (2L capacity)
- ✅ Fill coffee container (500g capacity)
- ✅ Human-readable error messages
- ✅ State persistence (PostgreSQL database)

### Tech Stack Requirements
- ✅ **Frontend**: Next.js 14 with App Router
- ✅ **Backend**: Next.js API Routes (full-stack)
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Language**: TypeScript throughout
- ✅ **Styling**: Tailwind CSS
- ✅ **State Management**: TanStack Query + React Context
- ✅ **Validation**: Zod schemas
- ✅ **Deployment**: Vercel-ready

### Architecture Goals
- ✅ **Full-Stack Next.js**: No separate backend framework
- ✅ **Type Safety**: End-to-end TypeScript
- ✅ **Modern Patterns**: Server Components, API Routes, Server Actions
- ✅ **Professional Code**: Enterprise-ready architecture
- ✅ **Performance**: Optimized for production

## 🏗️ Architecture

### Full-Stack Next.js Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Next.js 14 App                         │
├─────────────────────────────────────────────────────────┤
│  Frontend (Client Components)                            │
│  ├── Coffee Machine Interface                            │
│  ├── Status Display                                      │
│  ├── Control Buttons                                     │
│  └── Real-time Updates                                   │
├─────────────────────────────────────────────────────────┤
│  Backend (API Routes & Server Actions)                    │
│  ├── /api/coffee-machine/status                          │
│  ├── /api/coffee-machine/make-*                          │
│  ├── /api/coffee-machine/fill-*                          │
│  └── Business Logic Services                             │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                               │
│  ├── PostgreSQL Database                                 │
│  ├── Prisma ORM                                          │
│  ├── Type-safe Queries                                   │
│  └── Migrations                                          │
└─────────────────────────────────────────────────────────┘
```

### Project Structure
```
nextjs-coffee-machine/
├── app/                          # Next.js App Router
│   ├── api/coffee-machine/       # API Routes (Backend)
│   │   ├── status/route.ts
│   │   ├── make-espresso/route.ts
│   │   ├── make-double-espresso/route.ts
│   │   ├── make-americano/route.ts
│   │   ├── fill-water/route.ts
│   │   └── fill-coffee/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main coffee machine page
├── components/                   # React Components
│   ├── CoffeeMachine/
│   │   ├── CoffeeMachineApp.tsx
│   │   ├── MachineStatus.tsx
│   │   ├── CoffeeButtons.tsx
│   │   ├── ContainerControls.tsx
│   │   └── MessageDisplay.tsx
│   └── ui/                       # Reusable UI components
├── lib/                          # Backend logic & utilities
│   ├── services/
│   │   └── coffee-machine.ts
│   ├── db.ts                     # Database connection
│   ├── prisma.ts                 # Prisma client
│   ├── validations.ts            # Zod schemas
│   └── utils.ts
├── hooks/                        # Custom React hooks
│   ├── useCoffeeMachine.ts
│   └── useApi.ts
├── types/                        # TypeScript types
│   ├── coffee.types.ts
│   └── api.types.ts
├── schemas/                      # Validation schemas
│   └── coffee.schema.ts
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/
├── public/                       # Static assets
└── tailwind.config.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd nextjs-coffee-machine
npm install
```

2. **Database setup**
```bash
# Create PostgreSQL database
createdb coffee_machine

# Run migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

3. **Start development server**
```bash
npm run dev
```

4. **Open application**
```
http://localhost:3000
```

## 📊 Database Schema

### Coffee Machine State
```sql
CREATE TABLE coffee_machine_state (
  id SERIAL PRIMARY KEY,
  water_ml INTEGER DEFAULT 0,
  coffee_grams INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Coffee Recipes
```sql
CREATE TABLE coffee_recipes (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  coffee_grams DECIMAL(5,2) NOT NULL,
  water_milliliters INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3000/api/coffee-machine`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/status` | Get machine status | - |
| POST | `/make-espresso` | Make espresso | `{}` |
| POST | `/make-double-espresso` | Make double espresso | `{}` |
| POST | `/make-americano` | Make americano | `{}` |
| POST | `/fill-water` | Fill water container | `{"quantity": 1.5}` (liters) |
| POST | `/fill-coffee` | Fill coffee container | `{"quantity": 250}` (grams) |

### Example Response
```json
{
  "success": true,
  "message": "Espresso made successfully!",
  "status": {
    "water": {
      "current": 1.976,
      "capacity": 2.0,
      "unit": "liters",
      "percentage": 98.8
    },
    "coffee": {
      "current": 242,
      "capacity": 500,
      "unit": "grams",
      "percentage": 48.4
    },
    "can_make": {
      "espresso": true,
      "double_espresso": true,
      "americano": true
    }
  }
}
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🎯 Features

### Core Functionality
- ✅ **Recipe Management**: Centralized recipe system with value objects
- ✅ **Resource Management**: Water and coffee container tracking
- ✅ **State Persistence**: PostgreSQL database storage
- ✅ **Real-time Updates**: Live status updates
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Validation**: Input validation with Zod

### Advanced Features
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Performance**: Optimized with Next.js caching
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Accessibility**: WCAG compliant components
- ✅ **SEO Optimized**: Meta tags and structured data
- ✅ **Production Ready**: Deployment-ready configuration

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma studio       # Open Prisma Studio
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma client

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run E2E tests

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run type-check      # Run TypeScript checks
```

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
# Build Docker image
docker build -t coffee-machine-nextjs .

# Run container
docker run -p 3000:3000 coffee-machine-nextjs
```

## 📋 Requirements Compliance

### ✅ Core Requirements Met
- [x] All coffee types implemented (espresso, double espresso, americano)
- [x] Container capacity limits enforced
- [x] Resource validation and error handling
- [x] State persistence in PostgreSQL
- [x] Human-readable error messages
- [x] Real-time status updates

### ✅ Technical Requirements Met
- [x] Next.js 14 full-stack implementation
- [x] TypeScript throughout
- [x] PostgreSQL database with Prisma
- [x] Tailwind CSS for styling
- [x] Modern React patterns (hooks, context)
- [x] API routes for backend functionality
- [x] Comprehensive error handling
- [x] Production-ready configuration

## 🎨 Design Principles

### Architecture Patterns
- **Full-Stack Next.js**: Single framework for frontend and backend
- **Type Safety**: End-to-end TypeScript coverage
- **Component-Based**: Modular, reusable components
- **API-First**: Clean API design with proper HTTP semantics
- **Database-First**: Type-safe database operations with Prisma

### Code Quality
- **Clean Code**: Self-documenting code with clear naming
- **Error Handling**: Comprehensive error boundaries and messages
- **Performance**: Optimized for production with caching
- **Accessibility**: WCAG compliant components
- **Testing**: Unit and integration test coverage

## 📄 License

This project was created as a full-stack development demonstration.

## 👤 Author

**Next.js Full-Stack Implementation**
- Demonstrates modern full-stack development
- Shows TypeScript proficiency
- Illustrates database design skills
- Highlights API development capabilities
