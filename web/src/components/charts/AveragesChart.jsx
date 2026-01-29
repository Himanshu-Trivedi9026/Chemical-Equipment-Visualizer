import { Bar } from "react-chartjs-2";
import { useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AveragesChart({ summary }) {
  const chartRef = useRef(null);

  if (!summary) return null;

  const chartData = {
    labels: [
      "Flowrate (kg/s)",
      "Pressure (bar)",
      "Temperature (°C)",
    ],
    datasets: [
      {
        label: "Average Values",
        data: [
          summary.average_flowrate,
          summary.average_pressure,
          summary.average_temperature,
        ],
        backgroundColor: ["#fca5a5", "#67e8f9", "#fde68a"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 900,
      easing: "easeOutQuart",
      delay: (ctx) => ctx.dataIndex * 150, // stagger bars
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const exportPNG = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const url = chart.toBase64Image();
    const link = document.createElement("a");
    link.href = url;
    link.download = "average_equipment_parameters.png";
    link.click();
  };

  return (
    <div>
      <h3>Average Equipment Parameters</h3>

      <button className="export-btn" onClick={exportPNG}>
        Export PNG
      </button>

      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
