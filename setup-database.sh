#!/bin/bash

# Database Setup Script for ManabU
# Run this from WSL2: bash setup-database.sh

set -e  # Exit on any error

echo "======================================"
echo "ManabU Database Setup"
echo "======================================"
echo ""

# Database connection string
export DATABASE_URL="postgresql://manabu_dev:dev_password_123@localhost:5432/manabu_dev?schema=public"

# Step 1: Start PostgreSQL
echo "Step 1: Starting PostgreSQL container..."
docker compose up -d postgres
echo "✓ PostgreSQL container started"
echo ""

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to initialize..."
sleep 10
echo ""

# Step 2: Verify container health
echo "Step 2: Verifying container health..."
docker compose ps
echo ""
docker compose logs postgres | tail -n 5
echo ""

# Step 3: Test connectivity
echo "Step 3: Testing database connectivity..."
if docker compose exec postgres psql -U manabu_dev -d manabu_dev -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Database connection successful"
else
    echo "✗ Database connection failed"
    echo "Please check container logs: docker compose logs postgres"
    exit 1
fi
echo ""

# Step 4: Generate Prisma Client
echo "Step 4: Generating Prisma Client..."
npx prisma generate
echo "✓ Prisma Client generated"
echo ""

# Step 5: Run migration
echo "Step 5: Running database migration..."
npx prisma migrate dev --name init
echo "✓ Migration completed"
echo ""

# Step 6: Verify tables created
echo "Step 6: Verifying tables..."
docker compose exec postgres psql -U manabu_dev -d manabu_dev -c "\dt"
echo ""

# Step 7: Seed database
echo "Step 7: Seeding database..."
npx prisma db seed
echo "✓ Database seeded"
echo ""

# Step 8: Verify seeded data
echo "Step 8: Verifying seeded data..."
echo "Kana count:"
docker compose exec postgres psql -U manabu_dev -d manabu_dev -c "SELECT COUNT(*) FROM kana;"
echo ""
echo "Vocabulary samples:"
docker compose exec postgres psql -U manabu_dev -d manabu_dev -c "SELECT word, reading, meaning FROM vocabulary LIMIT 3;"
echo ""

# Step 9: Test Node.js connection
echo "Step 9: Testing Node.js database connection..."
npx tsx src/lib/__test-db.ts
echo ""

# Step 10: Verify migration status
echo "Step 10: Verifying migration status..."
npx prisma migrate status
echo ""

echo "======================================"
echo "✅ Database setup completed!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Exit WSL2: exit"
echo "2. Start dev server from Windows: npm run dev"
echo "3. Visit http://localhost:3000"
echo ""
echo "Optional: Open Prisma Studio to browse data"
echo "  DATABASE_URL=\"$DATABASE_URL\" npx prisma studio"
echo ""
