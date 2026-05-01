import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { LogOut, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    api.get('/reports')
      .then(res => setReport(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="layout">
      <header className="navbar">
        <div className="brand">
          <Wallet className="brand-icon" />
          <h2>FinanceTracker</h2>
        </div>
        <div className="nav-actions">
          <span className="user-greeting">Hi, {user.name}</span>
          <button onClick={() => navigate('/transactions')} className="btn-secondary">View Transactions</button>
          <button onClick={handleLogout} className="btn-icon" title="Logout"><LogOut size={20}/></button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <h1 className="page-title">Dashboard Overview</h1>
        
        <div className="stats-grid">
          <div className="stat-card income">
            <div className="stat-icon"><ArrowUpRight /></div>
            <div className="stat-info">
              <span className="stat-label">Total Income</span>
              <span className="stat-val">${report?.totalIncome?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <div className="stat-card expense">
            <div className="stat-icon"><ArrowDownRight /></div>
            <div className="stat-info">
              <span className="stat-label">Total Expenses</span>
              <span className="stat-val">${report?.totalExpenses?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="stat-card savings">
            <div className="stat-icon"><Wallet /></div>
            <div className="stat-info">
              <span className="stat-label">Net Savings</span>
              <span className="stat-val">${report?.savings?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div className="categories-section">
          <h2>Category Breakdown</h2>
          {report?.categoryBreakdown?.length === 0 ? (
            <p className="empty-state">No transactions recorded yet.</p>
          ) : (
            <div className="breakdown-list">
              {report?.categoryBreakdown?.map((item, idx) => (
                <div key={idx} className="breakdown-item">
                  <span className="cat-name">{item.categoryName}</span>
                  <span className={`cat-amount ${item.type.toLowerCase()}`}>
                    {item.type === 'EXPENSE' ? '-' : '+'}${item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
