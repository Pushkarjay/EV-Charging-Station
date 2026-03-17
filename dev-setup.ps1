#!/usr/bin/env pwsh

# ============================================
# 🏗️ LOCAL DEVELOPMENT SETUP SCRIPT
# EV Charging Station Platform
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "setup",  # setup, start, stop, test, reset
    
    [Parameter(Mandatory=$false)]
    [string]$Component = "all"  # all, backend, frontend, database
)

# Configuration
$PROJECT_ROOT = Get-Location
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$PYTHON_VERSION = "3.11"
$NODE_VERSION = "18.x"

# Colors
$SUCCESS = "Green"
$ERROR = "Red"
$WARNING = "Yellow"
$INFO = "Cyan"

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $SUCCESS
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $ERROR
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor $WARNING
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor $INFO
}

function Check-Prerequisites {
    Write-Host "`n🔍 Checking Prerequisites..." -ForegroundColor $INFO
    
    # Check Python
    $python = Get-Command python -ErrorAction SilentlyContinue
    if ($null -eq $python) {
        Write-Error-Custom "Python not found. Install from: https://www.python.org"
        exit 1
    }
    Write-Success "Python installed"
    
    # Check Node.js
    $node = Get-Command node -ErrorAction SilentlyContinue
    if ($null -eq $node) {
        Write-Error-Custom "Node.js not found. Install from: https://nodejs.org"
        exit 1
    }
    Write-Success "Node.js installed"
    
    # Check npm
    $npm = Get-Command npm -ErrorAction SilentlyContinue
    if ($null -eq $npm) {
        Write-Error-Custom "npm not found. Install Node.js which includes npm"
        exit 1
    }
    Write-Success "npm installed"
}

function Setup-Backend {
    Write-Host "`n🔧 Setting up Backend..." -ForegroundColor $INFO
    
    Push-Location $BACKEND_DIR
    
    # Create virtual environment
    Write-Info "Creating Python virtual environment..."
    python -m venv venv
    Write-Success "Virtual environment created"
    
    # Activate virtual environment
    Write-Info "Activating virtual environment..."
    & ".\venv\Scripts\Activate.ps1"
    Write-Success "Virtual environment activated"
    
    # Upgrade pip
    Write-Info "Upgrading pip..."
    python -m pip install --upgrade pip 2>&1 | Out-Null
    Write-Success "pip upgraded"
    
    # Install requirements
    Write-Info "Installing dependencies..."
    pip install -r requirements.txt 2>&1 | Out-Null
    Write-Success "Dependencies installed"
    
    # Create .env file if not exists
    if (!(Test-Path ".env")) {
        Write-Info "Creating .env configuration file..."
        @"
# Database
DATABASE_URL=sqlite:///./ev_charging.db

# Google Maps API (Set in environment, never hardcode)
GOOGLE_MAPS_API_KEY=$env:GOOGLE_MAPS_API_KEY
GOOGLE_PROJECT_ID=gcs-ev-charging-station
GCP_SERVICE_ACCOUNT=gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com

# JWT
JWT_SECRET_KEY=your-secret-key-development-only

# SMTP Email (optional)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# Server
DEBUG=true
HOST=0.0.0.0
PORT=8000

# Environment
ENVIRONMENT=development
"@ | Out-File -Encoding UTF8 ".env"
        Write-Success ".env file created"
    }
    
    # Initialize database
    Write-Info "Initializing database..."
    python seed.py 2>&1 | Out-Null
    Write-Success "Database initialized"
    
    Pop-Location
}

function Setup-Frontend {
    Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor $INFO
    
    Push-Location $FRONTEND_DIR
    
    # Create .env.local file if not exists
    if (!(Test-Path ".env.local")) {
        Write-Info "Creating .env.local configuration file..."
        @"
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google Maps API (Set in environment, never hardcode)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$env:GOOGLE_MAPS_API_KEY

# Environment
NEXT_PUBLIC_ENV=development
"@ | Out-File -Encoding UTF8 ".env.local"
        Write-Success ".env.local file created"
    }
    
    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Info "Installing npm dependencies..."
        npm install 2>&1 | Out-Null
        Write-Success "npm dependencies installed"
    }
    
    Pop-Location
}

function Start-Backend {
    Write-Host "`n🚀 Starting Backend Server..." -ForegroundColor $INFO
    
    Push-Location $BACKEND_DIR
    
    # Activate virtual environment
    & ".\venv\Scripts\Activate.ps1"
    
    Write-Info "Starting FastAPI server on http://localhost:8000"
    Write-Info "API Documentation: http://localhost:8000/docs"
    Write-Info "Alternative Docs: http://localhost:8000/redoc"
    Write-Info "`nPress Ctrl+C to stop the server"
    
    # Start development server
    uvicorn app.main:app --reload --port 8000
    
    Pop-Location
}

function Start-Frontend {
    Write-Host "`n🎨 Starting Frontend Server..." -ForegroundColor $INFO
    
    Push-Location $FRONTEND_DIR
    
    Write-Info "Starting Next.js development server on http://localhost:3000"
    Write-Info "`nPress Ctrl+C to stop the server"
    
    # Start development server
    npm run dev
    
    Pop-Location
}

function Start-All {
    Write-Host "`n📡 Starting All Services..." -ForegroundColor $INFO
    
    Write-Warning-Custom "Please open 2 terminal windows:"
    Write-Info "Terminal 1: .\dev-setup.ps1 -Action start -Component backend"
    Write-Info "Terminal 2: .\dev-setup.ps1 -Action start -Component frontend"
    Write-Info ""
    Write-Info "Or use tmux/split terminals to run both simultaneously"
}

function Run-Tests {
    Write-Host "`n🧪 Running Tests..." -ForegroundColor $INFO
    
    Push-Location $BACKEND_DIR
    
    # Activate virtual environment
    & ".\venv\Scripts\Activate.ps1"
    
    Write-Info "Running pytest..."
    pytest tests/ -v 2>&1
    
    Pop-Location
}

function Reset-Environment {
    Write-Host "`n🔄 Resetting Environment..." -ForegroundColor $WARNING
    
    $confirm = Read-Host "This will delete all databases and reinstall dependencies. Continue? (yes/no)"
    
    if ($confirm -ne "yes") {
        Write-Info "Reset cancelled"
        return
    }
    
    Write-Info "Cleaning backend..."
    Push-Location $BACKEND_DIR
    
    # Remove database
    if (Test-Path "ev_charging.db") {
        Remove-Item "ev_charging.db" -Force
        Write-Success "Database deleted"
    }
    
    # Remove virtual environment
    if (Test-Path "venv") {
        Remove-Item "venv" -Recurse -Force
        Write-Success "Virtual environment deleted"
    }
    
    Pop-Location
    
    Write-Info "Cleaning frontend..."
    Push-Location $FRONTEND_DIR
    
    # Remove node_modules
    if (Test-Path "node_modules") {
        Remove-Item "node_modules" -Recurse -Force
        Write-Success "node_modules deleted"
    }
    
    # Remove lock file cache
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Success ".next build cache deleted"
    }
    
    Pop-Location
    
    Write-Info "Running full setup..."
    Setup-Backend
    Setup-Frontend
    
    Write-Success "Environment reset complete"
}

function Show-Status {
    Write-Host "`n📊 Development Environment Status..." -ForegroundColor $INFO
    
    Write-Host "`n✓ Backend Status:" -ForegroundColor $SUCCESS
    if (Test-Path "$BACKEND_DIR/venv") {
        Write-Host "  • Virtual environment: ✓ Created"
    } else {
        Write-Host "  • Virtual environment: ✗ Not created"
    }
    
    if (Test-Path "$BACKEND_DIR/requirements.txt") {
        Write-Host "  • Requirements: ✓ Found"
    }
    
    if (Test-Path "$BACKEND_DIR/.env") {
        Write-Host "  • Configuration: ✓ Created"
    } else {
        Write-Host "  • Configuration: ✗ Missing"
    }
    
    if (Test-Path "$BACKEND_DIR/ev_charging.db") {
        Write-Host "  • Database: ✓ Initialized"
    } else {
        Write-Host "  • Database: ✗ Not created"
    }
    
    Write-Host "`n✓ Frontend Status:" -ForegroundColor $SUCCESS
    if (Test-Path "$FRONTEND_DIR/node_modules") {
        Write-Host "  • node_modules: ✓ Installed"
    } else {
        Write-Host "  • node_modules: ✗ Not installed"
    }
    
    if (Test-Path "$FRONTEND_DIR/.env.local") {
        Write-Host "  • Configuration: ✓ Created"
    } else {
        Write-Host "  • Configuration: ✗ Missing"
    }
    
    if (Test-Path "$FRONTEND_DIR/package.json") {
        Write-Host "  • Package config: ✓ Found"
    }
}

function Full-Setup {
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor "Magenta"
    Write-Host "║  🏗️ LOCAL DEVELOPMENT SETUP 🏗️            ║" -ForegroundColor "Magenta"
    Write-Host "║     EV Charging Station Platform           ║" -ForegroundColor "Magenta"
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor "Magenta"
    
    Check-Prerequisites
    Setup-Backend
    Setup-Frontend
    Show-Status
    
    Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor "Green"
    Write-Host "║  ✅ SETUP COMPLETED! ✅                    ║" -ForegroundColor "Green"
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor "Green"
    
    Write-Host "`nNext Steps:" -ForegroundColor $SUCCESS
    Write-Host "  1. Start backend:  .\dev-setup.ps1 -Action start -Component backend"
    Write-Host "  2. Start frontend: .\dev-setup.ps1 -Action start -Component frontend"
    Write-Host "  3. Open browser to http://localhost:3000"
    Write-Host "`nFor all commands:   .\dev-setup.ps1 -Help"
}

# Main execution
switch ($Action.ToLower()) {
    "setup" { Full-Setup }
    "start" {
        switch ($Component.ToLower()) {
            "backend" { Start-Backend }
            "frontend" { Start-Frontend }
            "all" { Start-All }
            default { Write-Error-Custom "Unknown component: $Component" }
        }
    }
    "status" { Show-Status }
    "test" { Run-Tests }
    "reset" { Reset-Environment }
    "help" {
        Write-Host @"
Usage: .\dev-setup.ps1 -Action [command] -Component [target]

Commands:
  setup    - Initialize development environment (default)
  start    - Start services
  status   - Show environment status
  test     - Run tests
  reset    - Reset all databases and reinstall dependencies
  help     - Show this help message

Components (for start command):
  backend  - Start FastAPI backend server
  frontend - Start Next.js frontend server
  all      - Show instructions to start both

Examples:
  .\dev-setup.ps1                                    # Full setup
  .\dev-setup.ps1 -Action start -Component backend  # Start backend
  .\dev-setup.ps1 -Action status                    # Check status
  .\dev-setup.ps1 -Action reset                     # Reset environment

"@
    }
    default {
        Write-Error-Custom "Unknown action: $Action"
        Write-Info "Use: .\dev-setup.ps1 -Help"
        exit 1
    }
}

Write-Host "`n"
