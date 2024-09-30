import React from 'react';
import { FaChartLine, FaUsers, FaFileCsv, FaFilePdf } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ResultsAndAnalytics = () => {
  // Sample data for charts
  const individualPerformanceData = [
    { name: 'Jan', score: 70 },
    { name: 'Feb', score: 75 },
    { name: 'Mar', score: 80 },
    { name: 'Apr', score: 85 },
    { name: 'May', score: 90 },
    { name: 'Jun', score: 95 },
  ];

  const groupAnalysisData = [
    { region: 'North', averageScore: 80 },
    { region: 'South', averageScore: 85 },
    { region: 'East', averageScore: 78 },
    { region: 'West', averageScore: 82 },
  ];

  return (
    <div className="pt-20 w-full"> {/* Adjust padding top as needed */}
      <section className="w-full box-border bg-gray-100 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-center">Results and Analytics</h1>

          {/* Candidate Report Section */}
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-2xl" /> Candidate Report
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <LineChart width={600} height={300} data={individualPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#fff" strokeWidth={2} />
                  </LineChart>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">Adaptive Feedback</h3>
                  <p>Improve your skills based on detailed analysis of your strengths and weaknesses. Personalized feedback will help you focus on areas needing improvement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Group Analysis Section */}
          <div className="bg-green-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaUsers className="mr-2 text-2xl" /> Group Analysis
            </h2>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Average Scores by Region</h3>
                    <LineChart width={600} height={300} data={groupAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="averageScore" stroke="#fff" strokeWidth={2} />
                    </LineChart>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">Comparative Analysis</h3>
                  <p>Generate detailed reports comparing results across different regions or institutions. Visualize trends and identify key areas for improvement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Downloadable Results Section */}
          <div className="bg-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaFileCsv className="mr-2 text-2xl" /> Downloadable Results
            </h2>
            <p className="mb-4">Export your results in various formats for detailed offline analysis. Choose between CSV or PDF formats.</p>
            <div className="flex space-x-4">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-full shadow-lg hover:bg-purple-300 transition duration-300 flex items-center">
                <FaFileCsv className="mr-2" /> Export as CSV
              </button>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-full shadow-lg hover:bg-purple-300 transition duration-300 flex items-center">
                <FaFilePdf className="mr-2" /> Export as PDF
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultsAndAnalytics;
