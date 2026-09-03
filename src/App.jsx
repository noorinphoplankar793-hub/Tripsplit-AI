import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'expenses', 'balance', 'itinerary', 'settings'
  const [userName] = useState('Ayaan');
  const [tripName, setTripName] = useState('Kasol Trip 2026');
  const [members, setMembers] = useState('Farman, Zaid, Jack, Nathan');
  const [aiLoading, setAiLoading] = useState(false);

  // Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Hotel Stay & Resort', amount: 8500, payer: 'Farman' },
    { id: 2, description: 'Food & Cafe Hopping', amount: 3200, payer: 'Zaid' },
    { id: 3, description: 'Cab & Travel Charges', amount: 4100, payer: 'Jack' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('Farman');

  // Itinerary State
  const [itinerary, setItinerary] = useState([
    { id: 1, day: 'Day 1', activity: 'Arrival in Kasol, Hotel Check-in & Evening Riverwalk' },
    { id: 2, day: 'Day 2', activity: 'Trek to Chalal & Tosh Village Cafe Exploration' },
    { id: 3, day: 'Day 3', activity: 'Manikaran Sahib Gurudwara Visit & Return Journey' }
  ]);
  const [dayInput, setDayInput] = useState('');
  const [activityInput, setActivityInput] = useState('');

  // AI Auto-Generator
  const handleGenerateAI = () => {
    if (!tripName.trim()) {
      alert('Kripya pehle Trip Name bharein!');
      return;
    }
    setAiLoading(true);

    const destination = tripName.replace(/trip|202\d|203\d/gi, '').trim() || tripName;
    const firstMember = members.split(',')[0]?.trim() || 'Farman';

    setTimeout(() => {
      const newItinerary = [
        { id: Date.now() + 1, day: 'Day 1', activity: `Arrival in ${destination}, hotel check-in & local market tour` },
        { id: Date.now() + 2, day: 'Day 2', activity: `Sightseeing, scenic points & famous cafes in ${destination}` },
        { id: Date.now() + 3, day: 'Day 3', activity: `Souvenir shopping, local food tasting & departure prep` }
      ];

      const newExpenses = [
        { id: Date.now() + 4, description: `${destination} Luxury Stay`, amount: 9500, payer: firstMember },
        { id: Date.now() + 5, description: 'Local Transport & Cabs', amount: 3800, payer: firstMember }
      ];

      setItinerary(newItinerary);
      setExpenses(newExpenses);
      setAiLoading(false);
      alert(`✨ AI ne ${destination} ke liye Naya Smart Itinerary & Expense Plan set kar diya hai!`);
    }, 800);
  };

  // Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;
    setExpenses([...expenses, { id: Date.now(), description, amount: parseFloat(amount), payer }]);
    setDescription('');
    setAmount('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Add Itinerary
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

  // Math Calculations
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
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        <div>
          {/* Logo & Title */}
          <div style={{ padding: '0 12px 24px 12px', borderBottom: '1px solid #334155', marginBottom: '24px' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚡ TripSplit AI
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Smart Expense & Travel Hub</div>
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard Overview', icon: '🏠' },
              { id: 'expenses', label: '💸 Expense Tracker', icon: '💰' },
              { id: 'balance', label: '⚖️ Settlement & Split', icon: '⚖️' },
              { id: 'itinerary', label: '🗺️ Trip Itinerary', icon: '📍' },
              { id: 'settings', label: '⚙️ Trip Settings & AI', icon: '🤖' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  backgroundColor: activeTab === tab.id ? '#4f46e5' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#94a3b8'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card in Sidebar */}
        <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#6366f1', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            AY
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Admin / Organizer</div>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        
        {/* Top Bar Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '20px 28px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          marginBottom: '28px'
        }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current Trip Active
            </span>
            <h1 style={{ fontSize: '26px', fontWeight: '800', margin: '2px 0 0 0', color: '#0f172a' }}>
              Hello, {userName}! 👋
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Destination</div>
              <strong style={{ fontSize: '15px', color: '#0f172a' }}>{tripName}</strong>
            </div>
            <div style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '700' }}>
              👥 {memberCount} Members
            </div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Stat Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block' }}>TOTAL EXPENSE</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#059669', marginTop: '4px', display: 'block' }}>₹{totalExpense.toFixed(2)}</span>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block' }}>PER PERSON SHARE</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#4f46e5', marginTop: '4px', display: 'block' }}>₹{perPersonShare.toFixed(2)}</span>
              </div>
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block' }}>ITINERARY DAYS</span>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#0284c7', marginTop: '4px', display: 'block' }}>{itinerary.length} Days Plan</span>
              </div>
            </div>

            {/* Quick Preview Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>💸 Recent Expenses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {expenses.slice(0, 3).map((exp) => (
                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{exp.description}</span>
                      <strong style={{ fontSize: '14px', color: '#059669' }}>₹{exp.amount}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>🗺️ Upcoming Itinerary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {itinerary.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: 'flex', gap: '10px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: '6px' }}>{item.day}</span>
                      <span style={{ fontSize: '13px', color: '#334155' }}>{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EXPENSES */}
        {activeTab === 'expenses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <form onSubmit={handleAddExpense} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>➕ Add New Expense Entry</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Expense Description (e.g. Dinner)" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <input 
                  type="text" 
                  placeholder="Paid by" 
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  + Add
                </button>
              </div>
            </form>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>📋 Expense Logs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {expenses.map((exp) => (
                  <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{exp.description}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Paid by <span style={{ color: '#4f46e5', fontWeight: '600' }}>{exp.payer}</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>₹{exp.amount.toFixed(2)}</span>
                      <button onClick={() => handleDeleteExpense(exp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BALANCE & SPLIT */}
        {activeTab === 'balance' && (
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>⚖️ Settlement & Equal Split Calculator</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#e0e7ff', padding: '18px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: '#4338ca', display: 'block', fontWeight: '600' }}>TOTAL COST</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#3730a3' }}>₹{totalExpense.toFixed(2)}</span>
              </div>
              <div style={{ backgroundColor: '#d1fae5', padding: '18px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', color: '#065f46', display: 'block', fontWeight: '600' }}>INDIVIDUAL SHARE</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#047857' }}>₹{perPersonShare.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.keys(paidByMember).map((person, idx) => {
                const paid = paidByMember[person];
                const balance = paid - perPersonShare;
                const isGetsBack = balance >= 0;

                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#0f172a' }}>{person}</strong>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Total Paid: ₹{paid.toFixed(2)}</div>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: isGetsBack ? '#059669' : '#dc2626' }}>
                      {isGetsBack ? `Gets back ₹${balance.toFixed(2)}` : `Owes ₹${Math.abs(balance).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <form onSubmit={handleAddItinerary} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 0' }}>📌 Add Custom Activity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px' }}>
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
                <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  + Add Plan
                </button>
              </div>
            </form>

            <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0' }}>🗺️ Itinerary Schedule</h3>
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

        {/* TAB 5: SETTINGS & AI */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>⚙️ Trip Configuration & AI Planner</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Trip / Destination Name</label>
                <input 
                  type="text" 
                  value={tripName} 
                  onChange={(e) => setTripName(e.target.value)}
                  style={{ width: '100%', padding: '11px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px' }}>Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  value={members} 
                  onChange={(e) => setMembers(e.target.value)}
                  style={{ width: '100%', padding: '11px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '10px' }}>
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  style={{
                    width: '100%',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {aiLoading ? '✨ Generating Smart Plan...' : '✨ Auto-Generate AI Itinerary & Expenses'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
