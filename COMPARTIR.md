# 📋 Checklist para Compartir el Proyecto

## ✅ Antes de Compartir

Asegúrate de que tu proyecto incluye estos archivos:

### 📁 Archivos Esenciales
- [ ] `backend/`
  - [ ] `requirements.txt` - Lista de dependencias Python
  - [ ] `.env.example` - Plantilla de configuración
  - [ ] `setup.bat` - Script de instalación automática
  - [ ] `README.md` - Documentación del backend
  - [ ] Todos los archivos `.py` del proyecto
  
- [ ] `src/` - Código fuente del frontend
- [ ] `package.json` - Dependencias de Node.js
- [ ] `vite.config.ts` - Configuración de Vite
- [ ] `README.md` - Documentación principal
- [ ] `INSTALL.md` - Guía de instalación detallada
- [ ] `DEPLOY_SUPABASE.md` - Guía de deployment en la nube
- [ ] `.gitignore` - Protege archivos sensibles
- [ ] `start.bat` - Script de inicio rápido

### ❌ NO Incluir (están en .gitignore)
- [ ] `.venv/` o `env/` - Entorno virtual (se crea localmente)
- [ ] `node_modules/` - Dependencias (se instalan con npm install)
- [ ] `.env` - Contraseñas y configuración privada
- [ ] `db.sqlite3` - Base de datos antigua
- [ ] `__pycache__/` - Archivos compilados Python
- [ ] `build/` o `dist/` - Archivos compilados

---

## 📦 Métodos para Compartir

### Opción 1: GitHub (Recomendado)
```powershell
# En la carpeta del proyecto:
git init
git add .
git commit -m "Initial commit"
git remote add origin <url-de-tu-repo>
git push -u origin main
```

La otra persona solo necesita:
```powershell
git clone <url-de-tu-repo>
cd "Control EMS"
```

### Opción 2: ZIP
1. Comprime toda la carpeta del proyecto
2. Asegúrate de **NO incluir**:
   - `.venv/`
   - `node_modules/`
   - `.env`
   - `db.sqlite3`
3. Comparte el archivo ZIP

---

## 📝 Instrucciones para la Otra Persona

Envíales este mensaje:

```
Hola, te comparto el proyecto Control EMS.

REQUISITOS PREVIOS:
1. Python 3.10+ (https://www.python.org/downloads/)
2. Node.js 18+ (https://nodejs.org/)
3. PostgreSQL 12+ (https://www.postgresql.org/download/)
   O Supabase (https://supabase.com) - Base de datos gratis en la nube 🌟

INSTALACIÓN RÁPIDA:
1. Descomprime/clona el proyecto
2. Lee el archivo INSTALL.md para instrucciones detalladas
3. Opción A: PostgreSQL local - Ejecuta backend/setup.bat
   Opción B: Supabase (nube) - Lee DEPLOY_SUPABASE.md

CONFIGURACIÓN DE BASE DE DATOS:
- Crea la base de datos: psql -U postgres
  CREATE DATABASE control_ems_db;
- Copia .env.example a .env en la carpeta backend
- Edita .env con tu contraseña de PostgreSQL

INICIAR PROYECTO:
- Opción A: Ejecuta start.bat desde la raíz
- Opción B: Manual
  Terminal 1: cd backend && .venv\Scripts\Activate.ps1 && python manage.py runserver
  Terminal 2: npm run dev

¿Problemas? Revisa INSTALL.md sección "Solución de Problemas"
```

---

## 🔒 Seguridad

Antes de compartir, verifica que:
- [ ] El archivo `.env` NO está incluido
- [ ] El `.gitignore` está configurado correctamente
- [ ] No hay contraseñas hardcodeadas en el código
- [ ] `SECRET_KEY` en settings.py usa variable de entorno
- [ ] No hay archivos sensibles en el repositorio

---

## ✅ Verificación Final

Prueba que todo funciona haciendo una instalación fresca:

1. **Borra las carpetas locales** (en una copia de prueba):
   ```powershell
   rm -r .venv
   rm -r node_modules
   rm .env
   ```

2. **Sigue las instrucciones de INSTALL.md** como si fueras un usuario nuevo

3. **Verifica que todo funciona**:
   - Backend corre sin errores
   - Frontend se conecta al backend
   - Las migraciones se aplican correctamente

Si algo falla, actualiza la documentación antes de compartir.

---

## 📊 Estructura que Recibirá la Otra Persona

```
Control EMS/
├── backend/
│   ├── api/
│   ├── backend_project/
│   ├── .env.example          ← Debe copiar a .env
│   ├── requirements.txt      ← pip install -r requirements.txt
│   ├── setup.bat            ← Ejecutar para setup automático
│   └── README.md
├── src/
│   ├── components/
│   └── ...
├── .gitignore               ← Protege archivos sensibles
├── INSTALL.md              ← Guía detallada paso a paso
├── README.md               ← Documentación principal
├── package.json            ← npm install
├── start.bat              ← Inicio rápido
└── vite.config.ts

NO DEBE INCLUIR:
├── .venv/                 ← Se crea localmente
├── node_modules/          ← Se instala con npm
├── .env                   ← Cada uno crea el suyo
└── db.sqlite3            ← Ya no se usa
```

---

## 🎯 Resumen Rápido

Para que alguien use tu proyecto necesita:

1. **Instalar** requisitos (Python, Node.js, PostgreSQL)
2. **Crear** la base de datos `control_ems_db`
3. **Configurar** el archivo `.env` con sus credenciales
4. **Ejecutar** `backend/setup.bat`
5. **Instalar** dependencias del frontend: `npm install`
6. **Iniciar** con `start.bat` o manualmente

Todo esto está explicado en `INSTALL.md` 📚

---

✅ **El proyecto está listo para compartir si:**
- Todos los archivos marcados con ✅ están incluidos
- Los archivos en ❌ NO están incluidos
- La documentación está actualizada
- Has probado la instalación desde cero
