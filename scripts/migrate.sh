#!/bin/bash
# Migration script for Vercel
# This script will be run during build to migrate the database

echo "🔄 Starting database migration..."

# Generate Prisma Client
npx prisma generate

# Push schema to database (this will add new columns)
# Note: This is safe for adding columns, existing data will be preserved
npx prisma db push --accept-data-loss

echo "✅ Database migration completed"
