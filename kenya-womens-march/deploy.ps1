# Kenya Women's March - Vercel Deployment Script
# Run this script to prepare and deploy your website

Write-Host "🚀 Kenya Women's March - Vercel Deployment Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Step 1: Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json" -ForegroundColor Green

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Step 3: Install react-helmet if not present
Write-Host "🔧 Checking for react-helmet..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules/react-helmet")) {
    Write-Host "📦 Installing react-helmet..." -ForegroundColor Yellow
    npm install react-helmet
}

# Step 4: Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Step 5: Check if Vercel CLI is installed
Write-Host "🔍 Checking for Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
    } else {
        throw "Vercel CLI not found"
    }
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

# Step 6: Check if user is logged in
Write-Host "🔐 Checking Vercel login status..." -ForegroundColor Yellow
try {
    vercel whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
    } else {
        Write-Host "🔑 Please log in to Vercel..." -ForegroundColor Yellow
        vercel login
    }
} catch {
    Write-Host "🔑 Please log in to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Step 7: Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "This will open your browser for authentication if needed." -ForegroundColor Cyan

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your website is now live!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test your live website" -ForegroundColor White
Write-Host "2. Set up environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "3. Configure custom domain (optional)" -ForegroundColor White
Write-Host "4. Set up monitoring and analytics" -ForegroundColor White

Write-Host "`n🔗 Useful URLs:" -ForegroundColor Cyan
Write-Host "- Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "- Project Settings: https://vercel.com/dashboard/[your-project]/settings" -ForegroundColor White

Write-Host "`n✅ Deployment script completed!" -ForegroundColor Green 