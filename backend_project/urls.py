from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')), # Esto hace que todas las rutas de la app empiecen con /api/
]