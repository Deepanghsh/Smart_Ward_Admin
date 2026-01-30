#!/bin/bash

# SmartHostel Setup Script
# This script helps set up both frontend and backend

echo "🏢 SmartHostel - Complete Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js (v18 or higher) from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js installed:${NC} $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
echo "------------------------"

cd backend || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Backend dependencies already installed${NC}"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created backend .env file${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env already exists${NC}"
fi

cd ..
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
echo "------------------------"

cd frontend || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Frontend dependencies already installed${NC}"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ Created frontend .env file${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env already exists${NC}"
fi

cd ..
echo ""

# Summary
echo "======================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "======================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start Frontend (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🔑 Default Test Accounts:"
echo ""
echo "Admin:"
echo "  Email: admin@smarthostel.com"
echo "  Password: admin123"
echo ""
echo "Student:"
echo "  Email: rahul@university.edu"
echo "  Password: student123"
echo ""
echo -e "${YELLOW}⚠️  Remember to update .env files with your configuration!${NC}"
echo ""
