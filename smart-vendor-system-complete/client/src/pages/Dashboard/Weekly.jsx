import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

function Weekly() {
  const [profit, setProfit] = useState("");
  const [weeklyProfits, setWeeklyProfits] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchWeeklyProfits();
  }, []);

  const fetchWeeklyProfits = async () => {
    try {
      const res = await axiosInstance.get(`/api/records/${userId}`);
      const weekly = res.data.filter(record => record.type === "profit" && record.category === "weekly");
      setWeeklyProfits(weekly);
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
        category: "weekly",
        amount: parseFloat(profit)
      });
      setProfit("");
      fetchWeeklyProfits();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Weekly Profit</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter weekly profit"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          required
        />
        <button type="submit">Add Profit</button>
      </form>

      <ul>
        {weeklyProfits.map((item, index) => (
          <li key={index}>
            {new Date(item.date).toLocaleDateString()}: ₹{item.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Weekly;