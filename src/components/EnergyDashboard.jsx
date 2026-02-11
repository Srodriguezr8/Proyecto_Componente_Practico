import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const EnergyDashboard = () => {
  const [dataIA, setDataIA] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      // 1. Fetch al endpoint del backend (UploadView)
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      // 2. Guardar prediccion_24h y recomendaciones en el estado
      setDataIA(result);
    } catch (error) {
      console.error("Error al conectar con la IA:", error);
    }
    setLoading(false);
  };

  // Configuración del gráfico (RF-03 y RF-05)
  const chartData = dataIA ? {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Predicción de Consumo (kWh)',
      data: dataIA.prediccion_24h,
      borderColor: 'rgba(54, 162, 235, 1)',
      // Lógica RF-05: Puntos rojos si superan el 30% del promedio
      pointBackgroundColor: dataIA.prediccion_24h.map(v => {
        const avg = dataIA.prediccion_24h.reduce((a,b) => a+b) / 24;
        return v > avg * 1.3 ? 'red' : 'blue';
      }),
      pointRadius: 5,
    }]
  } : null;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cargar Consumo Eléctrico</h2>
      <input type="file" onChange={handleFileUpload} accept=".csv, .xlsx" />
      
      {loading && <p>Entrenando modelo de IA...</p>}

      {dataIA && (
        <div style={{ marginTop: '30px' }}>
          <h3>Resultados de Predicción IA (Próximas 24h)</h3>
          <div style={{ height: '400px' }}>
            {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />}
          </div>

          <div style={{ backgroundColor: '#f0f8ff', padding: '15px', marginTop: '20px' }}>
            <h4>Recomendaciones Personalizadas (RF-06):</h4>
            <ul>
              {dataIA.recomendaciones.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyDashboard;