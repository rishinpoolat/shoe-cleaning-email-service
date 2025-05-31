#!/bin/bash

echo "🔧 Testing Shoe Cleaning Email Service Build"
echo "==============================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install Bun first."
    exit 1
fi

echo "✅ Bun is installed"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Type check
echo "🔍 Running type check..."
bun run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check failed, but continuing with build..."
fi

# Try simple build first
echo "🏗️  Attempting simple build..."
bun run build:simple

if [ $? -eq 0 ]; then
    echo "✅ Simple build successful!"
    echo "📁 Build output in ./dist/"
    ls -la ./dist/
else
    echo "❌ Simple build failed, trying advanced build..."
    
    # Try advanced build
    bun run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Advanced build successful!"
        echo "📁 Build output in ./dist/"
        ls -la ./dist/
    else
        echo "❌ Both builds failed. Check the errors above."
        exit 1
    fi
fi

echo ""
echo "🎉 Build completed successfully!"
echo "🚀 You can now run: bun start"
