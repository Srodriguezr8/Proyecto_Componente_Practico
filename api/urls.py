from django.urls import path
from .views import SparkCheckAIView, HealthView, UploadView

urlpatterns = [
    path('health/', HealthView.as_view(), name='health'),
    path('upload/', UploadView.as_view(), name='upload'),
    # ESTA ES LA RUTA CRÍTICA:
    path('spark-check-ai/', SparkCheckAIView.as_view(), name='spark_check_ai'),
]