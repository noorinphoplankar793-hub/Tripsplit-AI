import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Ayaan');
  
  // 🔑 PERSISTENT API KEY
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });

  // Trip State
  const [tripName, setTripName] = useState('Kasol Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  const [aiLoading, setAiLoading] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [naturalText, setNaturalText] = useState('');

  // OCR Receipt/PDF State
  const [ocrLoading, setOcrLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(() => {
    localStorage.setItem('gemini_api_key', apiKey);
  }, [apiKey]);

  // Data State
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Hotel Stay & Resort', amount: 8500, payer: 'Farman', category: 'Lodging' },
    { id: 2, description: 'Food & Cafe Hopping', amount: 3200, payer: 'Zaid', category: 'Food' },
    { id: 3, description: 'Cab & Travel Charges', amount: 4100, payer: 'Jack', category: 'Transport' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival, Hotel Check-in & Evening Riverwalk' },
    { id: 2, day: 'Day 2', activity: 'Trek to Chalal & Tosh Village Exploration' },
    { id: 3, day: 'Day 3', activity: 'Sightseeing & Return Journey' }
  ]);

  // Form States
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

    if (!apiKey) {
      setTimeout(() => {
        setExpenses([...expenses, {
          id: Date.now(),
          description: naturalText,
          amount: 500,
          payer: memberList[0] || 'Farman',
          category: 'Food'
        }]);
        setNaturalText('');
        setNlLoading(false);
        alert('✨ Expense added! (Tip: Add your Gemini API key in Settings for real AI parsing)');
      }, 800);
      return;
    }

    try {
      const prompt = `Parse this expense statement: "${naturalText}". 
      The valid group members are: ${memberList.join(', ')}. 
      Return ONLY a raw JSON object with this exact schema (no markdown formatting, no backticks):
      {
        "description": "Short clean description of the expense",
        "amount": 00.0,
        "payer": "Name of the person who paid from the list above",
        "category": "One of: Food, Transport, Lodging, Activities, General"
      }`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());

      if (cleanJson.amount) {
        setExpenses(prev => [...prev, {
          id: Date.now(),
          description: cleanJson.description || naturalText,
          amount: parseFloat(cleanJson.amount) || 0,
          payer: cleanJson.payer || memberList[0] || 'Farman',
          category: cleanJson.category || 'General'
        }]);
        setNaturalText('');
        alert(`🎯 Parsed & Added: ${cleanJson.description} (₹${cleanJson.amount}) by ${cleanJson.payer}`);
      }
    } catch (err) {
      console.error(err);
      alert('AI Parsing Error! Please check your API key.');
    } finally {
      setNlLoading(false);
    }
  };

  // 📸 OCR RECEIPT / BILL SCANNER VIA GEMINI VISION
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result);
    };
    reader.readAsDataURL(file);

    if (!apiKey) {
      alert('⚠️ Please add your Gemini API Key in the Settings tab first to use AI Receipt OCR scanning!');
      return;
    }

    setOcrLoading(true);

    try {
      // Convert file to Base64
      const base64Data = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = error => reject(error);
        r.readAsDataURL(file);
      });

      const prompt = `Analyze this receipt/invoice image. Extract the total bill amount and a short description (like restaurant name or items). 
      The valid group members who could have paid are: ${memberList.join(', ')}. Guess the payer if mentioned or default to "${memberList[0]}".
      Return ONLY a raw JSON object with this exact schema (no markdown, no backticks):
      {
        "description": "Store or item name",
        "amount": 00.0,
        "payer": "${memberList[0]}",
        "category": "One of: Food, Transport, Lodging, Activities, General"
      }`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: file.type || 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      const data = await res.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());

      if (cleanJson.amount) {
        setExpenses(prev => [...prev, {
          id: Date.now(),
          description: cleanJson.description || 'Scanned Receipt',
          amount: parseFloat(cleanJson.amount) || 0,
          payer: cleanJson.payer || memberList[0],
          category: cleanJson.category || 'Food'
        }]);
        alert(`🎉 Receipt Scanned Successfully!\nAdded: ${cleanJson.description} - ₹${cleanJson.amount}`);
      }
    } catch (err) {
      console.error(err);
      alert('OCR Scanning failed! Make sure the image is clear and API key is correct.');
    } finally {
      setOcrLoading(false);
    }
  };

  // AUTO GEMINI AI TRIP PLANNER
  const handleGenerateAI = async () => {
    if (!tripName.trim()) {
      alert('Pehle Destination / Trip Name daalo!');
      return;
    }

    setAiLoading(true);

    if (!apiKey) {
      setTimeout(() => {
        setItinerary([
          { id: 1, day: 'Day 1', activity: `Arrival in ${tripName}, Check-in & Evening local market stroll` },
          { id: 2, day: 'Day 2', activity: `Full day ${tripName} Sightseeing & Popular Cafe Hopping` },
          { id: 3, day: 'Day 3', activity: `Souvenir Shopping & Return Journey from ${tripName}` }
        ]);
        setExpenses([
          { id: Date.now() + 1, description: `${tripName} Resort Stay`, amount: 9000, payer: 'Farman', category: 'Lodging' },
          { id: Date.now() + 2, description: `${tripName} Local Food & Cafe`, amount: 3500, payer: 'Zaid', category: 'Food' },
          { id: Date.now() + 3, description: 'Travel Expenses', amount: 4500, payer: 'Jack', category: 'Transport' }
        ]);
        setAiLoading(false);
        alert(`✨ Plan generated for ${tripName}! (Add API key in Settings for live AI generations)`);
      }, 1000);
      return;
    }

    try {
      const prompt = `Create a realistic travel budget and 3-day itinerary for a trip to "${tripName}". Return ONLY raw JSON object with this exact schema:
      {
        "expenses": [
          {"description": "Hotel Stay", "amount": 8000, "payer": "Farman", "category": "Lodging"},
          {"description": "Food & Cabs", "amount": 3500, "payer": "Zaid", "category": "Food"}
        ],
        "itinerary": [
          {"day": "Day 1", "activity": "Activity for day 1"},
          {"day": "Day 2", "activity": "Activity for day 2"},
          {"day": "Day 3", "activity": "Activity for day 3"}
        ]
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
        setItinerary(cleanJson.itinerary.map((i, idx) => ({ ...i, id: Date.now() + idx + 10 })));
        alert(`🔥 Live Gemini AI Plan for ${tripName} loaded!`);
      }
    } catch (err) {
      console.error(err);
      alert('API Error! Check your Gemini API key in Settings.');
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
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f1f5f9', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      
      <style>{`
        .sidebar {
          width: 270px;
          background: linear-gradient(180deg, #111827 0%, #0d1322 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          padding: 28px 20px;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
          background: radial-gradient(circle at top right, #1e1b4b 0%, #090d16 50%);
        }
        .glass-card {
          background: rgba(17, 24, 39, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
        }
        .custom-input {
          background: rgba(15, 23, 42, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: #fff !important;
          border-radius: 10px !important;
          transition: all 0.2s ease;
        }
        .custom-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
          outline: none;
        }
        .nav-btn {
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
        .desktop-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 28px;
        }
        .mobile-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .app-container {
            flex-direction: column !important;
          }
          .sidebar {
            width: 100% !important;
            height: auto !important;
            padding: 12px 16px !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: flex !important;
            gap: 6px;
            overflow-x: auto;
            background: #111827;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .main-content-area {
            height: auto !important;
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div style={{ fontSize: '22px', fontWeight: '900', background: 'linear-gradient(90deg, #ff7e5f, #feb47b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ TripSplit AI</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', letterSpacing: '0.5px' }}>Next-Gen Travel & Expense Hub</div>
        </div>

        <div className="desktop-nav">
          {[
            { id: 'dashboard', label: '📊 Dashboard Overview' },
            { id: 'expenses', label: '💸 Expense Tracker & AI' },
            { id: 'settlement', label: '⚖️ Settlement & Split' },
            { id: 'itinerary', label: '🗺️ Trip Itinerary' },
            { id: 'settings', label: '⚙️ API Key & Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="nav-btn"
              style={{
                backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
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
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#4f46e5' : '#1f2937',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content-area" style={{ padding: '28px', boxSizing: 'border-box' }}>
        
        {/* HEADER BAR */}
        <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', letterSpacing: '1px' }}>WORKSPACE</div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '800', color: '#fff' }}>Hello, {userName}! 👋</h2>
          </div>
          <div style={{ textAlign: 'right', background: 'rgba(99, 102, 241, 0.1)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Trip</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#a5b4fc' }}>{tripName}</span>
          </div>
        </div>

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* QUICK TRIP SETUP CARD */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700' }}>🚀 Trip Quick Setup & AI Generator</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Destination / Trip Name</label>
                  <input 
                    type="text" 
                    value={tripName} 
                    onChange={(e) => setTripName(e.target.value)}
                    className="custom-input"
                    style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Group Members (Comma Separated)</label>
                  <input 
                    type="text" 
                    value={members} 
                    onChange={(e) => setMembers(e.target.value)}
                    className="custom-input"
                    style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '13px' }}
                  />
                </div>
              </div>
              <button 
                onClick={handleGenerateAI}
                disabled={aiLoading}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: 'fit-content',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)'
                }}
              >
                {aiLoading ? '✨ Generating Smart Plan...' : '✨ Auto-Generate AI Itinerary & Budget'}
              </button>
            </div>

            {/* METRICS STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' }}>TOTAL EXPENSE</span>
                <h2 style={{ fontSize: '28px', color: '#34d399', margin: '6px 0 0 0', fontWeight: '800' }}>₹{totalExpense.toFixed(2)}</h2>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '28px', color: '#818cf8', margin: '6px 0 0 0', fontWeight: '800' }}>₹{perPersonShare.toFixed(2)}</h2>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' }}>TOTAL ITINERARY DAYS</span>
                <h2 style={{ fontSize: '28px', color: '#38bdf8', margin: '6px 0 0 0', fontWeight: '800' }}>{itinerary.length} Days</h2>
              </div>
            </div>

            {/* RECENT RECORDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.slice(-4).map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{exp.description}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Paid by {exp.payer} • <span style={{ color: '#818cf8', fontWeight: '600' }}>{exp.category}</span></div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>₹{exp.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>🗺️ Upcoming Itinerary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {itinerary.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', flexShrink: 0, border: '1px solid rgba(99, 102, 241, 0.3)' }}>{item.day}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPENSE TRACKER WITH AI & OCR */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* AI TOP BOXES (Natural Language + OCR Receipt Scanner) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              {/* Natural Language Box */}
              <div style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.05) 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', backdropFilter: 'blur(12px)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fbbf24', fontWeight: '700' }}>✨ Natural Language AI Entry</h3>
                <p style={{ fontSize: '12px', color: '#fde68a', margin: '0 0 12px 0' }}>Type e.g., *"Maine 1500 diye dinner ke liye Farman ko"*</p>
                <form onSubmit={handleNaturalLanguageExpense} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Type naturally..." 
                    value={naturalText} 
                    onChange={(e) => setNaturalText(e.target.value)}
                    className="custom-input"
                    style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  />
                  <button 
                    type="submit" 
                    disabled={nlLoading}
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                  >
                    {nlLoading ? '...' : 'Add'}
                  </button>
                </form>
              </div>

              {/* OCR Receipt / Bill Scanner Box */}
              <div style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.05) 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(12px)' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#38bdf8', fontWeight: '700' }}>🧾 Smart Receipt / Bill OCR</h3>
                <p style={{ fontSize: '12px', color: '#bae6fd', margin: '0 0 12px 0' }}>Upload image/bill to auto-extract amount & items</p>
                
                <label style={{ 
                  display: 'inline-block', 
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', 
                  color: '#fff', 
                  padding: '10px 18px', 
                  borderRadius: '10px', 
                  fontWeight: '700', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                }}>
                  {ocrLoading ? 'Scanning Bill with AI...' : '📁 Upload Bill / Receipt'}
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} />
                </label>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>➕ Manual Expense Form</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input 
                    type="text" 
                    placeholder="Description (e.g. Dinner at Cafe)" 
                    value={newExpDesc} 
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    className="custom-input"
                    style={{ padding: '12px', fontSize: '14px' }}
                  />
                  <input 
                    type="number" 
                    placeholder="Amount (₹)" 
                    value={newExpAmount} 
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    className="custom-input"
                    style={{ padding: '12px', fontSize: '14px' }}
                  />
                  <select 
                    value={newExpPayer} 
                    onChange={(e) => setNewExpPayer(e.target.value)}
                    className="custom-input"
                    style={{ padding: '12px', fontSize: '14px' }}
                  >
                    <option value="" style={{ background: '#0f172a' }}>Select Payer</option>
                    {memberList.map((m, i) => <option key={i} value={m} style={{ background: '#0f172a' }}>{m}</option>)}
                  </select>
                  <select 
                    value={newExpCat} 
                    onChange={(e) => setNewExpCat(e.target.value)}
                    className="custom-input"
                    style={{ padding: '12px', fontSize: '14px' }}
                  >
                    <option value="Food" style={{ background: '#0f172a' }}>Food</option>
                    <option value="Transport" style={{ background: '#0f172a' }}>Transport</option>
                    <option value="Lodging" style={{ background: '#0f172a' }}>Lodging</option>
                    <option value="Activities" style={{ background: '#0f172a' }}>Activities</option>
                    <option value="General" style={{ background: '#0f172a' }}>General</option>
                  </select>
                  <button type="submit" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)' }}>Add Expense</button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>💸 All Expenses Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{exp.description}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Paid by <b>{exp.payer}</b> • <span style={{ color: '#818cf8', fontWeight: '600' }}>{exp.category || 'General'}</span></span>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#34d399' }}>₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. SETTLEMENT */}
        {activeTab === 'settlement' && (
          <div className="glass-card" style={{ padding: '28px', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#fff', fontWeight: '700' }}>⚖️ Settlement & Bill Split</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Total Expense: <b style={{ color: '#fff' }}>₹{totalExpense}</b> | Individual Share: <b style={{ color: '#818cf8' }}>₹{perPersonShare.toFixed(2)}</b></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {memberList.map((m, idx) => {
                const paid = memberPaid[m] || 0;
                const balance = paid - perPersonShare;
                const isGet = balance >= 0;

                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{m}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Total Paid: ₹{paid}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: isGet ? '#34d399' : '#f87171' }}>
                        {isGet ? `Gets Back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. ITINERARY */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>➕ Add Activity</h3>
              <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input 
                  type="text" 
                  placeholder="Day (e.g. Day 4)" 
                  value={newDay} 
                  onChange={(e) => setNewDay(e.target.value)}
                  className="custom-input"
                  style={{ padding: '12px', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  placeholder="Activity Details" 
                  value={newActivity} 
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="custom-input"
                  style={{ padding: '12px', fontSize: '14px' }}
                />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)' }}>Add Activity</button>
              </form>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', fontWeight: '700' }}>🗺️ Full Trip Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ background: '#4f46e5', color: '#ffffff', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>{item.day}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-card" style={{ padding: '28px', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#fff', fontWeight: '700' }}>⚙️ Gemini API Configuration</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Enter your Gemini API key once to unlock AI OCR Receipt scanning and AI Trip Planning.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your AI Studio API key here"
                  className="custom-input"
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>
              <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399', fontSize: '12px', fontWeight: '600' }}>
                ✅ Key saved automatically in browser localStorage!
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
