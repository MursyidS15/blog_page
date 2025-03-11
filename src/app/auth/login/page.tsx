"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Backendless from "backendless";

Backendless.initApp("1EF12296-BF73-45D5-BAA4-089AE6D1CF2F", "D1DE0EEF-F2D8-4E6B-BD55-362FD56DE0A7"); // Ganti dengan kredensial Backendless kamu

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      router.push("../blogs");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await Backendless.UserService.logout(); // Logout user di perangkat lain sebelum login baru
      const user = await Backendless.UserService.login(email, password, true);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("../blogs");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required 
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required 
          />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
