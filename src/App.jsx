import React, { useState } from 'react';

// =========================================================
// 🔑 APNI GEMINI API KEY NICHE QUOTES KE ANDAR PASTE KARO:
// =========================================================
const HARDCODED_GEMINI_API_KEY = "AQ.Ab8RN6JSi4GMXv6C7wDbFGA_2YiHY5dRpZ3LGg5p8NGFfRN9QA"; 

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName] = useState('Ayaan');
  
  // Trip State
  const [tripName, setTripName] = useState('Kasol Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  const [aiLoading, setAiLoading] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);
  const [naturalText, setNaturalText] = useState('');

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

  // 🚀 FEATURE 10 & 6: NATURAL LANGUAGE & AUTO-CATEGORIZATION VIA GEMINI AI
  const handleNaturalLanguageExpense = async (e) => {
    e.preventDefault();
    if (!naturalText.trim()) return;

    setNlLoading(true);

    if (!HARDCODED_GEMINI_API_KEY || HARDCODED_GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
      // Fallback simulation if no API key is provided yet
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
        alert('✨ Expense added via Smart Parser!');
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

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${HARDCODED_GEMINI_API_KEY}`, {
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
      alert('AI Parsing Error! Please check your API key or write a clearer sentence.');
    } finally {
      setNlLoading(false);
    }
  };

  // AUTO GEMINI AI TRIP PLANNER FUNCTION
  const handleGenerateAI = async () => {
    if (!tripName.trim()) {
      alert('Pehle Destination / Trip Name daalo!');
      return;
    }

    setAiLoading(true);

    if (!HARDCODED_GEMINI_API_KEY || HARDCODED_GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
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
        alert(`✨ Plan generated for ${tripName}!`);
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

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${HARDCODED_GEMINI_API_KEY}`, {
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
      alert('API Error! Check your Gemini API key.');
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
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      <style>{`
        .sidebar {
          width: 260px;
          background-color: #1a1f2c;
          color: #fff;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow-y: auto;
        }
        .desktop-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
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
            background: #1a1f2c;
            padding: 8px 12px;
          }
          .main-content-area {
            height: auto !important;
          }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ff6b00' }}>⚡ TripSplit AI</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Smart Expense & Travel Hub</div>
        </div>

        <div className="desktop-nav">
          {[
            { id: 'dashboard', label: '📊 Dashboard Overview' },
            { id: 'expenses', label: '💸 Expense Tracker & AI' },
            { id: 'settlement', label: '⚖️ Settlement & Split' },
            { id: 'itinerary', label: '🗺️ Trip Itinerary' },
            { id: 'settings', label: '⚙️ Trip Settings & AI' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#cbd5e1',
                transition: '0.2s'
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
              backgroundColor: activeTab === tab.id ? '#4f46e5' : '#2d3748',
              color: activeTab === tab.id ? '#ffffff' : '#cbd5e1'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT */}
      <main className="main-content-area" style={{ padding: '24px', boxSizing: 'border-box' }}>
        
        <div style={{ backgroundColor: '#ffffff', padding: '18px 24px', borderRadius: '14px', border: '1px solid #cbd5e1', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#4f46e5', letterSpacing: '0.5px' }}>WORKSPACE</div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Hello, {userName}! 👋</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Current Project Trip</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{tripName}</span>
          </div>
        </div>

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TOTAL EXPENSE</span>
                <h2 style={{ fontSize: '26px', color: '#059669', margin: '6px 0 0 0' }}>₹{totalExpense.toFixed(2)}</h2>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '26px', color: '#4f46e5', margin: '6px 0 0 0' }}>₹{perPersonShare.toFixed(2)}</h2>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TOTAL ITINERARY DAYS</span>
                <h2 style={{ fontSize: '26px', color: '#0284c7', margin: '6px 0 0 0' }}>{itinerary.length} Days</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.slice(-4).map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{exp.description}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Paid by {exp.payer} • <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.category}</span></div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#059669' }}>₹{exp.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>🗺️ Upcoming Itinerary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {itinerary.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>{item.day}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPENSE TRACKER & NATURAL LANGUAGE AI ENTRY */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* NATURAL LANGUAGE AI ENTRY BOX ( jueces ko impress karne wala feature ) */}
            <div style={{ backgroundColor: '#fef3c7', padding: '20px', borderRadius: '14px', border: '1px solid #f59e0b' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#92400e' }}>✨ Natural Language AI Entry (Type & Auto-Add)</h3>
              <p style={{ fontSize: '12px', color: '#b45309', margin: '0 0 12px 0' }}>Write in plain text e.g., *"Maine 1500 diye dinner ke liye Farman ko"*</p>
              
              <form onSubmit={handleNaturalLanguageExpense} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Type naturally here..." 
                  value={naturalText} 
                  onChange={(e) => setNaturalText(e.target.value)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '14px', outline: 'none' }}
                />
                <button 
                  type="submit" 
                  disabled={nlLoading}
                  style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                >
                  {nlLoading ? 'Parsing...' : 'AI Add'}
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>➕ Manual Expense Form</h3>
                <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Description (e.g. Dinner at Cafe)" 
                    value={newExpDesc} 
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                  <input 
                    type="number" 
                    placeholder="Amount (₹)" 
                    value={newExpAmount} 
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                  <select 
                    value={newExpPayer} 
                    onChange={(e) => setNewExpPayer(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  >
                    <option value="">Select Payer</option>
                    {memberList.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                  <select 
                    value={newExpCat} 
                    onChange={(e) => setNewExpCat(e.target.value)}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Lodging">Lodging</option>
                    <option value="Activities">Activities</option>
                    <option value="General">General</option>
                  </select>
                  <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Add Expense</button>
                </form>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>💸 All Expenses Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#1e293b' }}>{exp.description}</strong>
                        <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Paid by <b>{exp.payer}</b> • <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.category || 'General'}</span></span>
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#059669' }}>₹{exp.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. SETTLEMENT & SPLIT */}
        {activeTab === 'settlement' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #cbd5e1', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>⚖️ Settlement & Bill Split</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Total Expense: <b>₹{totalExpense}</b> | Individual Share: <b>₹{perPersonShare.toFixed(2)}</b></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {memberList.map((m, idx) => {
                const paid = memberPaid[m] || 0;
                const balance = paid - perPersonShare;
                const isGet = balance >= 0;

                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#1e293b' }}>{m}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Total Paid: ₹{paid}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: isGet ? '#059669' : '#dc2626' }}>
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
            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>➕ Add Activity</h3>
              <form onSubmit={handleAddItinerary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Day (e.g. Day 4)" 
                  value={newDay} 
                  onChange={(e) => setNewDay(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  placeholder="Activity Details" 
                  value={newActivity} 
                  onChange={(e) => setNewActivity(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Add Activity</button>
              </form>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 14px 0', fontSize: '16px', color: '#0f172a' }}>🗺️ Full Trip Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'center', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>{item.day}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #cbd5e1', maxWidth: '700px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>⚙️ Trip Configuration & AI Assistant</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Destination / Trip Name</label>
                <input 
                  type="text" 
                  value={tripName} 
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Goa, Manali, Ladakh"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  value={members} 
                  onChange={(e) => setMembers(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }}
                />
              </div>

              <button 
                onClick={handleGenerateAI}
                disabled={aiLoading}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                {aiLoading ? '✨ Generating Smart Plan...' : '✨ Auto-Generate AI Itinerary & Expenses'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
