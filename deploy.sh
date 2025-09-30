#!/bin/bash

# Peer2Pool Deployment Script
# This script automates the deployment process for both frontend and backend

set -e  # Exit on any error

echo "🚀 Starting Peer2Pool Deployment..."

# Check if required environment variables are set
check_env_vars() {
    local required_vars=(
        "FIREBASE_PROJECT_ID"
        "STRIPE_SECRET_KEY"
        "REACT_APP_FIREBASE_API_KEY"
        "REACT_APP_STRIPE_PUBLISHABLE_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "❌ Error: Environment variable $var is not set"
            exit 1
        fi
    done
    echo "✅ Environment variables check passed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Root dependencies
    npm install
    
    # Client dependencies
    cd client && npm install && cd ..
    
    # Server dependencies  
    cd server && npm install && cd ..
    
    echo "✅ Dependencies installed"
}

# Build frontend
build_frontend() {
    echo "🏗️ Building frontend..."
    cd client
    npm run build
    cd ..
    echo "✅ Frontend built successfully"
}

# Test build
test_build() {
    echo "🧪 Testing build..."
    cd client
    if [ -d "build" ] && [ -f "build/index.html" ]; then
        echo "✅ Build test passed"
    else
        echo "❌ Build test failed"
        exit 1
    fi
    cd ..
}

# Deploy to Vercel
deploy_vercel() {
    echo "🌐 Deploying to Vercel..."
    npx vercel --prod
    echo "✅ Frontend deployed to Vercel"
}

# Deploy to Firebase Functions  
deploy_firebase() {
    echo "🔥 Deploying to Firebase Functions..."
    cd server
    npm install -g firebase-tools
    firebase login
    firebase use $FIREBASE_PROJECT_ID
    firebase deploy --only functions,firestore:rules
    cd ..
    echo "✅ Backend deployed to Firebase"
}

# Main deployment flow
main() {
    echo "Starting deployment process..."
    
    check_env_vars
    install_dependencies
    build_frontend
    test_build
    
    read -p "Deploy to production? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
        deploy_firebase
        echo "🎉 Deployment completed successfully!"
        echo "Frontend: Check Vercel dashboard for URL"
        echo "Backend: https://$FIREBASE_PROJECT_ID.web.app"
    else
        echo "Deployment cancelled"
    fi
}

# Run main function
main "$@"