@echo off
start cmd /k "cd backend && .\venv\Scripts\python -m uvicorn main:app --reload"
start cmd /k "cd frontend && npm run dev"
echo Backend and Frontend are starting in separate windows...
pause
