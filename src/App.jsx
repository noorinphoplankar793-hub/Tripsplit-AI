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

  // Data State
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Hotel Stay & Resort', amount: 8500, payer: 'Farman' },
    { id: 2, description: 'Food & Cafe Hopping', amount: 3200, payer: 'Zaid' },
    { id: 3, description: 'Cab & Travel Charges', amount: 4100, payer: 'Jack' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival, Hotel Check-in & Evening Riverwalk' },
    { id: 2, day: 'Day 2', activity: 'Trek to Chalal & Tosh Village Exploration' },
    { id: 3, day: 'Day 3', activity: 'Sightseeing & Return Journey' }
  ]);

  // Form States for Adding Items Manually
  const [newExpDesc, setNewExpDesc] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPayer, setNewExpPayer] = useState('');

  const [newDay, setNewDay] = useState('');
  const [newActivity, setNewActivity] = useState('');

  // Handlers for Manual Add
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpDesc || !newExpAmount || !newExpPayer) return;
    setExpenses([...expenses, {
      id: Date.now(),
      description: newExpDesc,
      amount: parseFloat(newExpAmount),
      payer: newExpPayer
    }]);
    setNewExpDesc('');
    setNewExpAmount('');
    setNewExpPayer('');
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

  // AUTO GEMINI AI FUNCTION
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
          { id: Date.now() + 1, description: `${tripName} Resort Stay`, amount: 9000, payer: 'Farman' },
          { id: Date.now() + 2, description: `${tripName} Local Food & Cafe`, amount: 3500, payer: 'Zaid' },
          { id: Date.now() + 3, description: 'Travel Expenses', amount: 4500, payer: 'Jack' }
        ]);
        setAiLoading(false);
        alert(`✨ Plan generated for ${tripName}! (API key dali hogi toh live AI se aayega)`);
      }, 1000);
      return;
    }

    try {
      const prompt = `Create a realistic travel budget and 3-day itinerary for a trip to "${tripName}". Return ONLY raw JSON object with this exact schema:
      {
        "expenses": [
          {"description": "Hotel Stay", "amount": 8000, "payer": "Farman"},
          {"description": "Food & Cabs", "amount": 3500, "payer": "Zaid"}
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
        alert(`🔥 Live Gemini AI Plan for ${tripName} loaded across all tabs!`);
      }
    } catch (err) {
      console.error(err);
      alert('API Error! Check if your Gemini API key is correctly pasted in the code.');
    } finally {
      setAiLoading(false);
    }
  };

  // Split Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
  const perPersonShare = totalExpense / (memberList.length || 1);

  // Paid per member
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '260px', backgroundColor: '#1a1f2c', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#ff6b00', marginBottom: '8px' }}>⚡ TripSplit AI</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '28px' }}>Smart Expense & Travel Hub</div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard Overview' },
              { id: 'expenses', label: '💸 Expense Tracker' },
              { id: 'settlement', label: '⚖️ Settlement & Split' },
              { id: 'itinerary', label: '🗺️ Trip Itinerary' },
              { id: 'settings', label: '⚙️ Trip Settings & AI' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#94a3b8'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ backgroundColor: '#2d3748', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AY</div>
          <div>
            <strong style={{ color: '#fff', fontSize: '13px', display: 'block' }}>{userName}</strong>
            <span style={{ fontSize: '11px', color: '#a0aec0' }}>Admin / Organizer</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '24px 36px', overflowY: 'auto' }}>
        
        {/* HEADER */}
        <header style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#4f46e5', letterSpacing: '0.5px' }}>CURRENT TRIP ACTIVE</div>
            <h1 style={{ margin: '2px 0 0 0', fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>Hello, {userName}! 👋</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Active Trip</span>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{tripName}</div>
          </div>
        </header>

        {/* 1. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TOTAL EXPENSE</span>
                <h2 style={{ fontSize: '26px', color: '#059669', margin: '4px 0 0 0' }}>₹{totalExpense.toFixed(2)}</h2>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>PER PERSON SHARE</span>
                <h2 style={{ fontSize: '26px', color: '#4f46e5', margin: '4px 0 0 0' }}>₹{perPersonShare.toFixed(2)}</h2>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>ITINERARY</span>
                <h2 style={{ fontSize: '26px', color: '#0284c7', margin: '4px 0 0 0' }}>{itinerary.length} Days</h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.map(exp => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{exp.description}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Paid by {exp.payer}</div>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#059669' }}>₹{exp.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>🗺️ Upcoming Itinerary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {itinerary.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', flexShrink: 0 }}>{item.day}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#334155' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXPENSE TRACKER TAB */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>➕ Add New Expense</h3>
              <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Description (e.g. Dinner, Fuel)" 
                  value={newExpDesc} 
                  onChange={(e) => setNewExpDesc(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                />
                <input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  value={newExpAmount} 
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                />
                <select 
                  value={newExpPayer} 
                  onChange={(e) => setNewExpPayer(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                >
                  <option value="">Who Paid?</option>
                  {memberList.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
                <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Add Expense</button>
              </form>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>💸 All Expenses</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {expenses.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#1e293b' }}>{exp.description}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Paid by <b>{exp.payer}</b></span>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SETTLEMENT & SPLIT TAB */}
        {activeTab === 'settlement' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>⚖️ Group Settlement Summary</h3>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Total Expense: <b>₹{totalExpense}</b> | Per Person Share: <b>₹{perPersonShare.toFixed(2)}</b></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {memberList.map((m, idx) => {
                const paid = memberPaid[m] || 0;
                const balance = paid - perPersonShare;
                const isGet = balance >= 0;

                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#1e293b' }}>{m}</strong>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Total Paid: ₹{paid}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: isGet ? '#059669' : '#dc2626' }}>
                        {isGet ? `Gets Back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. TRIP ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>➕ Add Custom Day Activity</h3>
              <form onSubmit={handleAddItinerary} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr auto', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Day (e.g. Day 4)" 
                  value={newDay} 
                  onChange={(e) => setNewDay(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                />
                <input 
                  type="text" 
                  placeholder="Activity Details" 
                  value={newActivity} 
                  onChange={(e) => setNewActivity(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: '600' }}
                />
                <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Add Activity</button>
              </form>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>🗺️ Full Itinerary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>{item.day}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '18px', border: '1px solid #cbd5e1', maxWidth: '600px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a' }}>⚙️ Trip Configuration & AI Planner</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Trip / Destination Name</label>
                <input 
                  type="text" 
                  value={tripName} 
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g. Goa, Manali, Ladakh, Paris"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontWeight: '600' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  value={members} 
                  onChange={(e) => setMembers(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontWeight: '600' }}
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
                {aiLoading ? '✨ Generating AI Itinerary & Expenses...' : '✨ Auto-Generate AI Itinerary & Expenses'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
