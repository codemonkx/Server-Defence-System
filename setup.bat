#!/bin/bash

# Project Defend - Installation & Setup Script
# This script installs all dependencies for the MERN application and the AI Defense Agent.

echo "======================================================="
echo "🛡️  Project Defend: AI Cyber Defense System Setup"
echo "======================================================="
echo ""

# 1. Check for Prerequisites
echo "[1/4] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo >&2 "❌ Node.js is not installed. Please install it first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "❌ npm is not installed. Please install it first."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo >&2 "❌ Python 3 is not installed. Please install it first."; exit 1; }
echo "✅ Prerequisites met."
echo ""

# 2. Setup Backend
echo "[2/4] Installing Backend dependencies..."
cd Elearning-Platform-Using-MERN/backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "💡 Created .env from .env.example in backend. Please update your API keys."
fi
cd ../..
echo ""

# 3. Setup Frontend
echo "[3/4] Installing Frontend dependencies..."
cd Elearning-Platform-Using-MERN/frontend
npm install
cd ../..
echo ""

# 4. Setup AI Defense Agent
echo "[4/4] Installing AI Defense Agent dependencies..."
cd final-year-pro
python3 -m venv venv
source venv/bin/activate || source venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
if [ ! -f .env ]; then
    cp .env.example .env
    echo "💡 Created .env from .env.example in AI Agent. Please update your API keys."
fi
cd ..

echo ""
echo "======================================================="
echo "✅ Setup Complete!"
echo "======================================================="
echo "Next steps:"
echo "1. Configure your .env files in backend/ and final-year-pro/."
echo "2. Use the .bat files (Windows) or start scripts to run the demo."
echo "======================================================="
