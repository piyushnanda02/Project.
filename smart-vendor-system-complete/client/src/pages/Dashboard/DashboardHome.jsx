import React from "react";

function DashboardHome() {

  return (
    <div>
      <h1>Market Dashboard</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #333" }}>
            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Metric</th>
            <th style={{ padding: "10px", textAlign: "left", border: "1px solid #ddd" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Total Profit</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>₹24,000</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Total Loss</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>₹6,500</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Expenses</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>₹12,000</td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>Inflation Loss</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>₹3,200</td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}

export default DashboardHome;