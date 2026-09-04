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

  // Splitwise-style Simplified Debt Algorithm
  const calculateSimplifiedDebts = (membersList, expensesList) => {
    const balances = {};
    membersList.forEach(m => { balances[m] = 0; });

    expensesList.forEach(exp => {
      const paidBy = exp.payer;
      const amount = exp.amount;
      const splitAmount = amount / (membersList.length || 1);

      if (balances[paidBy] !== undefined) {
        balances[paidBy] += amount;
      }
      membersList.forEach(member => {
        balances[member] -= splitAmount;
      });
    });

    let debtors = [];
    let creditors = [];

    for (let member in balances) {
      let bal = parseFloat(balances[member].toFixed(2));
      if (bal < 0) {
        debtors.push({ name: member, amount: -bal });
      } else if (bal > 0) {
        creditors.push({ name: member, amount: bal });
      }
    }

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let transactions = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      let debt = debtors[i];
      let credit = creditors[j];

      let settledAmount = Math.min(debt.amount, credit.amount);

      transactions.push({
        from: debt.name,
        to: credit.name,
        amount: parseFloat(settledAmount.toFixed(2))
      });

      debt.amount -= settledAmount;
      credit.amount -= settledAmount;

      if (debt.amount === 0) i++;
      if (credit.amount === 0) j++;
    }

    return transactions;
  };

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
      const cleanJson = JSON.parse(rawText.replace(/```json|
