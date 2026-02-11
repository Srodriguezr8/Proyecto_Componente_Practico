import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class ElectricPredictor:
    """
    Clase para la predicción de consumo eléctrico. 
    Cumple con RF-02 (Entrenamiento) y RF-03 (Predicción).
    """
    def __init__(self):
        # Ruta para guardar el modelo entrenado dentro de la misma app
        self.model_path = os.path.join(os.path.dirname(__file__), 'modelo_ia.pkl')
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)

    def preparar_datos(self, df):
        # Validación de columnas (RF-01)
        df.columns = [c.lower().strip() for c in df.columns]
        if 'timestamp' not in df.columns or 'consumo kwh' not in df.columns:
            raise ValueError("Faltan columnas: 'timestamp' o 'consumo kwh'")
        
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hora'] = df['timestamp'].dt.hour
        df['dia_semana'] = df['timestamp'].dt.dayofweek
        return df[['hora', 'dia_semana']], df['consumo kwh']

    def entrenar(self, df):
        X, y = self.preparar_datos(df)
        self.model.fit(X, y)
        joblib.dump(self.model, self.model_path)

    def predecir_24h(self):
        # Genera datos para las próximas 24 horas del día actual
        proximas = pd.DataFrame({
            'hora': list(range(24)),
            'dia_semana': [pd.Timestamp.now().dayofweek] * 24
        })
        return self.model.predict(proximas).tolist()

    def obtener_consejos(self, df):
        # Lógica para RF-06 (Recomendaciones)
        promedio = df['consumo kwh'].mean()
        max_hora = df.groupby(df['timestamp'].dt.hour)['consumo kwh'].mean().idxmax()
        return [
            f"Tu pico de consumo es a las {max_hora}:00. Evita usar la secadora a esa hora.",
            f"Tu consumo promedio es {round(promedio, 2)} kWh. ¡Buen trabajo!",
            "Recomendación: Desconecta dispositivos en 'Stand-by' durante la noche."
        ]