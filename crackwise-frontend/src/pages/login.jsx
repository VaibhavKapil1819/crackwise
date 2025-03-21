// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginService from '../Services/loginservice';
import '../Styles/login.css';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (email === '' || password === '') {
      setError('Please fill in both fields');
      return;
    }

    try {
      const response = await loginService(email, password);

      if (response.status === 200) {
        setError('');
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error(error);
    }
  };

  return (

    <div className="login-container">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>

  );
};

export default LoginPage;
