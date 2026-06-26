import React, { useState, useEffect, useCallback } from "react";
import { 
  TrendingDown, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertOctagon, 
  Tag, 
  PieChart as PieIcon, 
  BarChart2 
} from "lucide-react";
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
import axiosInstance from "../utils/axiosInstance";

const Loss = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "damaged_goods",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#6b7280'];

  const fetchLosses = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/records/${userId}`);
      const list = response.data || [];
      // Filter records for "loss" type
      const lossList = list.filter(item => item.type === "loss");
      // Sort by date descending
      setLosses(lossList.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching losses:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchLosses();
    setLoading(false);
  }, [fetchLosses]);

  useEffect(() => {
    if (token && userId) {
      loadData();
    }
  }, [token, userId, loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/api/records/add", {
        userId,
        type: "loss",
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      });
      setShowForm(false);
      setFormData({
        amount: "",
        category: "damaged_goods",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      await fetchLosses();
    } catch (error) {
      console.error("Error adding loss:", error);
      alert("Failed to log loss entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loss record?")) {
      try {
        await axiosInstance.delete(`/api/records/${id}`);
        await fetchLosses();
      } catch (error) {
        console.error("Error deleting loss record:", error);
        alert("Failed to delete record.");
      }
    }
  };

  // Calculations
  const totalLoss = losses.reduce((sum, item) => sum + item.amount, 0);
  const averageLoss = losses.length > 0 ? (totalLoss / losses.length) : 0;

  // Process Category Distribution Data
  const categoryMap = {};
  losses.forEach(item => {
    const cat = item.category || "other";
    categoryMap[cat] = (categoryMap[cat] || 0) + item.amount;
  });
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key.replace("_", " ").toUpperCase(),
    value: categoryMap[key]
  }));

  // Process Trend Data (group by date, sort chronological)
  const trendMap = {};
  [...losses].reverse().forEach(item => {
    const dateFormatted = new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    trendMap[dateFormatted] = (trendMap[dateFormatted] || 0) + item.amount;
  });
  const trendData = Object.keys(trendMap).map(key => ({
    date: key,
    amount: trendMap[key]
  })).slice(-10);

  const highestCategory = categoryData.reduce((max, item) => item.value > max.value ? item : max, { name: "N/A", value: 0 });

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
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading loss data...</p>
      </div>
    );
  }

  return (
    <div className="animated-fade-in">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h1>Loss Ledger</h1>
          <p>Record stock leakage, refunds, theft, and expired inventory to audit leakage.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-premium loss">
          {showForm ? "✕ Cancel" : <><Plus size={16} /> Log Loss</>}
        </button>
      </div>

      {/* Add Loss Form */}
      {showForm && (
        <div className="panel-card animated-slide-up">
          <h3 className="panel-title">Log Loss Event</h3>
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
                placeholder="e.g. 1500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input"
                required
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Loss Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
                disabled={submitting}
                style={{ padding: '11px 16px' }}
              >
                <option value="damaged_goods">Damaged Goods</option>
                <option value="expired_stock">Expired Stock</option>
                <option value="refunds">Refunds Given</option>
                <option value="theft">Theft / Shoplifting</option>
                <option value="other">Other Leakage</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Reason / Item Details</label>
              <input
                type="text"
                placeholder="Details of the items or incident"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn-premium loss" disabled={submitting}>
              {submitting ? "Logging..." : "Log Loss"}
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Total Capital Loss</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-loss)" }}>
              {formatCurrency(totalLoss)}
            </h2>
          </div>
          <div className="stat-card-icon loss">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Average per Incident</span>
            <h2 className="stat-card-value">
              {formatCurrency(averageLoss)}
            </h2>
          </div>
          <div className="stat-card-icon" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-secondary)" }}>
            <AlertOctagon size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Highest Loss Area</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-warning)" }}>
              {highestCategory.name}
            </h2>
            {highestCategory.value > 0 && (
              <span style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Total: {formatCurrency(highestCategory.value)}
              </span>
            )}
          </div>
          <div className="stat-card-icon" style={{ background: "var(--color-warning-light)", color: "var(--color-warning)" }}>
            <Tag size={20} />
          </div>
        </div>
      </div>

      {/* Analytical Charts */}
      {losses.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "24px" }}>
          {/* Trend Bar Chart */}
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <h3 className="panel-title"><BarChart2 size={18} style={{ color: "var(--color-brand)" }} /> Loss Incidents</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
                    itemStyle={{ color: "var(--color-loss)" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} name="Loss amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <h3 className="panel-title"><PieIcon size={18} style={{ color: "var(--color-warning)" }} /> Distribution of Loss</h3>
            <div style={{ width: "100%", height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={10}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* History logs table */}
      <div className="panel-card">
        <h3 className="panel-title">Audit Log</h3>
        {losses.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            No losses recorded. Click "Log Loss" above to enter database leakage events.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Loss Amount</th>
                  <th>Category</th>
                  <th> incident details</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {losses.map((item) => (
                  <tr key={item._id}>
                    <td style={{ fontWeight: 500 }}>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td style={{ color: "var(--color-loss)", fontWeight: "600" }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td>
                      <span className="badge-category" style={{ backgroundColor: "var(--color-loss-light)", color: "var(--color-loss)" }}>
                        {item.category.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                      {item.description || "-"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button onClick={() => handleDelete(item._id)} className="btn-action-delete" title="Delete record">
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

export default Loss;