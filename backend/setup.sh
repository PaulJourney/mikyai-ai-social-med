#!/bin/bash

# Miky.ai Backend Setup Script

echo "🚀 Setting up Miky.ai Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual environment variables before starting the server"
    echo "   Required variables:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - JWT_SECRET (secure random string)"
    echo "   - OPENAI_API_KEY (your OpenAI API key)"
    echo "   - STRIPE_SECRET_KEY (your Stripe secret key)"
    echo "   - SMTP credentials for email"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up a PostgreSQL database"
echo "2. Update DATABASE_URL in .env file"
echo "3. Update other environment variables in .env"
echo "4. Run database migrations: npm run migrate"
echo "5. Start development server: npm run dev"
echo ""
echo "Server will run on: http://localhost:3001"