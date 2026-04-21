import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Profit = () => {
  const [profits, setProfits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "sales",
    date: new Date().toISOString().split('T')[0]
  });

  const token = localStorage.getItem("token");

  // Wrap fetch functions with useCallback to prevent infinite loops
  const fetchProfits = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profits", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfits(response.data.data);
    } catch (error) {
      console.error("Error fetching profits:", error);
    }
  }, [token]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profits/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [token]);

  // Now useEffect with proper dependencies
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfits(), fetchSummary()]);
      setLoading(false);
    };
    loadData();
  }, [fetchProfits, fetchSummary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/profits", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ 
        amount: "", 
        description: "", 
        category: "sales", 
        date: new Date().toISOString().split('T')[0] 
      });
      await Promise.all([fetchProfits(), fetchSummary()]);
    } catch (error) {
      console.error("Error adding profit:", error);
      alert("Failed to add profit");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profit entry?")) {
      try {
        await axios.delete(`http://localhost:5000/api/profits/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await Promise.all([fetchProfits(), fetchSummary()]);
      } catch (error) {
        console.error("Error deleting profit:", error);
        alert("Failed to delete profit");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profit data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Profit Tracker</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? "✕ Cancel" : "+ Add Profit"}
        </button>
      </div>

      {/* Add Profit Form */}
      {showForm && (
        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>Add Daily Profit</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter profit amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={styles.input}
              >
                <option value="sales">Sales</option>
                <option value="investment">Investment</option>
                <option value="service">Service</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={styles.textarea}
                rows="3"
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Save Profit
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Profit</div>
            <div style={styles.summaryValue}>{formatCurrency(summary.totalProfit)}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Daily Average</div>
            <div style={styles.summaryValue}>{formatCurrency(summary.dailyAverage)}</div>
          </div>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Total Entries</div>
            <div style={styles.summaryValue}>{summary.totalEntries}</div>
          </div>
          {summary.bestDay && (
            <div style={styles.summaryCard}>
              <div style={styles.summaryLabel}>Best Day</div>
              <div style={styles.summaryValue}>{formatCurrency(summary.bestDay.amount)}</div>
              <div style={styles.summaryDate}>{formatDate(summary.bestDay.date)}</div>
            </div>
          )}
        </div>
      )}

      {/* Inflation Calculator Section */}
      {summary && summary.inflation && (
        <div style={styles.inflationSection}>
          <h2 style={styles.sectionTitle}>Inflation Calculator</h2>
          <div style={styles.inflationGrid}>
            <div style={styles.inflationCard}>
              <div style={styles.inflationLabel}>Current Inflation Rate</div>
              <div style={styles.inflationValue}>{summary.inflation.currentRate}%</div>
              <div style={styles.inflationNote}>Annual</div>
            </div>
            <div style={styles.inflationCard}>
              <div style={styles.inflationLabel}>Current Value</div>
              <div style={styles.inflationValue}>{formatCurrency(summary.totalProfit)}</div>
            </div>
            <div style={styles.inflationCard}>
              <div style={styles.inflationLabel}>Inflation Adjusted Value</div>
              <div style={styles.inflationValue}>{formatCurrency(summary.inflation.inflationAdjustedValue)}</div>
              <div style={styles.inflationLoss}>
                Loss: {formatCurrency(summary.inflation.purchasingPowerLoss)}
              </div>
            </div>
            <div style={styles.inflationCard}>
              <div style={styles.inflationLabel}>Projected Next Month</div>
              <div style={styles.inflationValue}>{formatCurrency(summary.inflation.projectedNextMonth)}</div>
              <div style={styles.inflationNote}>With inflation</div>
            </div>
            <div style={styles.inflationCard}>
              <div style={styles.inflationLabel}>Projected Next Year</div>
              <div style={styles.inflationValue}>{formatCurrency(summary.inflation.projectedNextYear)}</div>
              <div style={styles.inflationNote}>With inflation</div>
            </div>
          </div>
        </div>
      )}

      {/* Profits Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.sectionTitle}>Profit History</h2>
        {profits.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No profit entries yet. Click "Add Profit" to get started.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profits.map((profit) => (
                <tr key={profit._id} style={styles.tableRow}>
                  <td style={styles.td}>{formatDate(profit.date)}</td>
                  <td style={styles.td}>{formatCurrency(profit.amount)}</td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{profit.category}</span>
                  </td>
                  <td style={styles.td}>{profit.description || "-"}</td>
                  <td style={styles.td}>
                    <button onClick={() => handleDelete(profit._id)} style={styles.deleteButton}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  addButton: {
    padding: "10px 20px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  formContainer: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#666",
    marginBottom: "6px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
  },
  submitButton: {
    padding: "10px 20px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    alignSelf: "flex-end",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  summaryCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
    color: "#2c3e50",
  },
  summaryDate: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px",
  },
  inflationSection: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  inflationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  inflationCard: {
    background: "#f8f9fa",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
  },
  inflationLabel: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "8px",
  },
  inflationValue: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  inflationLoss: {
    fontSize: "12px",
    color: "#dc3545",
    marginTop: "8px",
  },
  inflationNote: {
    fontSize: "11px",
    color: "#888",
    marginTop: "4px",
  },
  tableContainer: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e9ecef",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    background: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
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
  categoryBadge: {
    display: "inline-block",
    padding: "4px 8px",
    background: "#e9ecef",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#666",
  },
  deleteButton: {
    padding: "4px 12px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
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
};

export default Profit;