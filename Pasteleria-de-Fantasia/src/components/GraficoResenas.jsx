import React, { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

import { obtTestimonios } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GraficoResenas() {
  const [datosGrafico, setDatosGrafico] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    cargarGrafico();
  }, []);

  const cargarGrafico = async () => {
    try {
      const testimonios = await obtTestimonios();

      const conteo = [1, 2, 3, 4, 5].map((estrella) => {
        return testimonios.filter(
          (t) => Number(t.rating) === estrella
        ).length;
      });

      setDatosGrafico({
        labels: [
          '1 estrella',
          '2 estrellas',
          '3 estrellas',
          '4 estrellas',
          '5 estrellas'
        ],
        datasets: [
          {
            label: 'Cantidad de reseñas',
            data: conteo,
            backgroundColor: [
              '#8B4513',
              '#A0522D',
              '#CD853F',
              '#D2691E',
              '#DEB887'
            ],
            borderWidth: 1
          }
        ]
      });

    } catch (error) {
      console.error(error);
    }
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Estadística de reseñas por calificación'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  return (
    <section id="estadisticas" className="container py-5">
      <h2 className="mb-4 text-brown-dark text-center">
        Estadísticas de Reseñas
      </h2>

      <div className="card p-4 shadow-sm">
        <Bar
          data={datosGrafico}
          options={opciones}
        />
      </div>
    </section>
  );
}