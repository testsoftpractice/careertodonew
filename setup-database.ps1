# Database Setup and Seed Script
# Run this from D:\new project\careertodonew

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Database Setup and Seed Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if migration exists
$migrationDir = ".\prisma\migrations"
if (Test-Path $migrationDir) {
    $migrations = Get-ChildItem -Path $migrationDir -Directory
    if ($migrations.Count -eq 0) {
        Write-Host "No migrations found. Creating initial migration..." -ForegroundColor Yellow
        npx prisma migrate dev --name init
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Migration creation failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Initial migration created!" -ForegroundColor Green
    } else {
        Write-Host "Found $($migrations.Count) existing migration(s)." -ForegroundColor Green
    }
} else {
    Write-Host "No migrations directory found. Creating initial migration..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Migration creation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Initial migration created!" -ForegroundColor Green
}

Write-Host ""

# Step 2: Reset database
Write-Host "Resetting database..." -ForegroundColor Yellow
npx prisma migrate reset --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database reset failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database reset successful!" -ForegroundColor Green

Write-Host ""

# Step 3: Verify
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now:" -ForegroundColor White
Write-Host "  1. Start the dev server: npm run dev" -ForegroundColor Gray
Write-Host "  2. View data: npx prisma studio" -ForegroundColor Gray
Write-Host ""
Write-Host "Test accounts available:" -ForegroundColor White
Write-Host "  Student: student.stanford@edu.com / Password123!" -ForegroundColor Gray
Write-Host "  Employer: employer@techcorp.com / Password123!" -ForegroundColor Gray
Write-Host "  Investor: investor@venturefund.com / Password123!" -ForegroundColor Gray
Write-Host ""
