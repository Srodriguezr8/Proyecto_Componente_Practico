import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const PrediccionConsumo = () => {
  const [datosIA, setDatosIA] = useState(null);
  const [cargando, setCargando] = useState(false);

  const subirArchivo = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setCargando(true);
    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setDatosIA(data);
    } catch (error) {
      console.error("Error conectando con la IA:", error);
    }
    setCargando(false);
  };

  const configGrafico = datosIA ? {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Predicción Consumo (kWh)',
      data: datosIA.prediccion_24h,
      borderColor: '#3b82f6',
      // RF-05: Puntos rojos si el consumo supera el 30% del promedio
      pointBackgroundColor: datosIA.prediccion_24h.map(v => {
        const promedio = datosIA.prediccion_24h.reduce((a, b) => a + b) / 24;
        return v > promedio * 1.3 ? 'red' : '#3b82f6';
      }),
      pointRadius: 5,
    }]
  } : null;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Módulo de Predicción Inteligente</h3>
      <input type="file" onChange={subirArchivo} accept=".csv, .xlsx" />
      
      {cargando && <p>Entrenando modelo de IA...</p>}

      {datosIA && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ height: '300px' }}>
            <Line data={configGrafico} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          
          <div style={{ background: '#f3f4f6', padding: '15px', marginTop: '20px' }}>
            <h4>Recomendaciones (RF-06):</h4>
            <ul>
              {datosIA.recomendaciones.map((txt, i) => <li key={i}>{txt}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrediccionConsumo;