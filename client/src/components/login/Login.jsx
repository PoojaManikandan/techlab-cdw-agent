import React, { useState } from "react";
import "./Login.css";
import apiClient from "../../api/api";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login submitted", { username, password });
    try {
      const res = await apiClient.post('/login', {
        username,
        password
      });
      console.log("Login response:", res.data);

      localStorage.setItem('jwtToken', res.data.access_token);
      localStorage.setItem('sessionId', res.data.session_id);
      localStorage.setItem('adkAppName', res.data.adk_app_name);
      localStorage.setItem('userId', res.data.user_id);
      
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    }
    
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
