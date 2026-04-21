import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const Inflation = () => {
  const [month, setMonth] = useState("");
  const [profit, setProfit] = useState("");
  const [monthlyProfits, setMonthlyProfits] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMonthlyProfits();
  }, []);

  const fetchMonthlyProfits = async () => {
    try {
      const res = await axiosInstance.get(`/api/records/${userId}`);
      const monthly = res.data.filter(record => record.type === "profit" && record.category === "monthly").sort((a, b) => new Date(a.date) - new Date(b.date));
      setMonthlyProfits(monthly);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/records/add", {
        userId,
        type: "profit",
        category: "monthly",
        amount: parseFloat(profit),
        date: new Date(`${month}-01`) // assuming month is YYYY-MM
      });
      setMonth("");
      setProfit("");
      fetchMonthlyProfits();
    } catch (error) {
      console.log(error);
    }
  };

  const calculateInflation = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(2);
  };

  return (
    <div>
      <h2>Inflation Calculation</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter profit"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          required
        />
        <button type="submit">Add Profit</button>
      </form>

      <table className="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Profit</th>
            <th>Inflation Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {monthlyProfits.map((item, index) => {
            const prev = index > 0 ? monthlyProfits[index - 1].amount : 0;
            const inflation = calculateInflation(item.amount, prev);
            return (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>₹{item.amount}</td>
                <td>{index > 0 ? `${inflation}%` : "N/A"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Inflation;