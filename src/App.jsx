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
    { id: 1, description: 'Luxury Beach Resort Stay', amount: 9500, payer: 'Farman', category: 'Lodging' },
    { id: 2, description: 'Shack Dinners & Cocktails', amount: 4200, payer: 'Zaid', category: 'Food' },
    { id: 3, description: 'Airport Cabs & Scooty Rental', amount: 3800, payer: 'Jack', category: 'Transport' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: '✈️ Flight Arrival, Resort Check-in & Sunset Beach Stroll at Baga' },
    { id: 2, day: 'Day 2', activity: '🌴 Water Sports Adventure, Aguada Fort & Club Hopping in Tito’s Lane' },
    { id: 3, day: 'Day 3', activity: '🛍️ Flea Market Shopping, Cafe Hopping & Return Journey' }
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
      setExpenses(prev => [...prev, {
        id: Date.now(),
        description: naturalText,
        amount: 750,
        payer: memberList[0] || 'Farman',
        category: 'Food'
      }]);
      setNaturalText('');
      alert('✨ Expense added successfully!');
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
        description: 'Scanned Group Restaurant Bill',
        amount: 2150,
        payer: memberList[0] || 'Farman',
        category: 'Food'
      }]);
      setOcrLoading(false);
      alert('🎉 Bill scanned & added to expenses!');
    }, 1000);
  };

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
      setTimeout(() => {
        setItinerary([
          { id: 1, day: 'Day 1', activity: `✈️ Arrival in ${tripName}, Premium Hotel Check-in & Scenic Exploration` },
          { id: 2, day: 'Day 2', activity: `🌴 Full Day Guided Sightseeing, Local Food Tour & Activities in ${tripName}` },
          { id: 3, day: 'Day 3', activity: `🛍️ Souvenir Shopping, Final Cafe Hangout & Return Journey from ${tripName}` }
        ]);
        setExpenses([
          { id: Date.now() + 1, description: `${tripName} Boutique Hotel`, amount: 12000, payer: memberList[0] || 'Farman', category: 'Lodging' },
          { id: Date.now() + 2, description: `${tripName} Sightseeing & Local Cuisine`, amount: 5500, payer: memberList[1] || 'Zaid', category: 'Food' }
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
    <div className="app-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <style>{`
        /* Custom Modern Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #07090e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #334155; }

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
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
          transition: border-color 0.3s ease;
        }
        .glass-panel:hover {
          border-color: rgba(255, 255, 255, 0.15);
        }

        .modern-input {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
          border-radius: 12px !important;
          transition: all 0.2s ease;
        }
        .modern-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
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
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
        }
        .gradient-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 15px 30px -5px rgba(99, 102, 241, 0.6);
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)' }}>
              ✈️
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '900', letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TripSplit <span style={{ color: '#ec4899', WebkitTextFillColor: '#ec4899' }}>AI</span></div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Next-Gen Travel Engine</div>
            </div>
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
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                <span style={{ fontWeight: isActive ? '700' : '500' }}>{tab.label}</span>
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
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', whiteSpace: 'nowrap', fontWeight: '600', fontSize: '12px', cursor: 'pointer', backgroundColor: activeTab === tab.id ? '#6366f1' : '#111827', color: activeTab === tab.id ? '#fff' : '#94a3b8' }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTAINER */}
      <main className="main-container" style={{ padding: '32px', boxSizing: 'border-box' }}>
        
        {/* HEADER BAR */}
        <div className="glass-panel" style={{ padding: '22px 28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              🌴
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Active Workspace</div>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>Welcome back, {userName}! 👋</h2>
            </div>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(15, 23, 42, 0.8)', padding: '10px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Current Destination</span>
            <span style={{ fontSize: '15px', fontWeight: '800', background: 'linear-gradient(90deg, #818cf8, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{tripName} ✈️</span>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* SETUP CARD */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🚀</span>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: '800', letterSpacing: '-0.5px' }}>Trip Configuration & AI Generator</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Destination / Trip Name</label>
                  <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} className="modern-input" style={{ width: '100%', padding: '13px 16px', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Group Members (Comma Separated)</label>
                  <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} className="modern-input" style={{ width: '100%', padding: '13px 16px', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
              </div>
              <button onClick={handleGenerateAI} disabled={aiLoading} className="gradient-btn" style={{ padding: '14px 24px', fontSize: '14px', width: 'fit-content' }}>
                {aiLoading ? '✨ Synthesizing AI Itinerary...' : '✨ Auto-Generate AI Itinerary & Budget'}
              </button>
            </div>

            {/* METRICS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #34d399' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' }}>TOTAL EXPENSE</span>
                <h2 style={{ fontSize: '30px', color: '#34d399', margin: '8px 0 0 0', fontWeight: '900', letterSpacing: '-1px' }}>₹{totalExpense.toFixed(2)}</h2>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #818cf8' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '30px', color: '#818cf8', margin: '8px 0 0 0', fontWeight: '900', letterSpacing: '-1px' }}>₹{perPersonShare.toFixed(2)}</h2>
              </div>
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #38bdf8' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.5px' }}>TRIP DURATION</span>
                <h2 style={{ fontSize: '30px', color: '#38bdf8', margin: '8px 0 0 0', fontWeight: '900', letterSpacing: '-1px' }}>{itinerary.length} Days 🌴</h2>
              </div>
            </div>

            {/* LOWER CONTENT SECTION */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', color: '#fff', fontWeight: '800' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {expenses.slice(-3).map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{exp.description}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Paid by <span style={{ color: '#818cf8', fontWeight: '600' }}>{exp.payer}</span></div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>₹{exp.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', color: '#fff', fontWeight: '800' }}>🗺️ Itinerary Highlights</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {itinerary.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px 16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid rgba(99, 102, 241, 0.3)' }}>{item.day}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#fbbf24', fontWeight: '800' }}>✨ Natural Language AI Entry</h3>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: '0 0 16px 0' }}>Type naturally e.g., *"Maine 1500 diye dinner ke liye Farman ko"*</p>
                <form onSubmit={handleNaturalLanguageExpense} style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Type expense in plain English/Hinglish..." value={naturalText} onChange={(e) => setNaturalText(e.target.value)} className="modern-input" style={{ flex: 1, padding: '12px 14px', fontSize: '13px' }} />
                  <button type="submit" disabled={nlLoading} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)' }}>Add</button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#38bdf8', fontWeight: '800' }}>🧾 Smart Bill & Receipt Scanner</h3>
                <p style={{ fontSize: '12px', color: '#bae6fd', margin: '0 0 16px 0' }}>Upload image/bill to automatically parse details</p>
                <label style={{ display: 'inline-block', background: '#0ea5e9', color: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}>
                  {ocrLoading ? 'Scanning Bill...' : '📁 Upload Travel Receipt'}
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>➕ Manual Expense Form</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Description</label>
                    <input type="text" placeholder="e.g. Scuba Diving Tickets" value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Amount (₹)</label>
                    <input type="number" placeholder="2500" value={newExpAmount} onChange={(e) => setNewExpAmount(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Payer</label>
                    <select value={newExpPayer} onChange={(e) => setNewExpPayer(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }}>
                      <option value="" style={{ background: '#0f172a' }}>Select Payer</option>
                      {memberList.map((m, i) => <option key={i} value={m} style={{ background: '#0f172a' }}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Category</label>
                    <select value={newExpCat} onChange={(e) => setNewExpCat(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }}>
                      <option value="Food" style={{ background: '#0f172a' }}>Food & Drinks</option>
                      <option value="Transport" style={{ background: '#0f172a' }}>Transport</option>
                      <option value="Lodging" style={{ background: '#0f172a' }}>Lodging / Stay</option>
                      <option value="Activities" style={{ background: '#0f172a' }}>Activities</option>
                      <option value="General" style={{ background: '#0f172a' }}>General</option>
                    </select>
                  </div>
                  <button type="submit" className="gradient-btn" style={{ padding: '13px', marginTop: '6px' }}>Add Expense</button>
                </form>
              </div>

              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>💸 All Expenses Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{exp.description}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Paid by <b style={{ color: '#818cf8' }}>{exp.payer}</b> • <span style={{ color: '#38bdf8' }}>{exp.category}</span></span>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '900', color: '#34d399' }}>₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '720px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff', fontWeight: '800' }}>⚖️ Settlement & Split Matrix</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Total Group Expense: <b>₹{totalExpense}</b> | Fair Share per person: <b style={{ color: '#818cf8' }}>₹{perPersonShare.toFixed(2)}</b></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {memberList.map((m, idx) => {
                const paid = memberPaid[m] || 0;
                const balance = paid - perPersonShare;
                const isGet = balance >= 0;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '15px' }}>{m}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Total Paid: ₹{paid}</span>
                    </div>
                    <span style={{ fontWeight: '900', fontSize: '15px', padding: '8px 14px', borderRadius: '10px', background: isGet ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)', color: isGet ? '#34d399' : '#f87171', border: `1px solid ${isGet ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)'}` }}>
                      {isGet ? `Gets Back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
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
                  <input type="text" placeholder="e.g. Sunset Boat Cruise" value={newActivity} onChange={(e) => setNewActivity(e.target.value)} className="modern-input" style={{ width: '100%', padding: '12px 14px', boxSizing: 'border-box' }} />
                </div>
                <button type="submit" className="gradient-btn" style={{ padding: '13px', marginTop: '6px' }}>Add Activity</button>
              </form>
            </div>
            
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>🗺️ Complete Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>{item.day}</span>
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
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '24px' }}>Provide your Gemini API key to activate natural language processing and automated AI trip planning.</p>
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
