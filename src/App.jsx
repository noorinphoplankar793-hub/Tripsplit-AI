import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses', 'balance', 'itinerary', 'ai-planner'
  const [userName, setUserName] = useState('Ayaan');
  const [tripName, setTripName] = useState('Kasol Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  
  // Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Food & Snacks', amount: 2500, payer: 'Farman' },
    { id: 2, description: 'Hotel Stay', amount: 7500, payer: 'Zaid' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  // Itinerary State
  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival in Kasol & Chalal Trek' },
    { id: 2, day: 'Day 2', activity: 'Trek to Tosh & Local Cafe hopping' }
  ]);
  const [dayInput, setDayInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  // AI Generator State
  const [destination, setDestination] = useState('Kasol');
  const [tripDays, setTripDays] = useState('3');
  const [apiKey, setApiKey] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Expense Handlers
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;
    setExpenses([...expenses, { id: Date.now(), description, amount: parseFloat(amount), payer }]);
    setDescription('');
    setAmount('');
    setPayer('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Itinerary Handlers
  const handleAddItinerary = (e) => {
    e.preventDefault();
    if (!dayInput || !activityInput) return;
    setItinerary([...itinerary, { id: Date.now(), day: dayInput, activity: activityInput }]);
    setDayInput('');
    setActivityInput('');
  };

  const handleDeleteItinerary = (id) => {
    setItinerary(itinerary.filter(item => item.id !== id));
  };

  // AI Generator Handler (Using Gemini API or Smart Fallback AI Engine)
  const handleGenerateAIPlan = async (e) => {
    e.preventDefault();
    if (!destination) return;
    setAiLoading(true);

    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a ${tripDays}-day travel itinerary for ${destination}. Format strictly as JSON array with objects containing 'day' (e.g. Day 1) and 'activity'. Do not include markdown code block syntax, just JSON.`
              }]
            }]
          })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        
        const formatted = parsed.map((item, idx) => ({
          id: Date.now() + idx,
          day: item.day || `Day ${idx + 1}`,
          activity: item.activity
        }));
        setItinerary(formatted);
        setActiveTab('itinerary');
      } catch (err) {
        alert('API Key Error/Limit hit. Using Instant Smart AI Engine fallback!');
        generateFallbackPlan();
      }
    } else {
      generateFallbackPlan();
    }
    setAiLoading(false);
  };

  const generateFallbackPlan = () => {
    const days = parseInt(tripDays) || 3;
    const generated = [];
    const activities = [
      `Arrival in ${destination}, check-in & local street food tour`,
      `Sightseeing, scenic photography & famous landmark visits in ${destination}`,
      `Adventure activities, local shopping & sunset point at ${destination}`,
      `Relaxing cafe hop, souvenir shopping & departure prep`
    ];

    for (let i = 1; i <= days; i++) {
      generated.push({
        id: Date.now() + i,
        day: `Day ${i}`,
        activity: activities[(i - 1) % activities.length]
      });
    }
    setItinerary(generated);
    setActiveTab('itinerary');
  };

  // Balance Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const memberList = members.split(',').map(m => m.trim()).filter(Boolean);
  const memberCount = memberList.length || 1;
  const perPersonShare = totalExpense / memberCount;

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
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '30px 16px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* User Welcome Header */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '24px 28px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              ✨ AI Smart Trip Manager
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', margin: 0, color: '#1e293b' }}>
              Hello, {userName}! 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
              Managing trip expenses & plans for <strong style={{ color: '#0f172a' }}>{tripName}</strong>
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '10px 18px',
            borderRadius: '14px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '600' }}>TOTAL SPENT</span>
            <strong style={{ fontSize: '20px', color: '#059669' }}>₹{totalExpense.toFixed(2)}</strong>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#ffffff',
          padding: '6px',
          borderRadius: '14px',
          border: '1px solid #cbd5e1',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          <button 
            onClick={() => setActiveTab('expenses')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
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
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
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
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'itinerary' ? '#4f46e5' : 'transparent',
              color: activeTab === 'itinerary' ? '#ffffff' : '#64748b'
            }}
          >
            🗺️ Itinerary
          </button>

          <button 
            onClick={() => setActiveTab('ai-planner')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'ai-planner' ? '#0284c7' : 'transparent',
              color: activeTab === 'ai-planner' ? '#ffffff' : '#0284c7'
            }}
          >
            🤖 AI Trip Planner
          </button>
        </div>

        {/* TAB 1: EXPENSES */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
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

              <form onSubmit={handleAddExpense} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>➕ Add New Expense</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="What was paid for? (e.g. Food)" 
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

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>📋 Expense Records</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {expenses.map((exp) => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{exp.description}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Paid by <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.payer}</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>₹{exp.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BALANCE */}
        {activeTab === 'balance' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>⚖️ Equal Split Summary</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#e0e7ff', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: '#4338ca', display: 'block', fontWeight: '600' }}>TOTAL EXPENSE</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#3730a3' }}>₹{totalExpense.toFixed(2)}</span>
              </div>
              <div style={{ backgroundColor: '#d1fae5', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: '#065f46', display: 'block', fontWeight: '600' }}>PER PERSON SHARE</span>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#047857' }}>₹{perPersonShare.toFixed(2)}</span>
              </div>
            </div>

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
                    <span style={{ fontSize: '14px', fontWeight: '700', color: isGetsBack ? '#059669' : '#dc2626' }}>
                      {isGetsBack ? `Gets back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <form onSubmit={handleAddItinerary} style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>📌 Add Custom Travel Plan</h3>
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
                  placeholder="Activity / Place" 
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  + Add
                </button>
              </div>
            </form>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>🗺️ Saved Itinerary Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {itinerary.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontWeight: '700', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>
                        {item.day}
                      </div>
                      <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>
                        {item.activity}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteItinerary(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI PLANNER */}
        {activeTab === 'ai-planner' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0', color: '#0284c7' }}>
              🤖 AI Instant Itinerary Generator
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Select destination & days. AI will generate an automatic plan and add it to your Itinerary tab!
            </p>

            <form onSubmit={handleGenerateAIPlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Destination Place</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kasol, Manali, Goa" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Trip Days</label>
                  <input 
                    type="number" 
                    placeholder="Days" 
                    value={tripDays}
                    onChange={(e) => setTripDays(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Gemini API Key (Optional - Leave empty to use default Smart AI)</label>
                <input 
                  type="password" 
                  placeholder="Paste Gemini API Key (AI_ZASy...)" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={aiLoading}
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                {aiLoading ? '✨ Generating Smart Plan...' : '🚀 Generate AI Itinerary Plan'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
