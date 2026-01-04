@echo off
echo Starting Psychiatric Disorder Detection App...
echo.

:: For Windows Terminal - opens in new tabs
wt -w 0 new-tab -d "%~dp0backend" --title "Backend" cmd /k ".\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000" ; ^
   new-tab -d "%~dp0frontend" --title "Frontend" cmd /k "npm run dev"

echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
