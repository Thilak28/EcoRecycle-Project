import { useEffect, useState } from "react";
import api from "../api/axios";

const RewardHistory = () => {
  const [history, setHistory] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/notifications/reward-history");
        setHistory(data.history);
        setTotalEarned(data.totalEarned);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reward history");
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Reward History</h2>
      <div className="stat-card" style={{ maxWidth: 250, marginBottom: 20 }}>
        <h3>{totalEarned}</h3>
        <p>Total Points Earned</p>
      </div>

      {error && <p className="error-text">{error}</p>}
      {history.length === 0 && <p>No rewards earned yet.</p>}

      <table>
        <thead>
          <tr><th>Item</th><th>Category</th><th>Points Earned</th><th>Date</th></tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id}>
              <td>{h.pickup?.itemName}</td>
              <td>{h.pickup?.category}</td>
              <td>{h.earnedPoints}</td>
              <td>{new Date(h.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardHistory;