import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_FLOW = [
  "Assigned",
  "Accepted",
  "Out for Pickup",
  "Collected",
  "Delivered to Recycling Center",
  "Completed",
];

const AgencyDashboard = () => {
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState("");

  const fetchPickups = async () => {
    try {
      const { data } = await api.get("/agency/pickups");
      setPickups(data.pickups);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load assigned pickups");
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const nextStatus = (currentStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const handleAdvanceStatus = async (pickupId, currentStatus) => {
    const newStatus = nextStatus(currentStatus);
    if (!newStatus) return;

    try {
      await api.put(`/agency/pickups/${pickupId}/status`, { status: newStatus });
      fetchPickups(); // refresh list after update
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div>
      <h2>Agency Dashboard — Assigned Pickups</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {pickups.length === 0 && <p>No pickups assigned yet.</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Image</th>
            <th>Item</th>
            <th>User</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
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
              <td>{p.itemName} ({p.category})</td>
              <td>{p.user?.name} — {p.user?.phone}</td>
              <td>{p.pickupAddress}</td>
              <td>{p.status}</td>
              <td>
                {nextStatus(p.status) ? (
                  <button onClick={() => handleAdvanceStatus(p._id, p.status)}>
                    Mark as "{nextStatus(p.status)}"
                  </button>
                ) : (
                  "Completed ✅"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgencyDashboard;