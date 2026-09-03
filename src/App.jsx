import React, { useState } from 'react';

export default function App() {
  const [tripName, setTripName] = useState('Goa Trip 2026');
  const [members, setMembers] = useState('Rahul, Priya, Amit, Sara');
  const [expenses, setExpenses] = useState([
    { description: 'Food & Snacks', amount: 2500, payer: 'Rahul' },
    { description: 'Hotel Stay', amount: 7500, payer: 'Amit' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;
    setExpenses([...expenses, { description, amount: parseFloat(amount), payer }]);
    setDescription('');
    setAmount('');
    setPayer('');
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            marginBottom: '12px'
          }}>
            ✨ Powered by AI Smart Split
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: '800', margin: '0 0 10px 0', color: '#1e293b' }}>
            TripSplit AI
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '580px', margin: '0 auto', lineHeight: '1.5' }}>
            Effortlessly track group trip expenses, split costs with AI precision, and settle up with zero confusion.
          </p>
        </header>

        {/* Top Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          
          {/* Trip Setup Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 18px 0', color: '#0f172a' }}>
              🗺️ Trip Setup
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Goa Trip 2026" 
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="Rahul, Priya, Amit, Sara" 
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Add Expense Card */}
          <form onSubmit={handleAddExpense} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 18px 0', color: '#0f172a' }}>
              💸 Add Expense
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="What was paid for? (e.g. Dinner)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input 
                  type="text" 
                  placeholder="Paid by" 
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#0f172a',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button 
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                }}
              >
                + Add Expense
              </button>
            </div>
          </form>

        </div>

        {/* Expenses List Card */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px',
            marginBottom: '18px'
          }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0', color: '#0f172a' }}>
                📍 {tripName || 'Trip Expenses'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Members: <span style={{ fontWeight: '500', color: '#334155' }}>{members || 'None'}</span>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#059669' }}>
                ₹{totalExpense.toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenses.map((exp, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '2px' }}>
                    {exp.description}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Paid by <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.payer}</span>
                  </div>
                </div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>
                  ₹{exp.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
