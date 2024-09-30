import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const AssessmentSummary = () => {
  const data = [
    { name: 'MCQs', value: 40 },
    { name: 'Practical Exams', value: 30 },
    { name: 'Descriptive Exams', value: 20 },
    { name: 'Viva Voce', value: 10 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PieChart width={400} height={400}>
      <Pie data={data} dataKey="value" nameKey="name" outerRadius={150} fill="#8884d8" label>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default AssessmentSummary;
