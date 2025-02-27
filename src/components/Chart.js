import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Chart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  afterDatasetsDraw: (chart) => {
    const { ctx, chartArea, config } = chart;
    const dataset = config.data.datasets[0];

    const totalVehicles = dataset.data.reduce((acc, value) => acc + value, 0);
    const xCenter = (chartArea.left + chartArea.right) / 2;
    const yCenter = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Total: ${totalVehicles}`, xCenter, yCenter);
    ctx.restore();
  },
};

const DonutChart = ({ data }) => {
  const totalVehicles = data.reduce((acc, item) => acc + item.value, 0);

  const chartLabels = data?.map((item) => {
    const percentage = totalVehicles
      ? ((item.value / totalVehicles) * 100).toFixed(1)
      : 0;
    return `${item.name} - ${item.value} (${percentage}%)`;
  });

  const categoryColors = {
    Running: "#36A2EB",
    Stop: "#FF6384",
    Idle: "#FF9F40",
    Offline: "#4BC0C0",
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: data?.map((item) => item.value),
        backgroundColor: data?.map(
          (item) => categoryColors[item.name] || "#000"
        ),
        hoverBackgroundColor: data?.map((item) => {
          const hoverColors = {
            Running: "#1E7BB7",
            Stop: "#D43F62",
            Idle: "#D87738",
            Offline: "#3B9D95",
          };
          return hoverColors[item.name] || "#000";
        }),
        borderWidth: 2,
        hoverRadius: 15,
        radius: "85%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 20,
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataIndex = tooltipItem.dataIndex;
            const value = tooltipItem.raw;
            const label = chartLabels[dataIndex];
            return `${label}`;
          },
        },
      },
    },
  };

  return (
    <div
      className="chart-container"
      style={{ maxWidth: "100%", height: "250px", margin: 0 }}
    >
      <h3>Vehicle Status</h3>
      <Doughnut
        data={chartData}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
};

export default DonutChart;
