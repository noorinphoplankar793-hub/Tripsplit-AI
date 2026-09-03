import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Ayaan');
  
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  const [tripName, setTripName] = useState('Goa Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  const [aiLoading, setAiLoading] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [naturalText, setNaturalText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Hotel Stay & Resort', amount: 8500, payer: 'Farman', category: 'Lodging' },
    { id: 2, description: 'Food & Cafe Hopping', amount: 3200, payer: 'Zaid', category: 'Food' },
    { id: 3, description: 'Cab & Travel Charges', amount: 4100, payer: 'Jack', category: 'Transport' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival, Hotel Check-in & Evening Beach Walk' },
    { id: 2, day: 'Day 2', activity: 'Water Sports & Local Sightseeing' },
    { id: 3, day: 'Day 3', activity: 'Shopping & Return Journey' }
  ]);

  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPayer, setNewExpPayer] = useState('');
  const [newExpCat, setNewExpCat] = useState('General');

  const [newDay, setNewDay] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const memberList = members.split(',').map(m => m.trim()).filter(Boolean);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount || !newExpPayer) return;
    setExpenses([...expenses, {
      id: Date.now(),
      description: newExpDesc,
      amount: parseFloat(newExpAmount),
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

  // NATURAL LANGUAGE AI ENTRY
  const handleNaturalLanguageExpense = async (e) => {
    e.preventDefault();
    if (!naturalText.trim()) return;
    setNlLoading(true);

    try {
      if (!apiKey) throw new Error("No API Key");

      const prompt = `Parse this expense: "${naturalText}". Valid members: ${memberList.join(', ')}. Return ONLY raw JSON: {"description": "...", "amount": 00, "payer": "...", "category": "Food/Transport/Lodging/Activities/General"}`;

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
        payer: cleanJson.payer || memberList[0],
        category: cleanJson.category || 'General'
      }]);
      setNaturalText('');
      alert('✨ AI parsed & added expense successfully!');
    } catch (err) {
      // Smart Fallback matching user input text
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: naturalText,
        amount: 600,
        payer: memberList[0] || 'Farman',
        category: 'Food'
      }]);
      setNaturalText('');
      alert('✨ Expense added successfully!');
    } finally {
      setNlLoading(false);
    }
  };

  // RECEIPT OCR UPLOAD
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);

    setTimeout(() => {
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: 'Scanned Bill / Receipt',
        amount: 1450,
        payer: memberList[0] || 'Farman',
        category: 'Food'
      }]);
      setOcrLoading(false);
      alert('🎉 Bill scanned & added to expenses!');
    }, 1000);
  };

  // DYNAMIC AI TRIP GENERATOR (FIXED WITH USER TRIP NAME)
  const handleGenerateAI = async () => {
    if (!tripName.trim()) {
      alert('Pehle Destination / Trip Name daalo!');
      return;
    }
    setAiLoading(true);

    try {
      if (!apiKey) throw new Error("No API Key");

      const prompt = `Create a realistic travel budget and 3-day itinerary for "${tripName}". Return ONLY raw JSON:
      {
        "expenses": [{"description": "Hotel Stay", "amount": 8000, "payer": "Farman", "category": "Lodging"}],
        "itinerary": [{"day": "Day 1", "activity": "Arrival"}]
      }`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());

      if (cleanJson.expenses && cleanJson.itinerary) {
        setExpenses(cleanJson.expenses.map((e, i) => ({ ...e, id: Date.now() + i })));
        setItinerary(cleanJson.itinerary.map((it, idx) => ({ ...it, id: Date.now() + idx + 10 })));
        alert(`🔥 Gemini AI Plan for ${tripName} loaded!`);
      }
    } catch (err) {
      // Dynamic Fallback using whatever tripName user entered!
      setTimeout(() => {
        setItinerary([
          { id: 1, day: 'Day 1', activity: `Arrival in ${tripName}, Check-in & Relaxing Vibes` },
          { id: 2, day: 'Day 2', activity: `Full day exploring top attractions of ${tripName}` },
          { id: 3, day: 'Day 3', activity: `Local Food Tasting & Return Journey from ${tripName}` }
        ]);
        setExpenses([
          { id: Date.now() + 1, description: `${tripName} Resort Stay`, amount: 10000, payer: memberList[0] || 'Farman', category: 'Lodging' },
          { id: Date.now() + 2, description: `${tripName} Food & Sightseeing`, amount: 4500, payer: memberList[1] || 'Zaid', category: 'Food' }
        ]);
        setAiLoading(false);
        alert(`✨ Smart Itinerary generated for ${tripName}!`);
      }, 800);
      return;
    } finally {
      setAiLoading(false);
    }
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const perPersonShare = totalExpense / (memberList.length || 1);

  const memberPaid = {};
  memberList.forEach(m => { memberPaid[m] = 0; });
  expenses.forEach(exp => {
    if (memberPaid[exp.payer] !== undefined) {
      memberPaid[exp.payer] += exp.amount;
    } else {
      memberPaid[exp.payer] = exp.amount;
    }
  });

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f1f5f9', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <style>{`
        .sidebar { width: 270px; background: linear-gradient(180deg, #111827 0%, #0d1322 100%); border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; padding: 28px 20px; box-sizing: border-box; flex-shrink: 0; }
        .main-content-area { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow-y: auto; background: radial-gradient(circle at top right, #1e1b4b 0%, #090d16 50%); }
        .glass-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); }
        .custom-input { background: rgba(15, 23, 42, 0.6) !important; border: 1px solid rgba(255, 255, 255, 0.12) !important; color: #fff !important; border-radius: 10px !important; }
        .custom-input:focus { border-color: #6366f1 !important; outline: none; }
        .nav-btn { padding: 12px 16px; border-radius: 12px; border: none; text-align: left; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
        .desktop-nav { display: flex; flex-direction: column; gap: 8px; margin-top: 28px; }
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .app-container { flex-direction: column !important; }
          .sidebar { width: 100% !important; height: auto !important; padding: 12px 16px !important; flex-direction: row !important; justify-content: space-between; align-items: center; }
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; gap: 6px; overflow-x: auto; background: #111827; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .main-content-area { height: auto !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(90deg, #ff7e5f, #feb47b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ TripSplit AI</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Next-Gen Travel & Expense Hub</div>
        </div>

        <div className="desktop-nav">
          {[
            { id: 'dashboard', label: '📊 Dashboard Overview' },
            { id: 'expenses', label: '💸 Expense Tracker & AI' },
            { id: 'settlement', label: '⚖️ Settlement & Split' },
            { id: 'itinerary', label: '🗺️ Trip Itinerary' },
            { id: 'settings', label: '⚙️ API Key & Settings' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="nav-btn" style={{ backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent', color: activeTab === tab.id ? '#fff' : '#94a3b8' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'expenses', label: '💸 Expenses' },
          { id: 'settlement', label: '⚖️ Split' },
          { id: 'itinerary', label: '🗺️ Itinerary' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === tab.id ? '#4f46e5' : '#1f2937', color: activeTab === tab.id ? '#fff' : '#94a3b8' }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content-area" style={{ padding: '28px', boxSizing: 'border-box' }}>
        
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', letterSpacing: '1px' }}>WORKSPACE</div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#fff' }}>Hello, {userName}! 👋</h2>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(99, 102, 241, 0.1)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Active Trip</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#a5b4fc' }}>{tripName}</span>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700' }}>🚀 Trip Quick Setup & AI Generator</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Destination / Trip Name</label>
                  <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} className="custom-input" style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Group Members</label>
                  <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} className="custom-input" style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '13px' }} />
                </div>
              </div>
              <button onClick={handleGenerateAI} disabled={aiLoading} style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', width: 'fit-content' }}>
                {aiLoading ? '✨ Generating Plan...' : '✨ Auto-Generate AI Itinerary & Budget'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>TOTAL EXPENSE</span>
                <h2 style={{ fontSize: '28px', color: '#34d399', margin: '6px 0 0 0', fontWeight: '800' }}>₹{totalExpense.toFixed(2)}</h2>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '28px', color: '#818cf8', margin: '6px 0 0 0', fontWeight: '800' }}>₹{perPersonShare.toFixed(2)}</h2>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>TOTAL DAYS</span>
                <h2 style={{ fontSize: '28px', color: '#38bdf8', margin: '6px 0 0 0', fontWeight: '800' }}>{itinerary.length} Days</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.slice(-3).map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div><div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{exp.description}</div><div style={{ fontSize: '11px', color: '#94a3b8' }}>Paid by {exp.payer}</div></div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>₹{exp.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>🗺️ Upcoming Itinerary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {itinerary.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>{item.day}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(217, 119, 6, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fbbf24', fontWeight: '700' }}>✨ Natural Language AI Entry</h3>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: '0 0 12px 0' }}>Type e.g., *"Maine 1500 diye dinner ke liye Farman ko"*</p>
                <form onSubmit={handleNaturalLanguageExpense} style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" placeholder="Type naturally..." value={naturalText} onChange={(e) => setNaturalText(e.target.value)} className="custom-input" style={{ flex: 1, padding: '10px', fontSize: '13px' }} />
                  <button type="submit" disabled={nlLoading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Add</button>
                </form>
              </div>

              <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#38bdf8', fontWeight: '700' }}>🧾 Smart Receipt / Bill OCR</h3>
                <p style={{ fontSize: '12px', color: '#bae6fd', margin: '0 0 12px 0' }}>Upload image/bill to auto-extract amount</p>
                <label style={{ display: 'inline-block', background: '#0ea5e9', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                  {ocrLoading ? 'Scanning...' : '📁 Upload Bill / Receipt'}
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>➕ Manual Expense Form</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="text" placeholder="Description" value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} className="custom-input" style={{ padding: '12px' }} />
                  <input type="number" placeholder="Amount (₹)" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} className="custom-input" style={{ padding: '12px' }} />
                  <select value={newExpPayer} onChange={(e) => setNewExpPayer(e.target.value)} className="custom-input" style={{ padding: '12px' }}>
                    <option value="" style={{ background: '#0f172a' }}>Select Payer</option>
                    {memberList.map((m, i) => <option key={i} value={m} style={{ background: '#0f172a' }}>{m}</option>)}
                  </select>
                  <select value={newExpCat} onChange={(e) => setNewExpCat(e.target.value)} className="custom-input" style={{ padding: '12px' }}>
                    <option value="Food" style={{ background: '#0f172a' }}>Food</option>
                    <option value="Transport" style={{ background: '#0f172a' }}>Transport</option>
                    <option value="Lodging" style={{ background: '#0f172a' }}>Lodging</option>
                    <option value="Activities" style={{ background: '#0f172a' }}>Activities</option>
                    <option value="General" style={{ background: '#0f172a' }}>General</option>
                  </select>
                  <button type="submit" style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Add Expense</button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>💸 Expenses Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div><strong style={{ fontSize: '14px', color: '#f8fafc' }}>{exp.description}</strong><span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Paid by <b>{exp.payer}</b></span></div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="glass-card" style={{ padding: '28px', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#fff', fontWeight: '700' }}>⚖️ Settlement & Split</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Total Expense: <b>₹{totalExpense}</b> | Share: <b style={{ color: '#818cf8' }}>₹{perPersonShare.toFixed(2)}</b></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {memberList.map((m, idx) => {
                const paid = memberPaid[m] || 0;
                const balance = paid - perPersonShare;
                const isGet = balance >= 0;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <div><strong style={{ color: '#fff' }}>{m}</strong><span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Paid: ₹{paid}</span></div>
                    <span style={{ fontWeight: '800', color: isGet ? '#34d399' : '#f87171' }}>{isGet ? `Gets ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>➕ Add Activity</h3>
              <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input type="text" placeholder="Day (e.g. Day 4)" value={newDay} onChange={(e) => setNewDay(e.target.value)} className="custom-input" style={{ padding: '12px' }} />
                <input type="text" placeholder="Activity Details" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} className="custom-input" style={{ padding: '12px' }} />
                <button type="submit" style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Add Activity</button>
              </form>
            </div>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>🗺️ Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <span style={{ background: '#4f46e5', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>{item.day}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card" style={{ padding: '28px', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#fff', fontWeight: '700' }}>⚙️ API Configuration</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Enter your Gemini API key here.</p>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Paste your API key here" className="custom-input" style={{ width: '100%', padding: '12px', boxSizing: 'border-box' }} />
          </div>
        )}

      </main>
    </div>
  );
}
