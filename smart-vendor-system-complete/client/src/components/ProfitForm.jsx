import React, { useState } from 'react';

function ProfitForm() {
  const [profit, setProfit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];

    await fetch('http://localhost:5000/api/profit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profit, date: today })
    });

    setProfit('');
    alert("Profit saved!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        placeholder="Enter daily profit" 
        value={profit} 
        onChange={(e) => setProfit(e.target.value)} 
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default ProfitForm;
