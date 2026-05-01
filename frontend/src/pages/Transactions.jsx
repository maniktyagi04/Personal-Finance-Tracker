import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Plus } from 'lucide-react';

export default function Transactions() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, catRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/categories')
      ]);
      setTransactions(txRes.data.data.transactions);
      setCategories(catRes.data.data);
      if (catRes.data.data.length > 0) {
        setCategoryId(catRes.data.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        amount: Number(amount),
        type,
        categoryId,
        date,
        description
      });
      setAmount('');
      setDescription('');
      fetchData(); // refresh list
    } catch (err) {
      alert('Failed to add transaction: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="layout">
      <header className="navbar">
        <div className="brand" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>
          <ArrowLeft className="brand-icon" />
          <h2>Back to Dashboard</h2>
        </div>
      </header>
      
      <main className="transactions-content">
        <div className="split-view">
          <div className="form-section">
            <h3>Add Transaction</h3>
            <form onSubmit={handleAddTransaction} className="tx-form">
              <div className="form-group">
                <label>Amount</label>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary w-full"><Plus size={18}/> Add Transaction</button>
            </form>
          </div>

          <div className="list-section">
            <h3>Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="empty-state">No transactions found.</p>
            ) : (
              <div className="tx-list">
                {transactions.map(tx => (
                  <div key={tx.id} className="tx-item">
                    <div className="tx-details">
                      <div className="tx-desc">{tx.description || tx.category?.name || 'Unknown'}</div>
                      <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                    <div className={`tx-amount ${tx.type.toLowerCase()}`}>
                      {tx.type === 'EXPENSE' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
