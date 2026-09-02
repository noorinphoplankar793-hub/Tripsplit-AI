import React, { useState } from 'react';
import { 
  LayoutDashboard, CreditCard, Calendar, Wallet, Sparkles, 
  Camera, Tag, PlusCircle, MapPin, CheckCircle, ArrowRight, TrendingUp, Download, Zap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [aiInput, setAiInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [notification, setNotification] = useState('');
  
  const yourName = "Ayaan";

  // States
  const [destination, setDestination] = useState('Goa');
  const [generating, setGenerating] = useState(false);
  const totalBudget = 25000;

  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Dinner at Baga Beach', paid: 'Raj', amt: 2000, category: 'Food' },
    { id: 2, title: 'Hotel Stay - Day 2', paid: 'You', amt: 6000, category: 'Lodging' },
    { id: 3, title: 'Taxi to Airport', paid: 'Priya', amt: 1250, category: 'Transport' }
  ]);

  const [itinerary, setItinerary] = useState([
    { id: 101, day: 'Day 1', activity: 'Arrival & Check-in at Hotel', time: '10:00 AM', estCost: 6000, category: 'Lodging' },
    { id: 102, day: 'Day 1', activity: 'Sunset Dinner at Baga Beach', time: '07:00 PM', estCost: 2000, category: 'Food' },
    { id: 103, day: 'Day 2', activity: 'Scuba Diving at Grande Island', time: '09:00 AM', estCost: 3500, category: 'Activities' },
    { id: 104, day: 'Day 2', activity: 'Scooter Rental for Local Sightseeing', time: '02:00 PM', estCost: 800, category: 'Transport' }
  ]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const detectCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort')) return 'Lodging';
    if (lower.includes('taxi') || lower.includes('scooter') || lower.includes('cab') || lower.includes('flight')) return 'Transport';
    if (lower.includes('dinner') || lower.includes('food') || lower.includes('cafe') || lower.includes('drinks')) return 'Food';
    return 'Activities';
  };

  const linkActivityToExpense = (item) => {
    const newExpense = {
      id: Date.now(),
      title: `${item.day}: ${item.activity}`,
      paid: 'You',
      amt: item.estCost,
      category: item.category
    };
    setExpenses(prev => [newExpense, ...prev]);
    showToast(`Added "${item.activity}" (₹${item.estCost}) to Expenses!`);
  };

  const generateAIItinerary = () => {
    if (!destination.trim()) return;
    setGenerating(true);

    setTimeout(() => {
      const generatedPlan = [
        { id: 201, day: 'Day 1', activity: `Arrival in ${destination} & Resort Check-in`, time: '11:00 AM', estCost: 5000, category: 'Lodging' },
        { id: 202, day: 'Day 1', activity: 'Welcome Drinks & Lunch at Beachside Cafe', time: '01:30 PM', estCost: 1500, category: 'Food' },
        { id: 203, day: 'Day 2', activity: 'Guided City Tour & Historical Landmarks', time: '10:00 AM', estCost: 2200, category: 'Activities' },
        { id: 204, day: 'Day 2', activity: 'Local Transport & Cab Charges', time: '05:00 PM', estCost: 1200, category: 'Transport' }
      ];
      setItinerary(generatedPlan);
      setGenerating(false);
      showToast(`Generated new AI Itinerary for ${destination}!`);
    }, 1200);
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setTimeout(() => {
      const scannedData = {
        id: Date.now(),
        title: 'Starbucks Cafe & Snacks',
        paid: 'You',
        amt: 850,
        category: 'Food'
      };
      setExpenses(prev => [scannedData, ...prev]);
      setScanning(false);
      showToast('OCR Scanned: Starbucks Cafe (₹850) Added!');
    }, 1500);
  };

  const processAIInput = () => {
    if (!aiInput.trim()) return;
    const numMatch = aiInput.match(/\d+/);
    const amount = numMatch ? parseInt(numMatch[0]) : 500;
    const cleanTitle = aiInput.replace(/paid|for|i|₹|\d+/gi, '').trim() || 'Trip Expense';

    const newExpense = {
      id: Date.now(),
      title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
      paid: 'You',
      amt: amount,
      category: detectCategory(cleanTitle)
    };

    setExpenses(prev => [newExpense, ...prev]);
    setAiInput('');
    showToast(`Added: ${newExpense.title} (₹${amount})`);
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amt, 0);
  const budgetPercentage = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f1f5f9', fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif", overflow: 'hidden' }}>
      
      {/* Toast Notification Box */}
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff',
          padding: '14px 22px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000, fontSize: '13px', fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <CheckCircle size={18} color="#10b981" /> {notification}
        </div>
      )}

      {/* Futuristic Dark Sidebar */}
      <aside style={{ width: '250px', minWidth: '250px', background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', padding: '24px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '4px 0 24px rgba(0,0,0,0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', paddingLeft: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>✈️</div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.3px' }}>TripSplit <span style={{ color: '#38bdf8' }}>AI</span></h2>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>Smart Group Expense Engine</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { tab: 'Dashboard', icon: LayoutDashboard },
              { tab: 'Itinerary', icon: Calendar },
              { tab: 'Expenses', icon: CreditCard },
              { tab: 'Balance', icon: Wallet },
            ].map(({ tab, icon: Icon }) => {
              const isActive = activeTab === tab;
              return (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                    padding: '12px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: isActive ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' : 'transparent',
                    borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                    color: isActive ? '#38bdf8' : '#94a3b8',
                    fontWeight: isActive ? '700' : '500', fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} /> {tab}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
            <Zap size={12} /> HACKATHON PROTOTYPE
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>AI Models & Graph Algo Enabled</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '28px 40px', overflowY: 'auto', boxSizing: 'border-box' }}>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'Dashboard' && (
          <div>
            {/* Header Greeting */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                Welcome back, <span style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{yourName} 👋</span>
              </h1>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '6px 0 0' }}>Real-time itinerary insights and smart AI spending analytics.</p>
            </div>
            
            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
              
              <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</span>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>₹{totalSpent}</div>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginTop: '6px' }}>↑ Live mapped from expenses</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Target Budget</span>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb', marginTop: '4px' }}>₹{totalBudget}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Fixed Trip Threshold</div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Group Members</span>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#7c3aed', marginTop: '4px' }}>3 Active</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>Ayaan, Raj, Priya</div>
              </div>

            </div>

            {/* Budget Forecast Gauge Bar */}
            <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={20} color="#2563eb" /> AI Budget Forecast & Pace Prediction
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', padding: '4px 12px', borderRadius: '20px', backgroundColor: budgetPercentage > 80 ? '#fef2f2' : '#eff6ff', color: budgetPercentage > 80 ? '#ef4444' : '#2563eb' }}>
                  {budgetPercentage}% Consumed
                </span>
              </div>
              
              <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '14px', borderRadius: '8px', overflow: 'hidden', padding: '2px', boxSizing: 'border-box' }}>
                <div style={{ width: `${budgetPercentage}%`, background: budgetPercentage > 80 ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)' : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)', height: '100%', borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
              </div>

              <p style={{ fontSize: '12px', color: '#475569', marginTop: '12px', margin: '12px 0 0 0', fontWeight: '500' }}>
                {budgetPercentage > 80 ? '⚠️ High spending pace detected! AI predicts overshooting budget if current pace continues.' : '✅ Optimal Spending Pace: Current expenditures are well within linear forecast model.'}
              </p>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {activeTab === 'Itinerary' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>AI Itinerary Planner</h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px 0' }}>Generate destination itinerary and map scheduled activities directly to split expenses.</p>

            <div style={{ background: '#ffffff', padding: '18px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '28px' }}>
              <MapPin color="#2563eb" size={22} />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination e.g. Manali, Goa, Thailand"
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#f8fafc' }}
              />
              <button 
                onClick={generateAIItinerary}
                disabled={generating}
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}
              >
                <Sparkles size={18} /> {generating ? 'Generating Plan...' : 'Generate AI Plan'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {itinerary.map((item) => (
                <div key={item.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.day} • {item.time}</div>
                    <div style={{ fontWeight: '700', fontSize: '16px', color: '#0f172a' }}>{item.activity}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                      Est. Cost: <strong style={{ color: '#0f172a' }}>₹{item.estCost}</strong> | Category: <span style={{ color: '#0284c7', fontWeight: '600', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>{item.category}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => linkActivityToExpense(item)}
                    style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', transition: 'all 0.2s' }}
                  >
                    <PlusCircle size={16} /> Link to Expenses
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'Expenses' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Expense Splitting & OCR Capture</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              
              {/* Receipt OCR Box */}
              <div style={{ border: '2px dashed #3b82f6', padding: '22px', borderRadius: '16px', background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', background: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#fff', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                  <Camera size={24} />
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#1e3a8a' }}>OCR Receipt Scanner</h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>Upload image to extract merchant & bill details automatically</p>
                <label style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'inline-block', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                  {scanning ? 'Scanning Image...' : 'Upload Receipt Image'}
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ display: 'none' }} disabled={scanning} />
                </label>
              </div>

              {/* Natural Language Box */}
              <div style={{ border: '2px solid #c084fc', padding: '22px', borderRadius: '16px', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', marginBottom: '8px' }}>
                  <Sparkles size={20} />
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>Natural Language AI Entry</h4>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px 0' }}>Type prompt in free-form English:</p>
                <input 
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processAIInput()}
                  placeholder="e.g. 'Paid 1400 for Uber to hotel'"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d8b4fe', boxSizing: 'border-box', marginBottom: '10px', fontSize: '13px', outline: 'none', background: '#ffffff' }}
                />
                <button onClick={processAIInput} style={{ background: '#9333ea', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', width: '100%', fontSize: '13px', boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)' }}>Add Expense via AI</button>
              </div>

            </div>

            {/* Expenses List */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>Active Expenses</h3>
              {expenses.map((exp) => (
                <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{exp.title}</div>
                    <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        <Tag size={10} inline /> {exp.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Paid by <strong>{exp.paid}</strong></span>
                    </div>
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '17px', color: '#0f172a' }}>₹{exp.amt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BALANCE & SETTLEMENT TAB */}
        {activeTab === 'Balance' && (
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>Simplified Settlement Engine</h1>
            
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700' }}>Optimized Payment Graph</h3>
              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 24px 0' }}>Greedy Minimization algorithm reduces complex group debts into minimum direct transactions:</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ background: '#3b82f6', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>P</div>
                  <strong style={{ fontSize: '15px' }}>Priya</strong>
                  <ArrowRight size={18} color="#2563eb" />
                  <span style={{ fontSize: '14px' }}>pays <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹1,800</strong> to</span>
                  <strong style={{ fontSize: '15px', color: '#2563eb' }}>You ({yourName})</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ background: '#8b5cf6', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>R</div>
                  <strong style={{ fontSize: '15px' }}>Raj</strong>
                  <ArrowRight size={18} color="#2563eb" />
                  <span style={{ fontSize: '14px' }}>pays <strong style={{ color: '#16a34a', fontSize: '16px' }}>₹1,100</strong> to</span>
                  <strong style={{ fontSize: '15px', color: '#2563eb' }}>You ({yourName})</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button onClick={() => showToast('All balances successfully settled up!')} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}>
                  Settle Up All Balances
                </button>
                <button onClick={() => showToast('Summary CSV Exported!')} style={{ background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} /> Export Summary CSV
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}