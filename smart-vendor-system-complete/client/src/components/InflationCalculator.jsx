import React, { useState } from 'react';

function InflationCalculator() {
  const [profit, setProfit] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [adjusted, setAdjusted] = useState(null);

  const calculateInflation = () => {
    const result = profit / Math.pow(1 + rate/100, years);
    setAdjusted(result.toFixed(2));
  };

  return (
    <div>
      <input type="number" placeholder="Profit" value={profit} onChange={(e) => setProfit(e.target.value)} />
      <input type="number" placeholder="Inflation rate (%)" value={rate} onChange={(e) => setRate(e.target.value)} />
      <input type="number" placeholder="Years" value={years} onChange={(e) => setYears(e.target.value)} />
      <button onClick={calculateInflation}>Calculate</button>
      {adjusted && <p>Adjusted Profit: ₹{adjusted}</p>}
    </div>
  );
}

export default InflationCalculator;
