from django.db import models
from django.contrib.auth.models import User

class Device(models.Model):
    """Dispositivo/medidor eléctrico"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')
    name = models.CharField(max_length=100)
    device_id = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.device_id})"


class EnergyReading(models.Model):
    """Lecturas de consumo eléctrico"""
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='readings')
    timestamp = models.DateTimeField(db_index=True)
    consumo_kwh = models.FloatField()
    voltaje = models.FloatField(null=True, blank=True)
    corriente = models.FloatField(null=True, blank=True)
    potencia_kw = models.FloatField(null=True, blank=True)
    factor_potencia = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['device', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.device.name} - {self.timestamp} - {self.consumo_kwh} kWh"


class UploadedFile(models.Model):
    """Archivos CSV/Excel subidos"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True)
    filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/%Y/%m/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    records_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.filename} - {self.uploaded_at}"


class Prediction(models.Model):
    """Predicciones de consumo"""
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='predictions')
    prediction_date = models.DateTimeField()
    predicted_consumption = models.FloatField()
    confidence = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-prediction_date']
        indexes = [
            models.Index(fields=['device', 'prediction_date']),
        ]
    
    def __str__(self):
        return f"Predicción {self.device.name} - {self.prediction_date}"


class Alert(models.Model):
    """Alertas de consumo anormal"""
    ALERT_TYPES = [
        ('high_consumption', 'Consumo Alto'),
        ('peak_hour', 'Hora Pico'),
        ('anomaly', 'Anomalía'),
        ('threshold', 'Umbral Superado'),
    ]
    
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    message = models.TextField()
    value = models.FloatField()
    threshold = models.FloatField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.alert_type} - {self.device.name} - {self.created_at}"
