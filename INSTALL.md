# 📦 Guía de Instalación - Control EMS

Esta guía te ayudará a configurar el proyecto en tu computadora desde cero.

## ✅ Requisitos Previos

Antes de empezar, necesitas instalar:

### 1. Python 3.10 o superior
- Descarga: https://www.python.org/downloads/
- Durante la instalación, marca la opción **"Add Python to PATH"**
- Verifica la instalación:
  ```powershell
  python --version
  ```

### 2. Node.js 18 o superior
- Descarga: https://nodejs.org/
- Verifica la instalación:
  ```powershell
  node --version
  npm --version
  ```

### 3. PostgreSQL 12 o superior

**Tienes 2 opciones:**

#### Opción A: PostgreSQL Local (instalado en tu PC)
- Descarga: https://www.postgresql.org/download/windows/
- Durante la instalación:
  - Recuerda la **contraseña** que pongas para el usuario `postgres`
  - Mantén el puerto **5432** (por defecto)
  - Instala **pgAdmin** (herramienta gráfica opcional pero recomendada)
- Verifica la instalación:
  ```powershell
  psql --version
  ```

#### Opción B: Supabase (en la nube - GRATIS) 🌟 RECOMENDADO
- ✅ No necesitas instalar PostgreSQL
- ✅ Gratis hasta 500MB
- ✅ Accesible desde cualquier lugar
- ✅ Sin tarjeta de crédito
- 📖 **Guía completa:** Ver [DEPLOY_SUPABASE.md](DEPLOY_SUPABASE.md)
- Pasos rápidos:
  1. Crear cuenta en https://supabase.com
  2. Crear proyecto nuevo
  3. Copiar credenciales a `.env`
  4. ¡Listo!

### 4. Git (opcional, pero recomendado)
- Descarga: https://git-scm.com/
- Verifica la instalación:
  ```powershell
  git --version
  ```

---

## 🚀 Instalación Rápida (Automática)

### Opción A: Usando el script de setup

1. **Obtén el proyecto**:
   ```powershell
   git clone <url-del-repositorio>
   cd "Control EMS"
   ```

2. **Crea la base de datos** (solo una vez):
   ```powershell
   psql -U postgres
   ```
   Dentro de PostgreSQL:
   ```sql
   CREATE DATABASE control_ems_db;
   \q
   ```

3. **Ejecuta el script de setup automático**:
   ```powershell
   cd backend
   .\setup.bat
   ```
   
   El script te pedirá que edites el archivo `.env` con tu contraseña de PostgreSQL.

4. **Instala el frontend**:
   ```powershell
   cd ..
   npm install
   ```

5. **¡Listo! Inicia el proyecto**:
   
   Terminal 1 - Backend:
   ```powershell
   cd backend
   .venv\Scripts\Activate.ps1
   python manage.py runserver 0.0.0.0:8000
   ```
   
   Terminal 2 - Frontend:
   ```powershell
   npm run dev
   ```

---

## 📝 Instalación Manual (Paso a Paso)

### Paso 1: Obtener el Proyecto

```powershell
# Si tienes el proyecto en un ZIP, extráelo
# Si usas git:
git clone <url-del-repositorio>
cd "Control EMS"
```

### Paso 2: Configurar PostgreSQL

**Elige una opción:**

#### Opción A: PostgreSQL Local

1. **Abrir pgAdmin o la terminal de PostgreSQL**:
   ```powershell
   psql -U postgres
   ```

2. **Crear la base de datos**:
   ```sql
   CREATE DATABASE control_ems_db;
   ```

3. **Verificar que se creó**:
   ```sql
   \l
   ```
   Deberías ver `control_ems_db` en la lista.

4. **Salir de PostgreSQL**:
   ```sql
   \q
   ```

#### Opción B: Supabase (Base de datos en la nube - GRATIS) 🌟

1. **Ve a** https://supabase.com y crea una cuenta

2. **Crea un nuevo proyecto**:
   - Name: `control-ems`
   - Database Password: [genera una contraseña segura]
   - Region: South America (sao1)
   - Pricing Plan: Free

3. **Espera 2-3 minutos** mientras se crea

4. **Obtén las credenciales**:
   - Settings > Database > Connection String
   - Copia: Host, Password, Port

📖 **Guía detallada:** Lee [DEPLOY_SUPABASE.md](DEPLOY_SUPABASE.md) para instrucciones paso a paso con capturas.

