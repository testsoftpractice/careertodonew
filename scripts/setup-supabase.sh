#!/bin/bash

# Supabase Setup Helper Script
# This script helps verify and configure your Supabase setup

set -e

echo "=========================================="
echo "  Supabase Setup Helper"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.supabase.example to .env and fill in your credentials."
    echo ""
    echo "Run: cp .env.supabase.example .env"
    exit 1
fi

echo "✅ .env file found"

# Check for required environment variables
echo ""
echo "Checking environment variables..."

required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "DATABASE_URL"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env 2>/dev/null; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env file with these values."
    exit 1
fi

echo "✅ All required environment variables found"

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo ""
    echo "📦 Installing dependencies..."
    bun install
else
    echo "✅ Dependencies already installed"
fi

# Generate Prisma client
echo ""
echo "🔄 Generating Prisma Client..."
bun run db:generate
echo "✅ Prisma Client generated"

# Test database connection
echo ""
echo "🔌 Testing database connection..."
if bunx prisma db execute --stdin <(echo "SELECT 1;") > /dev/null 2>&1; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Could not connect to database"
    echo "Please check your DATABASE_URL in .env file"
    echo ""
    echo "Expected format:"
    echo 'postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres'
    echo ""
    echo "If you haven't run migrations yet, please:"
    echo "1. Open Supabase Dashboard > SQL Editor"
    echo "2. Run the SQL from: supabase/migrations/001_initial_schema.sql"
    echo "3. Run the SQL from: supabase/migrations/002_rls_policies.sql"
    exit 1
fi

# Check if tables exist
echo ""
echo "📊 Checking database tables..."

TABLES=$(bunx prisma db execute --stdin <(echo "SELECT COUNT(*) FROM User;") 2>/dev/null || echo "0")

if [ "$TABLES" == "0" ]; then
    echo "⚠️  Database tables not found"
    echo ""
    echo "Please run migrations in your Supabase Dashboard:"
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Navigate to: Your Project > SQL Editor"
    echo "3. Copy and run: supabase/migrations/001_initial_schema.sql"
    echo "4. Copy and run: supabase/migrations/002_rls_policies.sql"
    echo ""
    echo "Or run: bun run db:push"
    exit 1
fi

echo "✅ Database tables found"

# Ask if user wants to seed database
echo ""
read -p "🌱 Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding database..."
    bun run db:seed
    echo "✅ Database seeded successfully"
else
    echo "Skipping database seeding"
fi

echo ""
echo "=========================================="
echo "  Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Your Supabase PostgreSQL database is ready!"
echo ""
echo "Next steps:"
echo "1. Start the dev server: bun run dev"
echo "2. Open http://localhost:3000"
echo "3. Log in with test credentials (see seed output)"
echo ""
echo "Useful commands:"
echo "- Prisma Studio: bun run db:studio"
echo "- Generate types: bunx supabase types"
echo "- View logs: https://supabase.com/dashboard"
echo ""
