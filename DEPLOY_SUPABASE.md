# ☁️ Guía de Deployment con Supabase (GRATIS)

Esta guía te ayudará a configurar una base de datos PostgreSQL gratuita en Supabase y desplegar tu proyecto en la nube.

---

## 📊 ¿Qué es Supabase?

Supabase es una alternativa open-source a Firebase que ofrece:
- ✅ **PostgreSQL gratis** hasta 500MB
- ✅ Backups automáticos
- ✅ Interface web para gestionar la BD
- ✅ APIs automáticas
- ✅ No requiere tarjeta de crédito para el plan gratuito

**Plan Gratuito incluye:**
- 500 MB de almacenamiento de base de datos
- 1 GB de transferencia de datos/mes
- 2 proyectos activos
- Pausa automática después de 1 semana de inactividad (se reactiva automáticamente)

---

## 🚀 Paso 1: Crear cuenta en Supabase

1. **Ve a** [https://supabase.com](https://supabase.com)
2. Click en **"Start your project"**
3. Inicia sesión con:
   - GitHub (recomendado)
   - Google
   - O email

---

## 📦 Paso 2: Crear Proyecto en Supabase

1. **Desde el Dashboard**, click en **"New Project"**

2. **Configura tu proyecto**:
   ```
   Name: control-ems
   Database Password: [Genera una contraseña segura]
   Region: South America (sao1) [más cercano]
   Pricing Plan: Free
   ```
   
   ⚠️ **IMPORTANTE**: Guarda la contraseña, la necesitarás después!

3. Click en **"Create new project"**
   - Espera 2-3 minutos mientras Supabase crea tu base de datos

---

## 🔑 Paso 3: Obtener Credenciales de Conexión

Una vez creado el proyecto:

1. **En el menú lateral**, click en ⚙️ **Settings**

2. **Click en "Database"**

3. **Busca la sección "Connection String"**
   - Selecciona el modo **"URI"**
   - Verás algo como:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

4. **Analiza cada parte**:
   ```
   postgresql://postgres:tu-password@db.abcdefgh.supabase.co:5432/postgres
                 ↑         ↑           ↑                        ↑       ↑
             DB_USER  DB_PASSWORD   DB_HOST                  DB_PORT DB_NAME
   ```

5. **Copia estos valores**:
   ```
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=tu-contraseña-del-paso-2
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   ```

---

## ⚙️ Paso 4: Configurar el Proyecto

### Opción A: Editar .env manualmente

1. **Abre** `backend/.env`

2. **Reemplaza** las credenciales locales con las de Supabase:
   ```env
   # Base de datos PostgreSQL - Supabase
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=tu-contraseña-de-supabase
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   ```

3. **Guarda** el archivo

### Opción B: Usar el Connection String directamente

También puedes configurar con DATABASE_URL:

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

Pero necesitarías modificar settings.py para parsear DATABASE_URL.

---

## 🔄 Paso 5: Ejecutar Migraciones

1. **Abre una terminal** en la carpeta del proyecto

2. **Activa el entorno virtual**:
   ```powershell
   cd backend
   .venv\Scripts\Activate.ps1
   ```

3. **Ejecuta las migraciones** (esto creará las tablas en Supabase):
   ```powershell
   python manage.py migrate
   ```

   Deberías ver:
   ```
   Running migrations:
     Applying contenttypes.0001_initial... OK
     Applying auth.0001_initial... OK
     ...
   ```

4. **Crea un superusuario** (opcional):
   ```powershell
   python manage.py createsuperuser
   ```

---

## ✅ Paso 6: Verificar en Supabase

1. **Vuelve al Dashboard de Supabase**

2. **Click en "Table Editor"** (icono de tabla en el menú lateral)

3. **Verás las tablas de Django creadas**:
   - auth_user
   - django_migrations
   - django_session
   - api_* (tus modelos personalizados)

4. **Puedes ver los datos directamente** en la interfaz web de Supabase

---

## 🌐 Paso 7: Desplegar el Backend (Opcional)

Si quieres que tu backend esté en internet, tienes varias opciones gratuitas:

### Opción A: Railway.app

1. Ve a [railway.app](https://railway.app)
2. Conecta tu repositorio GitHub
3. Railway detectará Django automáticamente
4. Agrega las variables de entorno (DB_HOST, DB_PASSWORD, etc.)
5. Railway te dará una URL: `https://tu-proyecto.up.railway.app`

### Opción B: Render.com

1. Ve a [render.com](https://render.com)
2. New > Web Service
3. Conecta tu GitHub
4. Render detectará Python
5. Configura:
   ```
   Build Command: pip install -r backend/requirements.txt
   Start Command: cd backend && gunicorn backend_project.wsgi:application
   ```
6. Agrega variables de entorno en "Environment"

### Opción C: Vercel (con adaptador)

Necesitarías agregar un adaptador, pero es más complejo.

---

## 🎨 Paso 8: Desplegar el Frontend

### Opción A: Vercel (Recomendado para React + Vite)

1. **Ve a** [vercel.com](https://vercel.com)
2. **Click en "Add New Project"**
3. **Importa tu repositorio** de GitHub
4. **Configura**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   ```
5. **Agrega variable de entorno**:
   ```
   VITE_API_URL=https://tu-backend.railway.app
   ```
6. **Deploy!**

### Opción B: Netlify

Similar a Vercel, detecta Vite automáticamente.

---

## 🔒 Seguridad en Producción

Antes de desplegar, actualiza `settings.py`:

```python
# En producción
DEBUG = False
ALLOWED_HOSTS = [
    'tu-backend.railway.app',
    'tu-frontend.vercel.app',
]

# CORS
CORS_ALLOWED_ORIGINS = [
    'https://tu-frontend.vercel.app',
]
```
Cambiar entre Local y Nube
cambiar las credenciales en .env:
Local:
DB_HOST=localhost
DB_PASSWORD=tu_password_local
Supabase:
DB_HOST=db.xxxxx.supabase.co
DB_PASSWORD=tu_password_supabase

---

## 💰 Costos y Límites

### Supabase (Base de Datos) - GRATIS
- ✅ 500 MB de base de datos
- ✅ 1 GB de transferencia/mes
- ✅ 2 proyectos activos
- ⚠️ Se pausa después de 1 semana sin uso (se reactiva automáticamente)

### Railway (Backend) - GRATIS con límites
- ✅ $5 de crédito gratis/mes
- ✅ Suficiente para proyectos pequeños/medianos
- 💳 Después requiere tarjeta (solo cobra si superas el crédito)

### Vercel (Frontend) - GRATIS
- ✅ 100 GB de ancho de banda/mes
- ✅ Despliegues ilimitados
- ✅ Sin tarjeta de crédito requerida

**Total: 100% GRATIS** para empezar 🎉

---

## 📊 Monitoreo y Gestión

### Ver logs en Supabase
1. Dashboard → Logs
2. Puedes ver queries, errores, conexiones

### Ejecutar queries SQL
1. Dashboard → SQL Editor
2. Escribe y ejecuta queries directamente
3. Útil para análisis de datos

### Backups
- Plan gratuito: Backups diarios automáticos (7 días de retención)
- Puedes descargar backups manualmente

---

## 🐛 Solución de Problemas

### Error: "connection refused"
- ✅ Verifica que el DB_HOST sea correcto
- ✅ Revisa que copiaste la contraseña correctamente
- ✅ Asegúrate de que el proyecto esté activo (no pausado)

### Error: "password authentication failed"
- ✅ La contraseña en .env debe coincidir con la de Supabase
- ✅ No debe tener espacios al inicio o final
- ✅ Revisa si tiene caracteres especiales que necesitan escaparse

### El proyecto se pausó
- ✅ Es normal después de 1 semana sin uso
- ✅ Se reactiva automáticamente al intentar conectar
- ✅ Puede tardar 1-2 minutos en despertar

### Límite de 500MB alcanzado
- ✅ Revisa qué tablas ocupan más espacio
- ✅ Limpia datos antiguos o innecesarios
- ✅ O actualiza al plan Pro ($25/mes con 8GB)

---

## 🔄 Migrar de Local a Supabase

Si ya tienes datos locales y quieres migrarlos:

### Opción A: Dump y Restore

```powershell
# 1. Exportar datos locales
pg_dump -U postgres control_ems_db > backup.sql

# 2. Importar a Supabase
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup.sql
```

### Opción B: Django dumpdata/loaddata

```powershell
# 1. Exportar con Django (base de datos local)
python manage.py dumpdata > data.json

# 2. Cambiar a credenciales de Supabase en .env

# 3. Importar con Django (a Supabase)
python manage.py loaddata data.json
```

---

## 📱 Acceso desde Otros Dispositivos

Una vez configurado Supabase:

**✅ Ventajas:**
- Tu equipo puede conectarse a la misma base de datos
- No necesita PostgreSQL local
- Todos ven los mismos datos en tiempo real
- Solo cambian el .env por las credenciales de Supabase

**Configuración en otro PC:**
1. Clona el proyecto
2. Copia las credenciales de Supabase al .env
3. NO necesita instalar PostgreSQL local
4. Ejecuta migraciones (si no se han ejecutado)
5. ¡Listo! Conectado a la nube

---

## 🎯 Resumen Rápido

```mermaid
graph LR
    A[1. Crear cuenta Supabase] --> B[2. Nuevo proyecto]
    B --> C[3. Copiar credenciales]
    C --> D[4. Actualizar .env]
    D --> E[5. Ejecutar migrate]
    E --> F[✅ Listo!]
```

**Pasos mínimos:**
1. Registrarse en Supabase ➜ 2 min
2. Crear proyecto ➜ 3 min
3. Copiar credenciales a .env ➜ 1 min
4. python manage.py migrate ➜ 30 seg

**Total: ~7 minutos** para tener tu BD en la nube 🚀

---

## 📚 Recursos Útiles

- [Supabase Dashboard](https://app.supabase.com)
- [Documentación Supabase](https://supabase.com/docs)
- [Guía de PostgreSQL](https://www.postgresql.org/docs/)
- [Django + PostgreSQL](https://docs.djangoproject.com/en/4.2/ref/databases/#postgresql-notes)

---

## ❓ Preguntas Frecuentes

**¿Necesito tarjeta de crédito?**
No, el plan gratuito de Supabase no requiere tarjeta.

**¿Puedo cambiar de local a Supabase cuando quiera?**
Sí, solo cambia las credenciales en .env.

**¿Pierdo mis datos si se pausa el proyecto?**
No, los datos se mantienen. Solo se pausa la conexión.

**¿Cuánto tarda en "despertar" un proyecto pausado?**
Entre 30 segundos y 2 minutos aproximadamente.

**¿Puedo tener desarrollo local y producción en Supabase?**
Sí, crea dos archivos: `.env.local` y `.env.production` y cámbialos según necesites.

**¿Supabase es seguro?**
Sí, usa cifrado en tránsito (SSL/TLS) y en reposo. Los datos están protegidos.

---

✅ **¡Listo!** Ahora tienes tu base de datos PostgreSQL en la nube, gratis y accesible desde cualquier lugar.
