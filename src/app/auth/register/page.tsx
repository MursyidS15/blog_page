"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Backendless from "backendless";

// Konfigurasi Backendless
const APP_ID = "1EF12296-BF73-45D5-BAA4-089AE6D1CF2F";
const API_KEY = "D1DE0EEF-F2D8-4E6B-BD55-362FD56DE0A7";
Backendless.initApp(APP_ID, API_KEY);

interface RegisterForm {
  email: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await Backendless.Data.of("Users").find({ where: `email = '${data.email}'` });
      if (existingUser.length > 0) {
        setError("Email already registered!");
        return;
      }

      // Registrasi user ke Backendless
      await Backendless.UserService.register({ email: data.email, password: data.password });

      // Redirect ke halaman login setelah sukses
      router.push("/");
    } catch (err) {
      console.error("Registration Error:", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-4">Register</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input type="email" {...register("email", { required: true })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input type="password" {...register("password", { required: true })} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500" />
          </div>
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account? <Link href="/auth/login" className="text-green-700 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
