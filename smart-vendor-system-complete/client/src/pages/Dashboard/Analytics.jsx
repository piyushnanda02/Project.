import React from "react";

const Analytics = () => {
  return (
    <div>
      <h2>Business Analytics</h2>

      <div className="card-grid">

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹1,25,000</p>
        </div>

        <div className="card">
          <h3>Total Expense</h3>
          <p>₹72,000</p>
        </div>

        <div className="card">
          <h3>Net Profit</h3>
          <p>₹53,000</p>
        </div>

        <div className="card">
          <h3>Business Growth</h3>
          <p>+18%</p>
        </div>

      </div>
    </div>
  );
};

export default Analytics;