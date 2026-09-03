import React, { useState } from 'react';

export default function App() {
  const [tripName, setTripName] = useState('Ajmer Trip');
  const [members, setMembers] = useState('Rahul, Priya, Amit, Sara');
  const [expenses, setExpenses] = useState([
    { description: 'Food & Snacks', amount: 2500, payer: 'Rahul' },
    { description: 'Hotel Stay', amount: 7500, payer: 'Amit' }
  ]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;
    setExpenses([...expenses, { description, amount: parseFloat(amount), payer }]);
    setDescription('');
    setAmount('');
    setPayer('');
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans p-4 sm:p-8 relative">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            ✨ Powered by AI Smart Split
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            TripSplit AI
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Effortlessly track group trip expenses, split costs with AI precision, and settle up with zero confusion.
          </p>
        </header>

        {/* Forms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Trip Details Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              🗺️ Trip Setup
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Goa Trip" 
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Group Members</label>
                <input 
                  type="text" 
                  placeholder="Rahul, Priya, Amit" 
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              💸 Add Expense
            </h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="What was paid for? (e.g. Dinner)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <input 
                  type="text" 
                  placeholder="Paid by" 
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20"
              >
                + Add Expense
              </button>
            </div>
          </form>

        </div>

        {/* Expenses List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                📍 {tripName || 'Trip Expenses'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Members: {members || 'None'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase">Total Spent</span>
              <span className="text-2xl font-black text-emerald-400">₹{totalExpense.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {expenses.map((exp, index) => (
              <div key={index} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div>
                  <p className="font-semibold text-white text-base">{exp.description}</p>
                  <p className="text-xs text-slate-400">Paid by <span className="text-indigo-400 font-medium">{exp.payer}</span></p>
                </div>
                <p className="text-lg font-bold text-slate-100">₹{exp.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
