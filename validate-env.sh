#!/bin/bash

echo "🔍 Validating Environment Variables"
echo "==================================="

# Load .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Found .env file"
else
    echo "❌ No .env file found. Please create one:"
    echo "   cp .env.example .env"
    exit 1
fi

# Function to check if variable exists and is not empty
check_var() {
    local var_name=$1
    local var_value=${!var_name}
    local required=$2
    
    if [ -z "$var_value" ]; then
        if [ "$required" = "true" ]; then
            echo "❌ $var_name - MISSING (Required)"
            return 1
        else
            echo "⚠️  $var_name - Not set (Optional)"
            return 0
        fi
    else
        echo "✅ $var_name - Set"
        return 0
    fi
}

# Function to validate specific formats
validate_format() {
    local var_name=$1
    local var_value=${!var_name}
    local pattern=$2
    local description=$3
    
    if [ ! -z "$var_value" ]; then
        if [[ $var_value =~ $pattern ]]; then
            echo "   ✅ Format valid ($description)"
        else
            echo "   ❌ Format invalid - should $description"
            return 1
        fi
    fi
    return 0
}

echo ""
echo "Checking required variables..."

# Check all variables
has_errors=false

# PORT (optional)
check_var "PORT" "false"

# RESEND_API_KEY (required)
if ! check_var "RESEND_API_KEY" "true"; then
    has_errors=true
else
    validate_format "RESEND_API_KEY" "^re_" "start with 're_'"
    if [ $? -ne 0 ]; then has_errors=true; fi
fi

# SUPABASE_URL (required) 
if ! check_var "SUPABASE_URL" "true"; then
    has_errors=true
else
    validate_format "SUPABASE_URL" "^https://.*\.supabase\.co$" "be https://project-id.supabase.co"
    if [ $? -ne 0 ]; then has_errors=true; fi
fi

# SUPABASE_ANON_KEY (required)
if ! check_var "SUPABASE_ANON_KEY" "true"; then
    has_errors=true
else
    validate_format "SUPABASE_ANON_KEY" "^eyJ" "start with 'eyJ' (JWT token)"
    if [ $? -ne 0 ]; then has_errors=true; fi
fi

echo ""

if [ "$has_errors" = true ]; then
    echo "❌ Environment validation FAILED"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy example: cp .env.example .env"
    echo "2. Edit .env with your actual values"  
    echo "3. See ENVIRONMENT_SETUP.md for detailed instructions"
    echo ""
    exit 1
else
    echo "🎉 Environment validation PASSED"
    echo ""
    echo "🚀 You can now start the service:"
    echo "   bun run dev"
    echo ""
fi