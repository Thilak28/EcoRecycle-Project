import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const VerifyOtp = () => {
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/verify-otp", { email: state?.email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify OTP sent to {state?.email}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default VerifyOtp;