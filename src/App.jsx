import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses', 'balance', 'itinerary'
  const [userName, setUserName] = useState('Ayaan');
  const [tripName, setTripName] = useState('Goa Trip 2026');
  const [members, setMembers] = useState('Rahul, Priya, Amit, Sara');
  
  // Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Food & Snacks', amount: 2500, payer: 'Rahul' },
    { id: 2, description: 'Hotel Stay', amount: 7500, payer: 'Amit' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  // Itinerary State
  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival & Beach Sunset at Baga' },
    { id: 2, day: 'Day 2', activity: 'Water Sports & Fort Aguada Visit' }
  ]);
  const [dayInput, setDayInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  // Expense Handlers
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;
    setExpenses([...expenses, { id: Date.now(), description, amount: parseFloat(amount), payer }]);
    setDescription('');
    setAmount('');
    setPayer('');
  };

  // Itinerary Handlers
  const handleAddItinerary = (e) => {
    e.preventDefault();
    if (!dayInput || !activityInput) return;
    setItinerary([...itinerary, { id: Date.now(), day: dayInput, activity: activityInput }]);
    setDayInput('');
    setActivityInput('');
  };

  // Balance Calculation Logic
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
  const memberCount = memberList.length || 1;
  const perPersonShare = totalExpense / memberCount;

  // Calculate who paid how much
  const paidByMember = {};
  memberList.forEach(m => { paidByMember[m] = 0; });
  expenses.forEach(exp => {
    if (paidByMember[exp.payer] !== undefined) {
      paidByMember[exp.payer] += exp.amount;
    } else {
      paidByMember[exp.payer] = exp.amount;
    }
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eef2ff 0%, #f1f5f9 100%)',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '30px 16px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* User Welcome & Header Banner */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.08)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Welcome Back
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#1e293b' }}>
              Hello, {userName}! 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
              Managing trip expenses & plans for <strong style={{ color: '#0f172a' }}>{tripName}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: '12px',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TOTAL SPENT</span>
              <strong style={{ fontSize: '18px', color: '#059669' }}>₹{totalExpense.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#ffffff',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <button 
            onClick={() => setActiveTab('expenses')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'expenses' ? '#4f46e5' : 'transparent',
              color: activeTab === 'expenses' ? '#ffffff' : '#64748b'
            }}
          >
            💸 Expenses
          </button>
          
          <button 
            onClick={() => setActiveTab('balance')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'balance' ? '#4f46e5' : 'transparent',
              color: activeTab === 'balance' ? '#ffffff' : '#64748b'
            }}
          >
            ⚖️ Balance & Split
          </button>

          <button 
            onClick={() => setActiveTab('itinerary')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'itinerary' ? '#4f46e5' : 'transparent',
              color: activeTab === 'itinerary' ? '#ffffff' : '#64748b'
            }}
          >
            🗺️ Itinerary
          </button>
        </div>

        {/* PAGE 1: EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Setup & Add Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* Trip Setup Card */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>⚙️ Trip Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Trip Name</label>
                    <input 
                      type="text" 
                      value={tripName} 
                      onChange={(e) => setTripName(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Members (Comma separated)</label>
                    <input 
                      type="text" 
                      value={members} 
                      onChange={(e) => setMembers(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Add Expense Form */}
              <form onSubmit={handleAddExpense} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>➕ Add New Expense</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="What was paid for? (e.g. Dinner)" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input 
                      type="number" 
                      placeholder="Amount (₹)" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Paid by" 
                      value={payer}
                      onChange={(e) => setPayer(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '11px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                    + Save Expense
                  </button>
                </div>
              </form>

            </div>

            {/* Expenses List */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>📋 All Expenses</h3>
              {expenses.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>No expenses recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.map((exp) => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{exp.description}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Paid by <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.payer}</span></div>
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>₹{exp.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAGE 2: BALANCE & SPLIT TAB */}
        {activeTab === 'balance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>⚖️ Expense Settlement Summary</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#e0e7ff', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#4338ca', display: 'block', fontWeight: '600' }}>TOTAL EXPENSE</span>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#3730a3' }}>₹{totalExpense.toFixed(2)}</span>
                </div>
                <div style={{ backgroundColor: '#d1fae5', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#065f46', display: 'block', fontWeight: '600' }}>EACH MEMBER SHARE</span>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#047857' }}>₹{perPersonShare.toFixed(2)}</span>
                </div>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: '#334155' }}>Member Balances</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(paidByMember).map((person, idx) => {
                  const paid = paidByMember[person];
                  const balance = paid - perPersonShare;
                  const isGetsBack = balance >= 0;

                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <strong style={{ fontSize: '15px' }}>{person}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Paid: ₹{paid.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: isGetsBack ? '#059669' : '#dc2626' }}>
                          {isGetsBack ? `Gets back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 3: ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Add Itinerary Form */}
            <form onSubmit={handleAddItinerary} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>📌 Add Travel Plan</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Day (e.g. Day 1)" 
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input 
                  type="text" 
                  placeholder="Activity / Place to visit" 
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  + Add
                </button>
              </div>
            </form>

            {/* Itinerary Schedule */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>🗺️ Trip Itinerary Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                      {item.day}
                    </div>
                    <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>
                      {item.activity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
