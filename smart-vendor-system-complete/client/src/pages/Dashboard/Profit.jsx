import React, { useState, useEffect, useCallback } from "react";
import { TrendingUp, Percent, Sparkles, Calendar, Plus, Trash2, ShieldAlert } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const Profit = () => {
  const [profits, setProfits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "sales",
    date: new Date().toISOString().split('T')[0]
  });

  const fetchProfits = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/profits");
      setProfits(response.data.data || []);
    } catch (error) {
      console.error("Error fetching profits:", error);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/profits/summary");
      setSummary(response.data.data || null);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchProfits(), fetchSummary()]);
    setLoading(false);
  }, [fetchProfits, fetchSummary]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/api/profits", formData);
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
      alert("Failed to record profit entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profit entry?")) {
      try {
        await axiosInstance.delete(`/api/profits/${id}`);
        await Promise.all([fetchProfits(), fetchSummary()]);
      } catch (error) {
        console.error("Error deleting profit:", error);
        alert("Failed to delete profit entry.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px", gap: "16px" }}>
        <div className="loading-spinner"></div>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading profit data...</p>
      </div>
    );
  }

  return (
    <div className="animated-fade-in">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h1>Profit Tracker</h1>
          <p>Record your revenue streams and track purchasing power adjusted for inflation.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-premium profit">
          {showForm ? "✕ Cancel" : <><Plus size={16} /> Add Profit</>}
        </button>
      </div>

      {/* Add Profit Form */}
      {showForm && (
        <div className="panel-card animated-slide-up">
          <h3 className="panel-title">Add Daily Revenue</h3>
          <form onSubmit={handleSubmit} className="panel-form">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input"
                required
                disabled={submitting}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
                disabled={submitting}
                style={{ padding: '11px 16px' }}
              >
                <option value="sales">Product Sales</option>
                <option value="service">Service Fees</option>
                <option value="investment">Investments</option>
                <option value="other">Other Income</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Description</label>
              <input
                type="text"
                placeholder="Optional sales notes or client info"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn-premium profit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Profit"}
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card-luxury">
            <div className="stat-card-info">
              <span className="stat-card-label">Total Profit</span>
              <h2 className="stat-card-value" style={{ color: "var(--color-profit)" }}>
                {formatCurrency(summary.totalProfit)}
              </h2>
            </div>
            <div className="stat-card-icon profit">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-card-info">
              <span className="stat-card-label">Daily Average</span>
              <h2 className="stat-card-value">
                {formatCurrency(summary.dailyAverage)}
              </h2>
            </div>
            <div className="stat-card-icon balance">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="stat-card-luxury">
            <div className="stat-card-info">
              <span className="stat-card-label">Record Entries</span>
              <h2 className="stat-card-value">
                {summary.totalEntries}
              </h2>
            </div>
            <div className="stat-card-icon" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-secondary)" }}>
              <Calendar size={20} />
            </div>
          </div>

          {summary.bestDay && (
            <div className="stat-card-luxury">
              <div className="stat-card-info">
                <span className="stat-card-label">Peak Performance</span>
                <h2 className="stat-card-value" style={{ color: "var(--color-profit)" }}>
                  {formatCurrency(summary.bestDay.amount)}
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {formatDate(summary.bestDay.date)}
                </span>
              </div>
              <div className="stat-card-icon profit">
                <Sparkles size={20} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inflation Calculator Section */}
      {summary && summary.inflation && (
        <div className="panel-card">
          <h2 className="panel-title" style={{ fontSize: "18px" }}>
            <Percent size={18} style={{ color: "var(--color-warning)" }} /> Inflation & Purchasing Power Impact
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>Benchmark Inflation Rate</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-warning)" }}>{summary.inflation.currentRate}%</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Annual Rate (Adjusted Monthly)</div>
            </div>

            <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>Gross profit Value</div>
              <div style={{ fontSize: "22px", fontWeight: "700" }}>{formatCurrency(summary.totalProfit)}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Nominal cash balance</div>
            </div>

            <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>Inflation Adjusted Value</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-profit)" }}>{formatCurrency(summary.inflation.inflationAdjustedValue)}</div>
              <div style={{ fontSize: "11px", color: "var(--color-loss)", fontWeight: "500", marginTop: "4px" }}>
                Purchasing Power Loss: {formatCurrency(summary.inflation.purchasingPowerLoss)}
              </div>
            </div>

            <div style={{ background: "var(--bg-primary)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>Projected Next Year Value</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--color-brand)" }}>{formatCurrency(summary.inflation.projectedNextYear)}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Adjusted for inflation growth</div>
            </div>
          </div>

          <div className="business-tip-box" style={{ background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(10, 14, 23, 0.2) 100%)", borderColor: "rgba(245, 158, 11, 0.2)" }}>
            <div className="tip-icon" style={{ background: "var(--color-warning-light)", color: "var(--color-warning)" }}>
              <ShieldAlert size={20} />
            </div>
            <div className="tip-content">
              <h4 style={{ color: "var(--color-warning)" }}>What does this mean for your business?</h4>
              <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                Due to an annual inflation rate of <strong>{summary.inflation.currentRate}%</strong>, your gross revenue of <strong>{formatCurrency(summary.totalProfit)}</strong> holds the real purchasing power of <strong>{formatCurrency(summary.inflation.inflationAdjustedValue)}</strong> in terms of raw goods. Keeping too much cash sitting in bank accounts leads to purchasing power decay. Consider investing surplus capital back into high-yield inventory assets or growth streams.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profits Table */}
      <div className="panel-card">
        <h3 className="panel-title">Revenue History</h3>
        {profits.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            No revenue entries recorded yet. Click "Add Profit" above to submit.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profits.map((profit) => (
                  <tr key={profit._id}>
                    <td style={{ fontWeight: 500 }}>{formatDate(profit.date)}</td>
                    <td style={{ color: "var(--color-profit)", fontWeight: "600" }}>{formatCurrency(profit.amount)}</td>
                    <td>
                      <span className="badge-category" style={{ backgroundColor: "var(--color-profit-light)", color: "var(--color-profit)" }}>
                        {profit.category}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{profit.description || "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleDelete(profit._id)} className="btn-action-delete" title="Delete record">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profit;