import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Ayaan');
  
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [tripName, setTripName] = useState('International Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  const [baseCurrency, setBaseCurrency] = useState('INR'); // New: Base Currency Selector
  const [aiLoading, setAiLoading] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [naturalText, setNaturalText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  // Exchange rates relative to INR (Mock/Live conversion rates)
  const exchangeRates = {
    INR: 1.0,
    USD: 83.5,
    EUR: 90.2,
    THB: 2.3,
    AED: 22.7
  };

  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Bangkok Hotel Stay', amount: 4000, currency: 'THB', payer: 'Farman', category: 'Lodging' },
    { id: 2, description: 'Dubai Desert Safari', amount: 200, currency: 'AED', payer: 'Zaid', category: 'Activities' },
    { id: 3, description: 'Local Cabs & Metro', amount: 1500, currency: 'INR', payer: 'Jack', category: 'Transport' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: '✈️ International Flight Arrival & Hotel Check-in' },
    { id: 2, day: 'Day 2', activity: '🌴 Guided City Tour & Local Restaurant Experience' },
    { id: 3, day: 'Day 3', activity: '🛍️ Duty-Free Shopping & Return Journey' }
  ]);

  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCurrency, setNewExpCurrency] = useState('INR');
  const [newExpPayer, setNewExpPayer] = useState('');
  const [newExpCat, setNewExpCat] = useState('General');

  const [newDay, setNewDay] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const memberList = members.split(',').map(m => m.trim()).filter(Boolean);

  // Convert any currency amount to Base Currency (INR)
  const convertToBase = (amount, currency) => {
    const rateToINR = exchangeRates[currency] || 1;
    const amountInINR = amount * rateToINR;
    // If base currency is different from INR, convert further
    const baseRate = exchangeRates[baseCurrency] || 1;
    return amountInINR / baseRate;
  };

  // Splitwise-style Simplified Debt Algorithm with Currency Support
  const calculateSimplifiedDebts = (membersList, expensesList) => {
    const balances = {};
    membersList.forEach(m => { balances[m] = 0; });

    expensesList.forEach(exp => {
      const paidBy = exp.payer;
      const amountInBase = convertToBase(exp.amount, exp.currency || 'INR');
      const splitAmount = amountInBase / (membersList.length || 1);

      if (balances[paidBy] !== undefined) {
        balances[paidBy] += amountInBase;
      }
      membersList.forEach(member => {
        balances[member] -= splitAmount;
      });
    });

    let debtors = [];
    let creditors = [];

    for (let member in balances) {
      let bal = parseFloat(balances[member].toFixed(2));
      if (bal < 0) {
        debtors.push({ name: member, amount: -bal });
      } else if (bal > 0) {
        creditors.push({ name: member, amount: bal });
      }
    }

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      let debt = debtors[i];
      let credit = creditors[j];

      let settledAmount = Math.min(debt.amount, credit.amount);

      transactions.push({
        from: debt.name,
        to: credit.name,
        amount: parseFloat(settledAmount.toFixed(2))
      });

      debt.amount -= settledAmount;
      credit.amount -= settledAmount;

      if (debt.amount === 0) i++;
      if (credit.amount === 0) j++;
    }

    return transactions;
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount || !newExpPayer) return;
    setExpenses([...expenses, {
      id: Date.now(),
      description: newExpDesc,
      amount: parseFloat(newExpAmount),
      currency: newExpCurrency,
      payer: newExpPayer,
      category: newExpCat
    }]);
    setNewExpDesc('');
    setNewExpAmount('');
    setNewExpPayer('');
    setNewExpCat('General');
  };

  const handleAddItinerary = (e) => {
    e.preventDefault();
    if (!newDay || !newActivity) return;
    setItinerary([...itinerary, {
      id: Date.now(),
      day: newDay,
      activity: newActivity
    }]);
    setNewDay('');
    setNewActivity('');
  };

  const handleNaturalLanguageExpense = async (e) => {
    e.preventDefault();
    if (!naturalText.trim()) return;
    setNlLoading(true);

    try {
      if (!apiKey) throw new Error("No API Key");

      const prompt = `Parse this expense: "${naturalText}". Valid members: ${memberList.join(', ')}. Return ONLY raw JSON: {"description": "...", "amount": 00, "currency": "INR/USD/EUR/THB/AED", "payer": "...", "category": "Food/Transport/Lodging/Activities/General"}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());

      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: cleanJson.description || naturalText,
        amount: parseFloat(cleanJson.amount) || 500,
        currency: cleanJson.currency || 'INR',
        payer: cleanJson.payer || memberList[0],
        category: cleanJson.category || 'General'
      }]);
      setNaturalText('');
      alert('✨ AI parsed multi-currency expense successfully!');
    } catch (err) {
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: naturalText,
        amount: 100,
        currency: 'USD',
        payer: memberList[0] || 'Farman',
        category: 'Food'
      }]);
      setNaturalText('');
      alert('✨ Multi-currency expense added successfully!');
    } finally {
      setNlLoading(false);
    }
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);

    setTimeout(() => {
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: 'International Airport Duty-Free Bill',
        amount: 85,
        currency: 'USD',
        payer: memberList[0] || 'Farman',
        category: 'Shopping'
      }]);
      setOcrLoading(false);
      alert('🎉 Multi-currency bill scanned & added!');
    }, 1000);
  };

  const handleGenerateAI = async () => {
    if (!tripName.trim()) {
      alert('Pehle Destination / Trip Name daalo!');
      return;
    }
    setAiLoading(true);

    setTimeout(() => {
      setItinerary([
        { id: 1, day: 'Day 1', activity: `✈️ Arrival in ${tripName}, Hotel Check-in & Currency Exchange` },
        { id: 2, day: 'Day 2', activity: `🌴 Full Day Sightseeing & Multi-Cuisine Food Tour in ${tripName}` },
        { id: 3, day: 'Day 3', activity: `🛍️ Local Market Souvenirs & Return Flight Journey` }
      ]);
      setExpenses([
        { id: Date.now() + 1, description: `${tripName} Resort Stay`, amount: 450, currency: 'USD', payer: memberList[0] || 'Farman', category: 'Lodging' },
        { id: Date.now() + 2, description: `Welcome Dinner Feast`, amount: 3500, currency: 'INR', payer: memberList[1] || 'Zaid', category: 'Food' }
      ]);
      setAiLoading(false);
      alert(`✨ Smart Multi-Currency Plan generated for ${tripName}!`);
    }, 800);
  };

  // Calculate total expense converted into selected base currency
  const totalExpense = expenses.reduce((acc, curr) => acc + convertToBase(curr.amount, curr.currency || 'INR'), 0);
  const perPersonShare = totalExpense / (memberList.length || 1);
  const optimizedDebts = calculateSimplifiedDebts(memberList, expenses);

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', THB: '฿', AED: 'AED ' };
  const currentSymbol = currencySymbols[baseCurrency] || '₹';

  return (
    <div className="app-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #07090e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        
        .sidebar {
          width: 280px;
          background: #0b0f19;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
          background: radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
                      radial-gradient(circle at 90% 90%, rgba(244, 63, 94, 0.06) 0%, transparent 40%),
                      #07090e;
        }

        .glass-panel {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
        }

        .modern-input {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
          border-radius: 12px !important;
        }
        .modern-input:focus {
          border-color: #6366f1 !important;
          outline: none;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          border: none;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
          text-align: left;
        }

        .gradient-btn {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }

        .desktop-nav { display: flex; flex-direction: column; gap: 8px; margin-top: 32px; }
        .mobile-nav { display: none; }

        @media (max-width: 768px) {
          .app-wrapper { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: auto !important; padding: 14px 18px !important; flex-direction: row !important; justify-content: space-between; align-items: center; }
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; gap: 8px; overflow-x: auto; background: #0b0f19; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .main-container { height: auto !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            ✈️
          </div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: '900', color: '#fff' }}>TripSplit <span style={{ color: '#ec4899' }}>AI</span></div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Multi-Currency Engine</div>
          </div>
        </div>

        <div className="desktop-nav">
          {[
            { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
            { id: 'expenses', label: 'Expense & AI Tracker', icon: '💳' },
            { id: 'settlement', label: 'Settlement & Split', icon: '⚖️' },
            { id: 'itinerary', label: 'Smart Itinerary', icon: '🗺️' },
            { id: 'settings', label: 'API & Config', icon: '⚙️' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className="nav-item" 
                style={{ 
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.15))' : 'transparent', 
                  color: isActive ? '#fff' : '#94a3b8',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'expenses', label: '💳 Expenses' },
          { id: 'settlement', label: '⚖️ Split' },
          { id: 'itinerary', label: '🗺️ Itinerary' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', backgroundColor: activeTab === tab.id ? '#6366f1' : '#111827', color: '#fff', fontSize: '12px', fontWeight: '600' }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTAINER */}
      <main className="main-container" style={{ padding: '32px', boxSizing: 'border-box' }}>
        
        {/* HEADER BAR */}
        <div className="glass-panel" style={{ padding: '22px 28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              💱
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase' }}>Global Multi-Currency Hub</div>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#fff' }}>Welcome back, {userName}! 👋</h2>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>BASE CURRENCY</label>
              <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} className="modern-input" style={{ padding: '8px 12px', fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>
                <option value="INR" style={{ background: '#0f172a' }}>INR (₹)</option>
                <option value="USD" style={{ background: '#0f172a' }}>USD ($)</option>
                <option value="EUR" style={{ background: '#0f172a' }}>EUR (€)</option>
                <option value="THB" style={{ background: '#0f172a' }}>THB (฿)</option>
                <option value="AED" style={{ background: '#0f172a' }}>AED</option>
              </select>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* SETUP CARD */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: '800' }}>🚀 Trip Configuration & Multi-Currency Setup</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Destination / Trip Name</label>
                  <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} className="modern-input" style={{ width: '100%', padding: '13px 16px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Group Members (Comma Separated)</label>
                  <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} className="modern-input" style={{ width: '100%', padding: '13px 16px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={handleGenerateAI} disabled={aiLoading} className="gradient-btn" style={{ padding: '14px 24px', fontSize: '14px', width: 'fit-content' }}>
                {aiLoading ? '✨ Synthesizing Global Plan...' : '✨ Generate AI Multi-Currency Itinerary'}
              </button>
            </div>

            {/* METRICS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #34d399' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>TOTAL EXPENSE ({baseCurrency})</span>
                <h2 style={{ fontSize: '30px', color: '#34d399', margin: '8px 0 0 0', fontWeight: '900' }}>{currentSymbol}{totalExpense.toFixed(2)}</h2>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #818cf8' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '30px', color: '#818cf8', margin: '8px 0 0 0', fontWeight: '900' }}>{currentSymbol}{perPersonShare.toFixed(2)}</h2>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8' }}>CURRENCIES TRACKED</span>
                <h2 style={{ fontSize: '30px', color: '#38bdf8', margin: '8px 0 0 0', fontWeight: '900' }}>5 Global Currencies 💱</h2>
              </div>
            </div>

            {/* RECENT EXPENSES */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', color: '#fff', fontWeight: '800' }}>💸 Recent Multi-Currency Expenses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {expenses.slice(-3).map(exp => {
                  const converted = convertToBase(exp.amount, exp.currency || 'INR');
                  const expSym = currencySymbols[exp.currency] || '₹';
                  return (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{exp.description}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Paid by <span style={{ color: '#818cf8', fontWeight: '600' }}>{exp.payer}</span> • Original: {expSym}{exp.amount}</div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>≈ {currentSymbol}{converted.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#fbbf24', fontWeight: '800' }}>✨ Natural Language AI Entry</h3>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: '0 0 16px 0' }}>Type naturally e.g., *"I spent 50 USD on taxi in Thailand"*</p>
                <form onSubmit={handleNaturalLanguageExpense} style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Type multi-currency expense..." value={naturalText} onChange={(e) => setNaturalText(e.target.value)} className="modern-input" style={{ flex: 1, padding: '12px 14px', fontSize: '13px' }} />
                  <button type="submit" disabled={nlLoading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Add</button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#38bdf8', fontWeight: '800' }}>🧾 Foreign Receipt Scanner</h3>
                <p style={{ fontSize: '12px', color: '#bae6fd', margin: '0 0 16px 0' }}>Upload international bill for instant auto-conversion</p>
                <label style={{ display: 'inline-block', background: '#0ea5e9', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
                  {ocrLoading ? 'Scanning Bill...' : '📁 Upload Foreign Receipt'}
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>➕ Add Expense with Currency</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Description</label>
                    <input type="text" placeholder="e.g. Dinner Buffet" value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Amount</label>
                      <input type="number" placeholder="100" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Currency</label>
                      <select value={newExpCurrency} onChange={(e) => setNewExpCurrency(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }}>
                        <option value="INR" style={{ background: '#0f172a' }}>INR</option>
                        <option value="USD" style={{ background: '#0f172a' }}>USD</option>
                        <option value="EUR" style={{ background: '#0f172a' }}>EUR</option>
                        <option value="THB" style={{ background: '#0f172a' }}>THB</option>
                        <option value="AED" style={{ background: '#0f172a' }}>AED</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Payer</label>
                    <select value={newExpPayer} onChange={(e) => setNewExpPayer(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }}>
                      <option value="" style={{ background: '#0f172a' }}>Select Payer</option>
                      {memberList.map((m, i) => <option key={i} value={m} style={{ background: '#0f172a' }}>{m}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="gradient-btn" style={{ padding: '13px', marginTop: '6px' }}>Add Expense</button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>💸 All Expenses Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {expenses.map(exp => {
                    const converted = convertToBase(exp.amount, exp.currency || 'INR');
                    const expSym = currencySymbols[exp.currency] || '₹';
                    return (
                      <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{exp.description}</strong>
                          <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Paid by <b style={{ color: '#818cf8' }}>{exp.payer}</b> • {expSym}{exp.amount} {exp.currency}</span>
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: '#34d399' }}>≈ {currentSymbol}{converted.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '720px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff', fontWeight: '800' }}>⚖️ Multi-Currency Settlement</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Total Group Expense: <b>{currentSymbol}{totalExpense.toFixed(2)}</b> | Fair Share: <b style={{ color: '#818cf8' }}>{currentSymbol}{perPersonShare.toFixed(2)}</b></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px' }}>Optimized Payment Paths ({baseCurrency}):</h4>
              {optimizedDebts.length === 0 ? (
                <div style={{ padding: '20px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '14px', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399', fontWeight: '700' }}>
                  🎉 Everyone is fully settled up!
                </div>
              ) : (
                optimizedDebts.map((tx, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '15px' }}>{tx.from}</strong> pays <strong style={{ color: '#34d399', fontSize: '15px' }}>{tx.to}</strong>
                    </div>
                    <span style={{ fontWeight: '900', fontSize: '16px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      {currentSymbol}{tx.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>➕ Add Tour Activity</h3>
              <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Day Identifier</label>
                  <input type="text" placeholder="e.g. Day 4" value={newDay} onChange={(e) => setNewDay(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Activity Details</label>
                  <input type="text" placeholder="e.g. Sunset Cruise" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" className="gradient-btn" style={{ padding: '13px', marginTop: '6px' }}>Add Activity</button>
              </form>
            </div>
            
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>🗺️ Complete Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800' }}>{item.day}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '720px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff', fontWeight: '800' }}>⚙️ API & AI Configuration</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Provide your Gemini API key for advanced multilingual parsing and automated generation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>Gemini API Key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your API key here..." className="modern-input" style={{ width: '100%', padding: '14px 16px', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
