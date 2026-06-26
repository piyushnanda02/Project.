import React, { useState, useEffect, useCallback } from "react";
import { 
  TrendingDown, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
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

const Expense = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "restocking",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280'];

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/records/${userId}`);
      const list = response.data || [];
      // Filter records for "expense" type
      const expenseList = list.filter(item => item.type === "expense");
      // Sort by date descending for list view
      setExpenses(expenseList.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setLoading(true);
    await fetchExpenses();
    setLoading(false);
  }, [fetchExpenses]);

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
        type: "expense",
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      });
      setShowForm(false);
      setFormData({
        amount: "",
        category: "restocking",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      await fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense record?")) {
      try {
        await axiosInstance.delete(`/api/records/${id}`);
        await fetchExpenses();
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Failed to delete record.");
      }
    }
  };

  // Calculations for display
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const averageExpense = expenses.length > 0 ? (totalExpense / expenses.length) : 0;

  // Process Category Distribution Data
  const categoryMap = {};
  expenses.forEach(item => {
    const cat = item.category || "other";
    categoryMap[cat] = (categoryMap[cat] || 0) + item.amount;
  });
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key.toUpperCase(),
    value: categoryMap[key]
  }));

  // Process Daily/Monthly Trend Data (group by date, sort chronological)
  const trendMap = {};
  [...expenses].reverse().forEach(item => {
    // Format YYYY-MM-DD
    const dateFormatted = new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    trendMap[dateFormatted] = (trendMap[dateFormatted] || 0) + item.amount;
  });
  const trendData = Object.keys(trendMap).map(key => ({
    date: key,
    amount: trendMap[key]
  })).slice(-10); // Keep last 10 transaction dates for legibility

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
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading expense data...</p>
      </div>
    );
  }

  return (
    <div className="animated-fade-in">
      {/* Header */}
      <div className="view-header">
        <div className="view-title">
          <h1>Expense Tracker</h1>
          <p>Track business overhead costs, rent, restocking, and logistics.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-premium">
          {showForm ? "✕ Cancel" : <><Plus size={16} /> Add Expense</>}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="panel-card animated-slide-up">
          <h3 className="panel-title">Add Expense Record</h3>
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
                placeholder="e.g. 2400"
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
                <option value="restocking">Inventory Restocking</option>
                <option value="rent">Rent / Leases</option>
                <option value="utilities">Utilities (Power, Net)</option>
                <option value="salaries">Salaries / Labor</option>
                <option value="transport">Transport / Fuel</option>
                <option value="marketing">Marketing / Promotion</option>
                <option value="other">Other Operations</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Description / Supplier</label>
              <input
                type="text"
                placeholder="Optional expense details (e.g. Wholesale Inc.)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-input"
                disabled={submitting}
              />
            </div>

            <button type="submit" className="btn-premium" disabled={submitting}>
              {submitting ? "Saving..." : "Save Expense"}
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Total Outflow</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-loss)" }}>
              {formatCurrency(totalExpense)}
            </h2>
          </div>
          <div className="stat-card-icon expense">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Average per Entry</span>
            <h2 className="stat-card-value">
              {formatCurrency(averageExpense)}
            </h2>
          </div>
          <div className="stat-card-icon" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-secondary)" }}>
            <DollarSign size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Highest Expense Area</span>
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
      {expenses.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", marginBottom: "24px" }}>
          {/* Trend Line Chart */}
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <h3 className="panel-title"><BarChart2 size={18} style={{ color: "var(--color-brand)" }} /> Expense Trend</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
                    itemStyle={{ color: "var(--color-loss)" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <h3 className="panel-title"><PieIcon size={18} style={{ color: "var(--color-warning)" }} /> Category Breakdown</h3>
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
        <h3 className="panel-title">Expense History</h3>
        {expenses.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
            No expense records logged. Click "Add Expense" above to start logging.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-luxury">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Notes</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
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
                        {item.category}
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

export default Expense;