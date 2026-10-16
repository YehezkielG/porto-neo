import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginApi } from "../api/backendApi";
import Alert from "../components/Alert";
import type { FormEvent } from 'react';
import type { AlertState } from '../types';

const Login = () => {
  const navigate = useNavigate();
  const { token, user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'success', message: '' });

  useEffect(() => {
    document.title = "Portfolio Login";
    if (token && user) navigate("/dashboard");
  }, [token, user, navigate]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !password) {
      setAlert({ show: true, type: "error", message: "Username and password are required." });
      return;
    }
    try {
      const response = await LoginApi(username, password);
      if (response.data.status === "success") {
        login(response.data.token, response.data.user);
        navigate("/dashboard");
      } else setAlert({ show: true, type: "error", message: response.data.message });
    } catch (error) {
      setAlert({ show: true, type: "error", message: error.response?.data?.message || "Login failed. Check your connection to the server." });
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-5 py-10">
      <section className="w-full max-w-[380px] border-2 border-black bg-[var(--surface)] p-6 shadow-[7px_7px_0_var(--shadow-color)]">
        <form onSubmit={handleLogin}>
          <h1 className="mb-5 text-center text-3xl font-black text-[var(--paper)]">Admin Login</h1>
          <label className="mb-1 block text-[13px] font-extrabold text-[var(--paper)]" htmlFor="username">Username</label>
          <input className="mb-4 w-full border-2 border-black bg-[var(--surface)] px-3 py-3 text-[var(--paper)] shadow-[3px_3px_0_var(--shadow-color)] outline-none focus-visible:outline-2 focus-visible:outline-[#168aad]" id="username" type="text" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" />
          <label className="mb-1 block text-[13px] font-extrabold text-[var(--paper)]" htmlFor="password">Password</label>
          <input className="mb-4 w-full border-2 border-black bg-[var(--surface)] px-3 py-3 text-[var(--paper)] shadow-[3px_3px_0_var(--shadow-color)] outline-none focus-visible:outline-2 focus-visible:outline-[#168aad]" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          <button className="inline-flex min-h-[42px] w-full items-center justify-center border-2 border-black bg-[var(--lime)] px-4 py-2 text-sm font-black text-[#080a12] shadow-[4px_4px_0_var(--shadow-color)]" type="submit">Sign In</button>
        </form>
        <div className="mt-4 text-center"><Link className="text-[13px] text-[var(--accent)] hover:underline" to="/">← Back to Public Site</Link></div>
      </section>
      <Alert alert={alert} setAlert={setAlert} />
    </main>
  );
};

export default Login;
