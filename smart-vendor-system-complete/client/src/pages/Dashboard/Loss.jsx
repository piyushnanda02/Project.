import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Expense = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly");
  const [totalExpense, setTotalExpense] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);

  const COLORS = ['#e74c3c', '#f39c12', '#3498db', '#2c3e50', '#27ae60', '#9b59b6'];

  // Wrap loadChartData with useCallback to prevent recreation on each render
  const loadChartData = useCallback(() => {
    setLoading(true);
    
    // Simulate API data - In real app, fetch from backend
    setTimeout(() => {
      if (selectedTimeframe === "weekly") {
        setExpenseData([
          { day: "Mon", amount: 2500, category: "Food" },
          { day: "Tue", amount: 1800, category: "Transport" },
          { day: "Wed", amount: 3200, category: "Shopping" },
          { day: "Thu", amount: 1500, category: "Bills" },
          { day: "Fri", amount: 2800, category: "Entertainment" },
          { day: "Sat", amount: 4200, category: "Dining" },
          { day: "Sun", amount: 3000, category: "Groceries" },
        ]);
        
        setCategoryData([
          { name: "Food", value: 8500 },
          { name: "Transport", value: 3200 },
          { name: "Bills", value: 4500 },
          { name: "Shopping", value: 5800 },
          { name: "Entertainment", value: 2800 },
          { name: "Other", value: 1900 },
        ]);
        
        setTrendData([
          { day: "Mon", expense: 2500 },
          { day: "Tue", expense: 1800 },
          { day: "Wed", expense: 3200 },
          { day: "Thu", expense: 1500 },
          { day: "Fri", expense: 2800 },
          { day: "Sat", expense: 4200 },
          { day: "Sun", expense: 3000 },
        ]);
        
        setTotalExpense(19000);
        setAverageExpense(2714);
      } else if (selectedTimeframe === "monthly") {
        setExpenseData([
          { day: "Week 1", amount: 12500, category: "All" },
          { day: "Week 2", amount: 14800, category: "All" },
          { day: "Week 3", amount: 16200, category: "All" },
          { day: "Week 4", amount: 18500, category: "All" },
        ]);
        
        setCategoryData([
          { name: "Food", value: 28500 },
          { name: "Transport", value: 12200 },
          { name: "Bills", value: 18500 },
          { name: "Shopping", value: 22500 },
          { name: "Entertainment", value: 10800 },
          { name: "Other", value: 9500 },
        ]);
        
        setTrendData([
          { day: "Week 1", expense: 12500 },
          { day: "Week 2", expense: 14800 },
          { day: "Week 3", expense: 16200 },
          { day: "Week 4", expense: 18500 },
        ]);
        
        setTotalExpense(62000);
        setAverageExpense(15500);
      }
      setLoading(false);
    }, 500);
  }, [selectedTimeframe]);

  // Now useEffect with proper dependency
  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading expense data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Expense Tracker</h1>
      <p style={styles.subtitle}>Track and analyze your expenses</p>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Expenses</div>
          <div style={styles.summaryValue}>{formatCurrency(totalExpense)}</div>
          <div style={styles.summaryChange}>This {selectedTimeframe}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Average Daily</div>
          <div style={styles.summaryValue}>{formatCurrency(averageExpense)}</div>
          <div style={styles.summaryChange}>Per day</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Highest Category</div>
          <div style={styles.summaryValue}>
            {categoryData.reduce((max, item) => item.value > max.value ? item : max, categoryData[0])?.name || "N/A"}
          </div>
          <div style={styles.summaryChange}>Most spent on</div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div style={styles.timeframeContainer}>
        <button 
          onClick={() => setSelectedTimeframe("weekly")} 
          style={selectedTimeframe === "weekly" ? styles.activeTimeframeBtn : styles.timeframeBtn}
        >
          Weekly
        </button>
        <button 
          onClick={() => setSelectedTimeframe("monthly")} 
          style={selectedTimeframe === "monthly" ? styles.activeTimeframeBtn : styles.timeframeBtn}
        >
          Monthly
        </button>
      </div>

      {/* Expense Trend Line Chart */}
      <div style={styles.chartSection}>
        <h3 style={styles.chartTitle}>Expense Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="expense" stroke="#e74c3c" strokeWidth={2} name="Expense" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two Column Layout */}
      <div style={styles.twoColumnGrid}>
        {/* Category Distribution Pie Chart */}
        <div style={styles.chartSection}>
          <h3 style={styles.chartTitle}>Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Expense Bar Chart */}
        <div style={styles.chartSection}>
          <h3 style={styles.chartTitle}>Daily Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `₹${value/1000}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="amount" fill="#3498db">
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Table */}
      <div style={styles.tableContainer}>
        <h3 style={styles.chartTitle}>Recent Expenses</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {expenseData.map((item, index) => {
              const percentage = ((item.amount / totalExpense) * 100).toFixed(1);
              return (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.td}>{item.day}</td>
                  <td style={styles.td}>{formatCurrency(item.amount)}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>
                    <div style={styles.percentageBar}>
                      <div style={{...styles.percentageFill, width: `${percentage}%`}}></div>
                      <span style={styles.percentageText}>{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "32px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #2c3e50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  summaryCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #e9ecef",
  },
  summaryLabel: {
    fontSize: "13px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  summaryValue: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#e74c3c",
  },
  summaryChange: {
    fontSize: "12px",
    color: "#888",
    marginTop: "8px",
  },
  timeframeContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    justifyContent: "flex-end",
  },
  timeframeBtn: {
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#495057",
  },
  activeTimeframeBtn: {
    padding: "8px 16px",
    background: "#2c3e50",
    border: "1px solid #2c3e50",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#fff",
  },
  chartSection: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e9ecef",
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  tableContainer: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e9ecef",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    borderBottom: "2px solid #e9ecef",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#666",
  },
  td: {
    padding: "12px 16px",
    fontSize: "14px",
    color: "#333",
    borderBottom: "1px solid #e9ecef",
  },
  tableRow: {
    transition: "background 0.2s",
  },
  percentageBar: {
    position: "relative",
    width: "100%",
    height: "24px",
    background: "#e9ecef",
    borderRadius: "12px",
    overflow: "hidden",
  },
  percentageFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    background: "#e74c3c",
    borderRadius: "12px",
    transition: "width 0.3s",
  },
  percentageText: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    fontSize: "11px",
    fontWeight: "500",
    color: "#fff",
    zIndex: 1,
  },
};

// Add spinner animation to global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Expense;