 # Backend (Django) - Guía de instalación y API mínima

Esta carpeta contiene un scaffold mínimo de Django con una app `api` que expone dos endpoints:

- `GET /api/health/` → devuelve `{ "status": "ok" }`
- `POST /api/upload/` → acepta un archivo CSV (multipart/form-data, campo `file`) y devuelve métricas básicas (total kWh, promedio kW, demanda máxima, CO2, facturación) y una muestra de filas.

Requisitos previos
- Python 3.10 o superior
- pip
- virtualenv (recomendado)
- **PostgreSQL 12 o superior** (descarga: https://www.postgresql.org/download/windows/)

Instalación y ejecución (Windows - PowerShell)

1. **Instalar PostgreSQL**:
   - Descarga e instala PostgreSQL
   - Recuerda la contraseña del usuario `postgres`
   - Asegúrate de que el servicio PostgreSQL esté corriendo

2. **Crear la base de datos**:
   Abre una terminal y ejecuta:
   ```powershell
   psql -U postgres
   ```
   Dentro de PostgreSQL:
   ```sql
   CREATE DATABASE control_ems_db;
   \q
   ```

3. Navegar a la carpeta `backend`:

```powershell
cd path\to\project\backend
```

4. Crear y activar un entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # PowerShell
# o en CMD:
.\.venv\Scripts\activate.bat
```

5. Instalar dependencias:

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

6. **Configurar variables de entorno**:
   - Copia el archivo `.env.example` a `.env`
   - Edita `.env` y ajusta las credenciales de PostgreSQL:
   ```
   DB_NAME=control_ems_db
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_real
   DB_HOST=localhost
   DB_PORT=5432
   ```

7. Aplicar migraciones iniciales y crear superusuario (opcional):

```powershell
python manage.py migrate
python manage.py createsuperuser
```

5. Ejecutar servidor de desarrollo:

```powershell
python manage.py runserver 0.0.0.0:8000
```

Endpoints de ejemplo

- Health:

```powershell
curl http://127.0.0.1:8000/api/health/
# => { "status": "ok" }
```

- Upload (CSV):

```powershell
curl -X POST -F "file=@c:\path\to\data.csv" http://127.0.0.1:8000/api/upload/
```

Respuesta de ejemplo (JSON):

```
{
  "filename": "data.csv",
  "metrics": {
    "total_kwh": 123.456,
    "avg_kw": 5.123,
    "max_kw": 12.34,
    "total_co2": 85.123,
    "avg_pf": 0.95,
    "total_billing": 1023.45,
    "rows": 240
  },
  "sample": [ /* primeras filas del CSV como objetos */ ]
}
```

Notas
- Actualmente el endpoint acepta CSV en UTF-8 y realiza una conversión sencilla; para soportar XLSX habría que añadir `openpyxl` o `pandas`.
- Configure `SECRET_KEY` y `DEBUG=False` antes de desplegar en producción.
