import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowRight, Activity, Calendar } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

function DashboardHome() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalLoss: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch Profits Summary
      const profitSumRes = await axiosInstance.get("/api/profits/summary");
      const profitData = profitSumRes.data?.data || { totalProfit: 0 };
      const totalProfit = profitData.totalProfit || 0;

      // Fetch Records (Loss and Expense)
      const recordsRes = await axiosInstance.get(`/api/records/${userId}`);
      const records = recordsRes.data || [];

      // Calculate aggregates
      let totalLoss = 0;
      let totalExpense = 0;

      records.forEach((record) => {
        if (record.type === "loss") {
          totalLoss += record.amount || 0;
        } else if (record.type === "expense") {
          totalExpense += record.amount || 0;
        }
      });

      const netBalance = totalProfit - totalLoss - totalExpense;

      setStats({
        totalProfit,
        totalLoss,
        totalExpense,
        netBalance,
      });

      // Combine profits and records into a single recent transactions list
      // 1. Get raw profits
      const profitsRes = await axiosInstance.get("/api/profits");
      const rawProfits = profitsRes.data?.data || [];

      const transactions = [
        ...rawProfits.map(p => ({
          id: p._id,
          type: "profit",
          category: p.category || "sales",
          amount: p.amount,
          date: p.date,
          description: p.description || "Sales revenue"
        })),
        ...records.map(r => ({
          id: r._id,
          type: r.type, // "loss" or "expense"
          category: r.category || "other",
          amount: r.amount,
          date: r.date,
          description: r.description || `${r.type} entry`
        }))
      ];

      // Sort by date descending, take top 5
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentTransactions(transactions.slice(0, 5));

    } catch (error) {
      console.error("Error loading dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (token && userId) {
      loadDashboardData();
    }
  }, [token, userId, loadDashboardData]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px", gap: "16px" }}>
        <div className="loading-spinner"></div>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Loading dashboard ledger...</p>
      </div>
    );
  }

  // Calculate percentage ratios for visual indicators
  const totalOutflow = stats.totalLoss + stats.totalExpense;
  const healthRatio = stats.totalProfit > 0 
    ? Math.max(0, Math.min(100, ((stats.totalProfit - totalOutflow) / stats.totalProfit) * 100))
    : 0;

  // Personalized insights
  let tipTitle = "Stable Ledger Status";
  let tipBody = "No transaction logs registered. Go to the trackers in the sidebar to enter your figures and view insights.";
  
  if (stats.totalProfit > 0) {
    if (healthRatio > 70) {
      tipTitle = "Excellent Cash Retention!";
      tipBody = `You are retaining ${healthRatio.toFixed(0)}% of your profits. Consider allocating some of this net balance (₹${stats.netBalance.toLocaleString()}) to build a reserve fund or expand inventory.`;
    } else if (healthRatio > 40) {
      tipTitle = "Balanced Capital Flow";
      tipBody = "Your cash outflows (expenses + losses) are moderate. Review your monthly utilities or transport costs to keep retaining healthy margins.";
    } else {
      tipTitle = "High Capital Outflow Alert";
      tipBody = `Outflows consume ${(100 - healthRatio).toFixed(0)}% of profits. Check your Loss Ledger to identify recurring stock leakage, or cut down on non-essential operational expenses.`;
    }
  }

  return (
    <div className="animated-fade-in">
      <div className="view-header" style={{ marginBottom: "24px" }}>
        <div className="view-title">
          <h1>Merchant Dashboard</h1>
          <p>Real-time financial status of your retail operation.</p>
        </div>
      </div>

      {/* Luxury Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Total Revenue</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-profit)" }}>
              {formatCurrency(stats.totalProfit)}
            </h2>
          </div>
          <div className="stat-card-icon profit">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Total Losses</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-loss)" }}>
              {formatCurrency(stats.totalLoss)}
            </h2>
          </div>
          <div className="stat-card-icon loss">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Expenses Paid</span>
            <h2 className="stat-card-value" style={{ color: "var(--color-expense)" }}>
              {formatCurrency(stats.totalExpense)}
            </h2>
          </div>
          <div className="stat-card-icon expense">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="stat-card-luxury">
          <div className="stat-card-info">
            <span className="stat-card-label">Net Balance</span>
            <h2 className="stat-card-value" style={{ color: stats.netBalance >= 0 ? "var(--text-primary)" : "var(--color-loss)" }}>
              {formatCurrency(stats.netBalance)}
            </h2>
          </div>
          <div className="stat-card-icon balance">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      {/* Ledger Efficiency Progress */}
      {stats.totalProfit > 0 && (
        <div className="panel-card" style={{ padding: "20px 24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>
              Revenue Retention Efficiency
            </span>
            <span style={{ fontSize: "14px", fontWeight: "700", color: healthRatio > 50 ? "var(--color-profit)" : "var(--color-warning)" }}>
              {healthRatio.toFixed(0)}% Profit Retained
            </span>
          </div>
          <div style={{ width: "100%", height: "8px", background: "var(--bg-tertiary)", borderRadius: "99px", overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${healthRatio}%`, 
                height: "100%", 
                background: healthRatio > 60 
                  ? "linear-gradient(90deg, var(--color-brand) 0%, var(--color-profit) 100%)"
                  : healthRatio > 30 
                    ? "var(--color-warning)"
                    : "var(--color-loss)",
                borderRadius: "99px",
                transition: "width 0.5s ease" 
              }} 
            />
          </div>
        </div>
      )}

      {/* Main Grid: Recent Transactions + Business Insight */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "24px", alignItems: "start" }}>
        
        {/* Recent Transactions List */}
        <div className="panel-card" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 className="panel-title" style={{ margin: 0 }}>
              <Activity size={18} style={{ color: "var(--color-brand)" }} /> Recent Transactions
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              Latest 5 entries
            </span>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
              No transactions recorded yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table-luxury">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Detail</th>
                    <th>Type</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ fontSize: "13px", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={12} />
                          {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{tx.category}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.description}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="badge-category" 
                          style={{
                            backgroundColor: tx.type === "profit" 
                              ? "var(--color-profit-light)" 
                              : tx.type === "loss" 
                                ? "var(--color-loss-light)" 
                                : "var(--color-expense-light)",
                            color: tx.type === "profit" 
                              ? "var(--color-profit)" 
                              : tx.type === "loss" 
                                ? "var(--color-loss)" 
                                : "var(--color-expense)"
                          }}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td style={{ 
                        textAlign: "right", 
                        fontWeight: "600",
                        color: tx.type === "profit" ? "var(--color-profit)" : "var(--text-primary)"
                      }}>
                        {tx.type === "profit" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dynamic Recommendation Block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="business-tip-box">
            <div className="tip-icon">
              <Activity size={20} />
            </div>
            <div className="tip-content">
              <h4>{tipTitle}</h4>
              <p>{tipBody}</p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="panel-card" style={{ marginBottom: 0 }}>
            <h3 className="panel-title">Quick Actions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Link to="/dashboard/profit" className="btn-premium profit" style={{ textDecoration: "none" }}>
                Add Profit
              </Link>
              <Link to="/dashboard/expense" className="btn-premium" style={{ textDecoration: "none" }}>
                Add Expense
              </Link>
              <Link to="/dashboard/loss" className="btn-premium loss" style={{ textDecoration: "none", gridColumn: "span 2" }}>
                Log Stock Loss / Damage
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardHome;