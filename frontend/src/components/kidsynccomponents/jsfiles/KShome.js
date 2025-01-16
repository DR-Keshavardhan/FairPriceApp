import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
  
  // Register the necessary components
  ChartJS.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend);  
// Register the necessary chart components

const KShome = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("Thiruvallur");  // You can set this dynamically

  useEffect(() => {
    const fetchTableData = async () => {
      if (!selectedDistrict) return; // Avoid API call if no district is selected

      try {
        const response = await axios.post("http://localhost:5000/KSapi/fetchdata", { selectedDistrict });
        setTableData(response.data);  // Store fetched data in state
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    fetchTableData();
  }, [selectedDistrict]);

  // Prepare data for the chart
  const genderCounts = tableData.reduce((acc, item) => {
    acc[item.Gender] = (acc[item.Gender] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(genderCounts),
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Gender Distribution in {selectedDistrict}</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default KShome;
