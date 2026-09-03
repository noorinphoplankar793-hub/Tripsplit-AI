import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // User & Trip Customization State
  const [userName, setUserName] = useState('Ayaan');
  const [destination, setDestination] = useState('Goa');
  const [tripDays, setTripDays] = useState('5 Days');
  const [memberCount, setMemberCount] = useState(4);
  const [friendsList, setFriendsList] = useState(['Rahul', 'Ayesha', 'Priya', 'You']);

  // Expenses State
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Hotel Booking', paidBy: 'Rahul', amount: 6000, date: 'May 20, 2025', icon: '🏨', bg: '#e0e7ff', color: '#4338ca' },
    { id: 2, title: 'Dinner', paidBy: 'Ayesha', amount: 2400, date: 'May 20, 2025', icon: '🍴', bg: '#ffedd5', color: '#c2410c' },
    { id: 3, title: 'Taxi', paidBy: 'You', amount: 1500, date: 'May 20, 2025', icon: '🚖', bg: '#d1fae5', color: '#047857' },
    { id: 4, title: 'Entry Tickets', paidBy: 'Priya', amount: 1200, date: 'May 19, 2025', icon: '🎟️', bg: '#e0f2fe', color: '#0369a1' },
  ]);

  // Itinerary State
  const [itinerary, setItinerary] = useState([
    { id: 1, time: '9:00 AM', title: 'Breakfast at Café', desc: 'Start your day with a relaxing breakfast ☕', icon: '☕', bg: '#f3e8ff', color: '#7e22ce' },
    { id: 2, time: '11:00 AM', title: `Explore ${destination} Main Spots`, desc: 'Enjoy sightseeing & beach vibes 🏖️', icon: '🏖️', bg: '#e0f2fe', color: '#0284c7' },
    { id: 3, time: '7:00 PM', title: 'Dinner & Nightlife', desc: `Explore ${destination}'s amazing nightlife ✨`, icon: '🎵', bg: '#fae8ff', color: '#c026d3' },
  ]);

  // AI Prompt Input State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New Expense Input State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPayer, setNewPayer] = useState('You');

  // Calculations
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const perPersonShare = Math.round(totalExpenses / (memberCount || 1));

  // AI Generation Handler
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setItinerary([
        { id: Date.now() + 1, time: '9:00 AM', title: `Arrival in ${destination}`, desc: 'Check-in to resort & morning coffee ☕', icon: '☕', bg: '#f3e8ff', color: '#7e22ce' },
        { id: Date.now() + 2, time: '1:00 PM', title: `${destination} Adventure Tour`, desc: 'Sightseeing, water sports & famous spots 🌊', icon: '🏖️', bg: '#e0f2fe', color: '#0284c7' },
        { id: Date.now() + 3, time: '8:00 PM', title: 'Sunset Dinner', desc: `Special group dinner in ${destination} ✨`, icon: '🎵', bg: '#fae8ff', color: '#c026d3' }
      ]);
      setIsGenerating(false);
      setAiPrompt('');
      alert(`✨ AI Plan generated for ${destination}!`);
    }, 800);
  };

  // Add Expense Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;
    const newExp = {
      id: Date.now(),
      title: newTitle,
      paidBy: newPayer,
      amount: parseFloat(newAmount),
      date: 'Today',
      icon: '💸',
      bg: '#e0e7ff',
      color: '#4f46e5'
    };
    setExpenses([newExp, ...expenses]);
    setNewTitle('');
    setNewAmount('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6fb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* ---------------- LEFT SIDEBAR ---------------- */}
      <aside style={{ width: '240px', backgroundColor: '#0b0f24', color: '#ffffff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', fontWeight: '800', marginBottom: '32px', paddingLeft: '8px' }}>
            <span style={{ color: '#38bdf8' }}>✈️</span> TripSplit
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { name: 'Dashboard', icon: '🏠' },
              { name: 'Expenses', icon: '💳' },
              { name: 'Itinerary', icon: '🗺️' },
              { name: 'Friends', icon: '👥' }
            ].map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    backgroundColor: isActive ? '#5850ec' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          padding: '18px 14px',
          borderRadius: '16px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #4338ca'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Smart Travel Planning</div>
          <div style={{ fontSize: '11px', color: '#a5b4fc', marginBottom: '12px' }}>Powered by AI ✨</div>
          <div style={{ fontSize: '32px' }}>🧳</div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto' }}>
        
        {/* TOP BAR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Welcome back, <strong style={{ color: '#0f172a' }}>{userName}</strong> 👋</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', border: 'none', background: 'transparent', width: 'auto', outline: 'none', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '24px' }}>🌴</span>
            </div>
          </div>

          {/* User Profile Right Corner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px' }}>🔔</span>
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', padding: '6px 12px 6px 6px', borderRadius: '30px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                {userName.charAt(0)}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{userName}</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>▼</span>
            </div>
          </div>
        </header>

        {/* ---------------- 4 TOP STAT CARDS ---------------- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          
          {/* Card 1: Total Expenses */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f0f3ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>💼</div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Total Expenses</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>₹{totalExpenses.toLocaleString()}</div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>↗ 12% <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>from last trip</span></div>
            </div>
          </div>

          {/* Card 2: Trip Members */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👥</div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Trip Members</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>{memberCount} People</div>
              <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: '700', cursor: 'pointer' }}>View all members →</div>
            </div>
          </div>

          {/* Card 3: Trip Duration */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fffbe8', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📅</div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Trip Duration</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>{tripDays}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Active Schedule</div>
            </div>
          </div>

          {/* Card 4: Share / You Owe */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🍰</div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Per Person Share</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>₹{perPersonShare.toLocaleString()}</div>
              <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: '700', cursor: 'pointer' }}>See settlements →</div>
            </div>
          </div>

        </div>

        {/* ---------------- MIDDLE SECTION: RECENT EXPENSES + AI PLANNER BANNER ---------------- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
          
          {/* Recent Expenses List */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Expenses</h2>
              <button 
                onClick={() => {
                  const title = prompt('Expense Name:');
                  const amt = prompt('Amount (₹):');
                  if (title && amt) {
                    setExpenses([{ id: Date.now(), title, paidBy: 'You', amount: parseFloat(amt), date: 'Today', icon: '💳', bg: '#e0e7ff', color: '#4f46e5' }, ...expenses]);
                  }
                }}
                style={{ backgroundColor: '#6366f1', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
              >
                + Add Expense
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {expenses.map((exp) => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: exp.bg, color: exp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {exp.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Paid by {exp.paidBy}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>₹{exp.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{exp.date}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', cursor: 'pointer' }}>View all expenses →</span>
            </div>
          </div>

          {/* AI PLANNER BANNER */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            padding: '28px',
            borderRadius: '24px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '16px' }}>
                ✨ AI PLANNER
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0' }}>Your Smart Travel Assistant</h2>
              <p style={{ fontSize: '13px', color: '#e0e7ff', margin: 0, lineHeight: '1.5' }}>
                Get personalized travel suggestions, optimized itineraries and smart expense insights for <strong>{destination}</strong>.
              </p>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', backgroundColor: '#ffffff', borderRadius: '12px', padding: '4px 6px 4px 14px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder={`Ask TripSplit AI anything about ${destination}...`}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '13px', color: '#0f172a' }}
                />
                <button 
                  onClick={handleGeneratePlan}
                  style={{ backgroundColor: '#6366f1', border: 'none', color: '#fff', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  ➤
                </button>
              </div>

              <button 
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  color: '#4338ca',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {isGenerating ? 'Generating Plan...' : 'Generate Today\'s Plan ✨'}
              </button>
            </div>
          </div>

        </div>

        {/* ---------------- BOTTOM SECTION: TODAY'S ITINERARY TIMELINE ---------------- */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Today's Itinerary</h2>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#4f46e5', cursor: 'pointer' }}>View Full Plan →</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {itinerary.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5', marginBottom: '2px' }}>{item.time}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
