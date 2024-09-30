import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PerformanceChart = () => {
  const data = [
    { name: 'Jan', score: 70 },
    { name: 'Feb', score: 80 },
    { name: 'Mar', score: 90 },
    { name: 'Apr', score: 85 },
  ];

  return (
    <LineChart width={500} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default PerformanceChart;
