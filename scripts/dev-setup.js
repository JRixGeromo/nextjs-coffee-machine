const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`⚠️ Warning: ${stderr}`);
      }
      console.log(`✅ ${description} completed`);
      resolve(stdout);
    });
  });
}

async function setupDevelopment() {
  console.log('🚀 Setting up Next.js Coffee Machine development environment...\n');

  try {
    // Check if .env file exists
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️ .env file not found. Please create it with DATABASE_URL');
      return;
    }

    // Generate Prisma client
    await runCommand('npx prisma generate', 'Generating Prisma client');

    // Check if PostgreSQL is running (simple check)
    try {
      await runCommand('npx prisma db pull --print', 'Checking database connection');
    } catch (error) {
      console.log('❌ Cannot connect to PostgreSQL. Please ensure PostgreSQL is running and DATABASE_URL is correct.');
      console.log('💡 To start PostgreSQL with Docker:');
      console.log('   docker run --name postgres-coffee -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=coffee_machine -p 5432:5432 -d postgres:15');
      return;
    }

    // Run database migrations
    await runCommand('npx prisma migrate dev --name init', 'Running database migrations');

    // Initialize database with seed data
    await runCommand('node scripts/init-db.js', 'Initializing database with seed data');

    console.log('\n🎉 Development setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Open browser: http://localhost:3000');
    console.log('3. Enjoy your Coffee Machine app! ☕');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure PostgreSQL is running');
    console.log('2. Check DATABASE_URL in .env file');
    console.log('3. Install dependencies: npm install');
  }
}

setupDevelopment();