### Paso 3: Configurar Backend (Django)

1. **Navegar a la carpeta backend**:
   ```powershell
   cd backend
   ```

2. **Crear entorno virtual**:
   ```powershell
   python -m venv .venv
   ```

3. **Activar entorno virtual**:
   ```powershell
   # PowerShell:
   .\.venv\Scripts\Activate.ps1
   
   # CMD:
   .\.venv\Scripts\activate.bat
   ```

4. **Actualizar pip y instalar dependencias**:
   ```powershell
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. **Configurar variables de entorno**:
   ```powershell
   # Copiar el archivo de ejemplo
   copy .env.example .env
   
   # Editar el archivo .env
   notepad .env
   ```
   
   Ajusta estas líneas con tu contraseña real:
   ```env
   DB_NAME=control_ems_db
   DB_USER=postgres
   DB_PASSWORD=TU_CONTRASEÑA_AQUI
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Ejecutar migraciones**:
   ```powershell
   python manage.py migrate
   ```

7. **Crear superusuario (opcional)**:
   ```powershell
   python manage.py createsuperuser
   ```

8. **Iniciar servidor backend**:
   ```powershell
   python manage.py runserver 0.0.0.0:8000
   ```
   
   Verifica que funciona abriendo: http://localhost:8000/api/health/

### Paso 4: Configurar Frontend (React + Vite)

1. **Abrir una nueva terminal** y navegar a la raíz del proyecto:
   ```powershell
   cd "Control EMS"
   ```

2. **Instalar dependencias**:
   ```powershell
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```powershell
   npm run dev
   ```
   
   Abre tu navegador en: http://localhost:5173

---

## 🔧 Solución de Problemas Comunes

### Error: "psql no se reconoce como comando"
- PostgreSQL no está en el PATH del sistema
- Solución: Reinicia tu computadora después de instalar PostgreSQL
- O busca manualmente: `C:\Program Files\PostgreSQL\15\bin\psql.exe`

### Error: "password authentication failed"
- La contraseña en `.env` no coincide con la de PostgreSQL
- Solución: Verifica y corrige la contraseña en el archivo `.env`

### Error: "database 'control_ems_db' does not exist"
- No se creó la base de datos
- Solución: Ejecuta los comandos del Paso 2 para crear la base de datos

### Error al ejecutar `Activate.ps1` (PowerShell)
- Error: "no se puede porque la ejecución de scripts está deshabilitada"
- Solución:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### El frontend no conecta con el backend
- Verifica que el backend esté corriendo en el puerto 8000
- Verifica en la consola del navegador si hay errores de CORS

---

## 📦 Archivos para Compartir el Proyecto

Cuando compartas el proyecto con alguien más, asegúrate de incluir:

✅ **SÍ incluir:**
- Todos los archivos del código fuente
- `requirements.txt`
- `package.json`
- `.env.example` (archivo de ejemplo)
- README.md y esta guía (INSTALL.md)

❌ **NO incluir:**
- `.venv/` (entorno virtual - se crea localmente)
- `node_modules/` (dependencias npm - se instalan localmente)
- `.env` (contiene contraseñas - cada quien crea el suyo)
- `db.sqlite3` (ya no lo usamos, usamos PostgreSQL)
- `__pycache__/` (archivos compilados de Python)

### Crear un archivo .gitignore

Si usas Git, crea un archivo `.gitignore` en la raíz:

```gitignore
# Python
.venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/

# Node
node_modules/
dist/
build/

# Entorno
.env

# Base de datos
db.sqlite3
*.sqlite3

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## 🎉 ¡Proyecto Listo!

Una vez completados todos los pasos, tendrás:
- ✅ Backend Django corriendo en http://localhost:8000
- ✅ Frontend React corriendo en http://localhost:5173
- ✅ Base de datos PostgreSQL configurada y funcionando

### Comandos para uso diario:

**Iniciar Backend:**
```powershell
cd backend
.venv\Scripts\Activate.ps1
python manage.py runserver 0.0.0.0:8000
```

**Iniciar Frontend:**
```powershell
npm run dev
```

---

## 📚 Recursos Adicionales

- Documentación Django: https://docs.djangoproject.com/
- Documentación React: https://react.dev/
- Documentación PostgreSQL: https://www.postgresql.org/docs/
- Documentación Vite: https://vitejs.dev/

---

¿Problemas? Revisa la sección de **Solución de Problemas** o consulta los archivos README en las carpetas del proyecto.
