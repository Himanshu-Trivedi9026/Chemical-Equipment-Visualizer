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

export default function EquipmentTypeChart({ data }) {
  const chartRef = useRef(null);

  if (!data || Object.keys(data).length === 0) return null;

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Equipment Count",
        data: Object.values(data),
        backgroundColor: "#60a5fa",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 900,
      easing: "easeOutBack",
      delay: (ctx) => ctx.dataIndex * 120,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
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
    link.download = "equipment_type_distribution.png";
    link.click();
  };

  return (
    <div>
      <h3>Equipment Type Distribution</h3>

      <button className="export-btn" onClick={exportPNG}>
        Export PNG
      </button>

      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
