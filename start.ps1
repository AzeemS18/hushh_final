Write-Host "Starting PlacementHub App..." -ForegroundColor Cyan

Write-Host "Starting FastAPI Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"python -m uvicorn main:app --reload`""


Write-Host "Starting Next.js Frontend..." -ForegroundColor Green
Set-Location -Path ".\HUSHH"
npm run dev
