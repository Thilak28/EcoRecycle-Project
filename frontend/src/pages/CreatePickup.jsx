import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./CreatePickup.css";
const CreatePickup = () => {
  const [form, setForm] = useState({
    category: "Mobile Phone",
    itemName: "",
    quantity: 1,
    condition: "Working",
    description: "",
    pickupAddress: "",
    preferredPickupDate: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      await api.post("/pickups", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Pickup request created!");
      setTimeout(() => navigate("/user/my-pickups"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create pickup request");
    }
  };

  return (
  <div className="pickup-page">
    <div className="pickup-card">

      <h2 className="pickup-title">
        ♻️ Create Pickup Request
      </h2>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Mobile Phone</option>
              <option>Laptop</option>
              <option>Battery</option>
              <option>Television</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Item Name</label>
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option>Working</option>
              <option>Not Working</option>
              <option>Damaged</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Pickup Address</label>
          <textarea
            rows="3"
            name="pickupAddress"
            value={form.pickupAddress}
            onChange={handleChange}
          />
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Preferred Pickup Date</label>
            <input
              type="date"
              name="preferredPickupDate"
              value={form.preferredPickupDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <div className="reward-box">
          <h3>🎁 Reward Points</h3>
          <p>
            Reward points will be calculated after pickup verification.
          </p>
        </div>

        <button className="submit-btn">
          Submit Pickup Request
        </button>

      </form>

    </div>
  </div>
);
};

export default CreatePickup;