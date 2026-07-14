import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import NotificationBell from "../components/NotificationBell";

const MyPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const { data } = await api.get("/pickups/my");
        setPickups(data.pickups);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load pickups");
      }
    };
    fetchPickups();
  }, []);

  return (
    <div>
      <div className="top-nav">
        <NotificationBell />
      </div>
      <div className="dashboard-container">
        <h2>My Pickup Requests</h2>
        <p>
          <Link to="/user/create-pickup">+ New Pickup Request</Link>
          {" | "}
          <Link to="/user/reward-history">View Reward History</Link>
        </p>
        {error && <p className="error-text">{error}</p>}

        {pickups.length === 0 && <p>No pickup requests yet.</p>}

        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Item</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Pickup Date</th>
              <th>Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image ? (
                    <img src={`http://localhost:5000${p.image}`} alt={p.itemName} width="60" />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>{p.itemName}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>{p.status}</td>
                <td>{new Date(p.preferredPickupDate).toLocaleDateString()}</td>
                <td>{p.rewardPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPickups;