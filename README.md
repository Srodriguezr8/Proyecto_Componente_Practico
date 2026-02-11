
  # Proyecto medidores eléctricos

  This is a code bundle for Proyecto medidores eléctricos. The original project is available at https://www.figma.com/design/QHrzHXNJL8nDhE4bMpykYk/Proyecto-medidores-el%C3%A9ctricos.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

## Instalación completa (Backend + Frontend) - Guía rápida para otro dispositivo

Requisitos
- Node.js (>=18) y npm
- Python 3.10+
- **PostgreSQL 12+** (local: https://www.postgresql.org/download/) 
  **O Supabase** (nube gratis: https://supabase.com) ⭐ Recomendado
- git (opcional)

Pasos (Windows - PowerShell)

1. Clonar o copiar el repositorio:

```powershell
git clone <repo-url> proyecto-medidores
cd proyecto-medidores
```

2. **Configurar PostgreSQL**:

**Opción A: Local**
```powershell
# Instalar PostgreSQL primero si no lo tienes
# Luego crear la base de datos:
psql -U postgres
```

Dentro de PostgreSQL:
```sql
CREATE DATABASE control_ems_db;
\q
```

**Opción B: Supabase (Gratis en la nube)** 🌟
- Ve a https://supabase.com y crea una cuenta
- Crea un nuevo proyecto
- Copia las credenciales al archivo .env
- 📖 **Guía completa:** [DEPLOY_SUPABASE.md](DEPLOY_SUPABASE.md)

3. Backend (Django)

```powershell
cd backend

# Copiar y configurar variables de entorno
copy .env.example .env
# Edita .env y pon tu contraseña de PostgreSQL

# Crear entorno virtual e instalar dependencias
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# Ejecutar migraciones y crear superusuario
python manage.py migrate
python manage.py createsuperuser    # opcional

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

Verifique el health:

```powershell
curl http://127.0.0.1:8000/api/health/
```

Para subir un CSV y obtener métricas:

```powershell
curl -X POST -F "file=@C:\ruta\a\datos.csv" http://127.0.0.1:8000/api/upload/
```

3. Frontend (React + Vite)

Desde la raíz del proyecto:

```powershell
npm install
npm run dev      # desarrollo (servidor Vite)
npm run build    # para generar la versión de producción
```

Notas de despliegue
- En producción, ponga `DEBUG=False` y configure `SECRET_KEY` y `ALLOWED_HOSTS` en `backend/backend_project/settings.py` o mediante variables de entorno.
- Para soportar subida de XLSX o PDF procesado en backend, instale bibliotecas adicionales (por ejemplo `openpyxl` o `pandas`) y extienda `api.views.UploadView`.

---

## 🔐 Recuperación de contraseña (modo demo)

Para mantener la implementación simple, la recuperación de contraseña en esta versión es una **simulación en frontend** (sin endpoints backend específicos).

- La pantalla solicita **solo el número de teléfono** y elige entre **SMS** o **WhatsApp**.
- Para pruebas se muestra un **código de prueba** visible en la interfaz: **123456**. Use este código para verificar y completar el flujo de recuperación.
- Validación: en modo demo se acepta cualquier número válido (solo dígitos y opcionalmente un '+' al inicio). El código de prueba es **123456**. 
- Esta versión elimina la lógica adicional de envío/verificación en el backend para simplificar pruebas locales. Si quieres que vuelva a añadirse integración real con Twilio u otro proveedor, dime y preparo el ejemplo para producción.

---

---

## 🧩 Stack tecnológico principal

- Backend: **Django** + **Django REST Framework** (Python).  
- Frontend: **React** (TSX) + **Vite**.  
- Estilos/UI: Tailwind-like utility classes, componentes Radix/Lucide (ver `package.json`).  
- Otras libs destacadas: `lucide-react`, `recharts`, `html2canvas`, `jspdf`, `sonner`, `@radix-ui/*`.

---

## ✅ Resumen de comandos útiles
- Levantar backend: (desde `backend`)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

- Levantar frontend (raíz):

```bash
npm install
npm run dev
```

---
