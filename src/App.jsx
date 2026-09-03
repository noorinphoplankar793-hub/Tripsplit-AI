import React, { useState } from 'react';

export default function App() {
  const [tripName, setTripName] = useState('');
  const [members, setMembers] = useState('');
  const [expenses, setExpenses] = useState([]);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            ✨ Powered by AI Smart Split
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-purple-300">
            TripSplit AI
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Effortlessly track group trip expenses, split costs with AI precision, and settle up with zero confusion.
          </p>
        </header>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Trip Details Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              🗺️ Trip Setup
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Goa Trip 2026" 
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="Rahul, Priya, Amit, Sara" 
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Add Expense Card */}
          <form onSubmit={handleAddExpense} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              💸 Add Expense
            </h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="What was paid for? (e.g. Dinner)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="number" 
                  placeholder="Amount (₹)" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Paid by" 
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
              >
                + Add Expense
              </button>
            </div>
          </form>

        </div>

        {/* Expenses List & Summary */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {tripName || 'Trip Expenses'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {members ? `Members: ${members}` : 'Add members to start tracking'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Total Spent</span>
              <span className="text-2xl font-extrabold text-emerald-400">₹{totalExpense.toFixed(2)}</span>
            </div>
          </div>

          {/* Expenses Table/List */}
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No expenses added yet. Add an expense above to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {expenses.map((exp, index) => (
                <div key={index} className="flex justify-between items-center bg-slate-950/50 border border-slate-800/80 p-3.5 rounded-xl">
                  <div>
                    <span className="font-medium text-slate-200 text-sm block">{exp.description}</span>
                    <span className="text-xs text-slate-400">Paid by <strong className="text-indigo-400">{exp.payer}</strong></span>
                  </div>
                  <span className="font-bold text-slate-100">₹{exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
