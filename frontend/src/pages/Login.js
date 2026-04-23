import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://lostnfounditemmanagementsystem.onrender.com/api/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />

          <button className="btn btn-success w-100">Login</button>
        </form>

        <p className="mt-3 text-center">
          New user? <Link to="/">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;