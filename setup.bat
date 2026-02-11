@echo off
echo ====================================
echo  Setup - Control EMS Backend
echo ====================================
echo.

echo [1/6] Verificando Python...
python --version
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en PATH
    pause
    exit /b 1
)
echo.

echo [2/6] Creando entorno virtual...
if not exist ".venv" (
    python -m venv .venv
    echo Entorno virtual creado
) else (
    echo Entorno virtual ya existe
)
echo.

echo [3/6] Activando entorno virtual e instalando dependencias...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
echo.

echo [4/6] Configurando archivo .env...
if not exist ".env" (
    copy .env.example .env
    echo.
    echo IMPORTANTE: Edita el archivo .env con tus credenciales de PostgreSQL
    echo.
    notepad .env
) else (
    echo Archivo .env ya existe
)
echo.

echo [5/6] Verificando conexion a PostgreSQL...
echo NOTA: Asegurate de tener PostgreSQL instalado y la base de datos creada
echo Para crear la base de datos ejecuta:
echo   psql -U postgres
echo   CREATE DATABASE control_ems_db;
echo.
pause
echo.

echo [6/6] Ejecutando migraciones...
python manage.py migrate
if errorlevel 1 (
    echo.
    echo ERROR en migraciones. Verifica:
    echo - PostgreSQL este corriendo
    echo - La base de datos control_ems_db exista
    echo - Las credenciales en .env sean correctas
    pause
    exit /b 1
)
echo.

echo ====================================
echo  Setup completado con exito!
echo ====================================
echo.
echo Para iniciar el servidor ejecuta:
echo   .venv\Scripts\activate.bat
echo   python manage.py runserver 0.0.0.0:8000
echo.
pause
