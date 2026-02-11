@echo off
echo ====================================
echo  Control EMS - Inicio Rapido
echo ====================================
echo.
echo Este script inicia el backend y el frontend automaticamente
echo.
echo Presiona Ctrl+C en cualquier momento para detener los servidores
echo.
pause

echo.
echo [Backend] Iniciando servidor Django...
start cmd /k "cd backend && .venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

timeout /t 3 /nobreak > nul

echo [Frontend] Iniciando servidor Vite...
start cmd /k "npm run dev"

echo.
echo ====================================
echo  Servidores iniciados!
echo ====================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Para detener los servidores, cierra las ventanas o presiona Ctrl+C
echo.
