@echo off
echo Starting PlacementHub App...

:: Start the Python backend in a new command window
echo Starting FastAPI Backend...
start "Backend Server" cmd /c "python -m uvicorn main:app --reload"

:: Start the Next.js frontend in the current window
echo Starting Next.js Frontend...
cd HUSHH
npm run dev
