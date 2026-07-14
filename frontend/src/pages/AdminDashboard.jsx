import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [agencyForm, setAgencyForm] = useState({
    name: "", email: "", password: "", phone: "", agencyName: "", serviceArea: "", workersCount: 0,
  });

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/dashboard");
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    }
  };

  const fetchAgencies = async () => {
    try {
      const { data } = await api.get("/admin/agencies");
      setAgencies(data.agencies);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load agencies");
    }
  };

  const fetchPickups = async () => {
    try {
      const { data } = await api.get("/admin/pickups");
      setPickups(data.pickups);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load pickups");
    }
  };

  useEffect(() => {
    setError("");
    if (tab === "overview") fetchStats();
    if (tab === "users") fetchUsers();
    if (tab === "agencies") fetchAgencies();
    if (tab === "assign") {
      fetchPickups();
      fetchAgencies();
    }
  }, [tab]);

  const handleToggleBlock = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/block`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleAgencyFormChange = (e) =>
    setAgencyForm({ ...agencyForm, [e.target.name]: e.target.value });

  const handleCreateAgency = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/admin/agencies", agencyForm);
      setSuccess("Agency created successfully");
      setAgencyForm({ name: "", email: "", password: "", phone: "", agencyName: "", serviceArea: "", workersCount: 0 });
      fetchAgencies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create agency");
    }
  };

  const handleAssign = async (pickupId, agencyId) => {
    if (!agencyId) return;
    try {
      await api.put(`/admin/assign-agency/${pickupId}`, { agencyId });
      fetchPickups();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign agency");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="portal-tabs" style={{ marginBottom: 20 }}>
        <button className={tab === "overview" ? "tab active" : "tab"} onClick={() => setTab("overview")}>Overview</button>
        <button className={tab === "users" ? "tab active" : "tab"} onClick={() => setTab("users")}>Users</button>
        <button className={tab === "agencies" ? "tab active" : "tab"} onClick={() => setTab("agencies")}>Agencies</button>
        <button className={tab === "assign" ? "tab active" : "tab"} onClick={() => setTab("assign")}>Assign Pickups</button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* OVERVIEW TAB */}
      {tab === "overview" && stats && (
        <div className="stats-grid">
          <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
          <div className="stat-card"><h3>{stats.totalAgencies}</h3><p>Total Agencies</p></div>
          <div className="stat-card"><h3>{stats.pending}</h3><p>Pending</p></div>
          <div className="stat-card"><h3>{stats.assigned}</h3><p>Assigned</p></div>
          <div className="stat-card"><h3>{stats.completed}</h3><p>Completed</p></div>
          <div className="stat-card"><h3>{stats.cancelled}</h3><p>Cancelled</p></div>
          <div className="stat-card"><h3>{stats.totalRewardPointsDistributed}</h3><p>Reward Points Distributed</p></div>

          <div style={{ gridColumn: "1 / -1" }}>
            <h3>Category-wise Collection</h3>
            <table>
              <thead><tr><th>Category</th><th>Count</th></tr></thead>
              <tbody>
                {Object.entries(stats.categoryWiseCollection).map(([cat, count]) => (
                  <tr key={cat}><td>{cat}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {tab === "users" && (
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Reward Points</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.rewardPoints}</td>
                <td>{u.isBlocked ? "Blocked" : "Active"}</td>
                <td>
                  <button className="btn-primary" onClick={() => handleToggleBlock(u._id)}>
                    {u.isBlocked ? "Activate" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* AGENCIES TAB */}
      {tab === "agencies" && (
        <>
          <form onSubmit={handleCreateAgency} className="auth-form" style={{ maxWidth: 500, marginBottom: 30 }}>
            <h3>Create New Agency</h3>
            <input name="name" placeholder="Contact person name" value={agencyForm.name} onChange={handleAgencyFormChange} required />
            <input name="email" type="email" placeholder="Email" value={agencyForm.email} onChange={handleAgencyFormChange} required />
            <input name="password" type="password" placeholder="Password" value={agencyForm.password} onChange={handleAgencyFormChange} required />
            <input name="phone" placeholder="Phone" value={agencyForm.phone} onChange={handleAgencyFormChange} required />
            <input name="agencyName" placeholder="Agency name" value={agencyForm.agencyName} onChange={handleAgencyFormChange} required />
            <input name="serviceArea" placeholder="Service area" value={agencyForm.serviceArea} onChange={handleAgencyFormChange} />
            <input name="workersCount" type="number" placeholder="Number of workers" value={agencyForm.workersCount} onChange={handleAgencyFormChange} />
            <button type="submit" className="btn-primary">Create Agency</button>
          </form>

          <table>
            <thead>
              <tr><th>Agency Name</th><th>Email</th><th>Phone</th><th>Service Area</th><th>Workers</th></tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <tr key={a._id}>
                  <td>{a.agencyName}</td>
                  <td>{a.email}</td>
                  <td>{a.phone}</td>
                  <td>{a.serviceArea}</td>
                  <td>{a.workersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ASSIGN PICKUPS TAB */}
      {tab === "assign" && (
        <table>
          <thead>
            <tr><th>Item</th><th>User</th><th>Status</th><th>Assigned Agency</th><th>Assign to</th></tr>
          </thead>
          <tbody>
            {pickups.map((p) => (
              <tr key={p._id}>
                <td>{p.itemName} ({p.category})</td>
                <td>{p.user?.name}</td>
                <td>{p.status}</td>
                <td>{p.assignedAgency?.agencyName || "—"}</td>
                <td>
                  <select defaultValue="" onChange={(e) => handleAssign(p._id, e.target.value)}>
                    <option value="" disabled>Select agency</option>
                    {agencies.map((a) => (
                      <option key={a._id} value={a._id}>{a.agencyName}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;