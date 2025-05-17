import { useState } from "react";
import { useSession } from "../contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const LoginPage = () => {
  const [username, setUsername] = useState("ngocphatc2710@gmail.com");
  const [password, setPassword] = useState("chaungocphat123");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useSession();

  const handleLogin = async () => {
    const result = await login(username, password);
    if (result) {
      setError(null);
      navigate("/");
    } else {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex flex-col items-center justify-center p-6">
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-3xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-yellow-400 font-extrabold text-3xl mb-2 text-center tracking-wide font-sfpro">
          Locket Login
        </h1>

        <input
          type="text"
          placeholder="Email or Username"
          className="bg-white/10 placeholder-white/60 text-white rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          autoComplete="username"
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-white/10 placeholder-white/60 text-white rounded-xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete="current-password"
        />

        <Button title="Login" onClick={handleLogin} />

        {error && (
          <div className="text-red-400 font-semibold text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
