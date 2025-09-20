"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SigninSchema } from "@repo/types";
import { User, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import Topbar from "@repo/ui/topbar";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const validated = SigninSchema.parse(formData);

      const response = await axios.post(
        `${BACKEND_URL}/auth/signin`,
        validated
      );

      const data = response.data as { token: string };

      localStorage.setItem("token", data.token);
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signin error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error("Account not found. Please check your email or sign up.");
      } else if (error.response?.status === 401) {
        toast.error("Invalid password. Please try again.");
      } else if (error.response?.status === 400) {
        toast.error("Please check your email and password format.");
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <Topbar />
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 pt-5 px-4">
        <div className="max-w-md w-full space-y-8">
          {" "}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          </div>
          <form
            className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    required
                    minLength={4}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
