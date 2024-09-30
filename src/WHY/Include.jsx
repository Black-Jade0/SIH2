import React from 'react';
import AssessmentSummary from './AssessmentSummary';
import PerformanceChart from './PerformanceChart';

const Include = () => {
  return (
    <div className="dashboard-container w-full box-border">
      {/* <h1>Dashboard</h1> */}
      <section className="overview">
        <AssessmentSummary />
        <PerformanceChart />
      </section>
      {/* Other dashboard sections such as Recent Activities and Feedback Summary */}
    </div>
  );
};

export default Include;
