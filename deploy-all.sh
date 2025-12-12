#!/bin/bash

# iTerra Concierge Wellness Platform - One-Command Deployment
# This script handles the complete setup and deployment process
# Usage: ./deploy-all.sh

set -e  # Exit on error

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   iTerra Concierge Wellness Platform - Full Deployment  ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI version: $(firebase --version)"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found."
    echo "📝 Running Firebase setup..."
    node scripts/setup-firebase.js
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "📦 Installing function dependencies..."
cd functions && npm install && cd ..

echo ""
echo "🔨 Building React application..."
npm run build

echo ""
echo "🔐 Checking Firebase authentication..."
firebase login:ci --no-localhost || firebase login

echo ""
echo "🚀 Deploying to Firebase..."
firebase deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Running post-deployment verification..."
node scripts/verify-deployment.js

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   ✨ All Done! Your platform is live! ✨                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 To seed associates, run:"
echo "   node scripts/seed-associates.js"
echo ""
