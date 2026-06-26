import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, ArrowRight } from "lucide-react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-layout">
      {/* Navbar Header */}
      <header className="landing-header">
        <div className="brand-logo">
          SmartVendor<span>.</span>
        </div>
        <nav className="nav-links">
          <Link to="/login" className="link-login">Sign In</Link>
          <Link to="/register" className="btn-cta-small">Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <section className="hero-section">
          <div className="badge-glow">Now in Public Beta 🚀</div>
          <h1 className="hero-title">
            Manage your retail business ledger <span>smarter</span>
          </h1>
          <p className="hero-subtitle">
            An elegant, secure, and human-friendly digital ledger to track profits, expenses, and losses—complete with real-time inflation adjustments to protect your purchasing power.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn-cta">
              Create Free Account <ArrowRight className="cta-icon" size={18} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Access Dashboard
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <h2 className="section-title">Built for Smart Merchants</h2>
          <div className="features-grid">
            
            <div className="feature-card">
              <div className="feature-icon profit-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Profit Tracker</h3>
              <p>Record daily sales and revenue streams. Visualize your best-performing days instantly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon loss-icon">
                <TrendingDown size={24} />
              </div>
              <h3>Loss Ledger</h3>
              <p>Keep track of damaged inventory, refunds, or expired goods to protect your bottom line.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon expense-icon">
                <DollarSign size={24} />
              </div>
              <h3>Expense Logs</h3>
              <p>Log utility bills, rent, restocking, and logistics costs to understand where money flows.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon inflation-icon">
                <Percent size={24} />
              </div>
              <h3>Inflation Adjustments</h3>
              <p>Automatically calculates your real purchasing power using national inflation benchmarks.</p>
            </div>

            <div className="feature-card font-exclusive">
              <div className="feature-icon security-icon">
                <Shield size={24} />
              </div>
              <h3>Secure Encrypted Sessions</h3>
              <p>Your transactions are secured with industry-standard JWT authentication and password hashing.</p>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} SmartVendor System. All rights reserved. Designed to help local business owners thrive.</p>
      </footer>
    </div>
  );
}

export default Landing;