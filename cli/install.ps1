#!/usr/bin/env pwsh

# AyushBridge CLI Installation Script for Windows PowerShell

Write-Host "🚀 Installing AyushBridge CLI..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required but not found" -ForegroundColor Red
    Write-Host "Please install Node.js 16.0.0 or higher from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Navigate to CLI directory
$cliPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $cliPath

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Run setup script
Write-Host "⚙️ Running setup..." -ForegroundColor Blue
npm run setup

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Setup failed" -ForegroundColor Red
    exit 1
}

# Test CLI
Write-Host "🧪 Testing CLI..." -ForegroundColor Blue
npm run test-cli

Write-Host ""
Write-Host "🎉 AyushBridge CLI installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Usage:" -ForegroundColor Yellow
Write-Host "  node bin/ayush.js --help" -ForegroundColor White
Write-Host "  node bin/ayush.js health" -ForegroundColor White
Write-Host ""
Write-Host "For global installation:" -ForegroundColor Yellow
Write-Host "  npm install -g ." -ForegroundColor White
Write-Host "  ayush --help" -ForegroundColor White
