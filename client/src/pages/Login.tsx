import {
  FormEvent,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import axiosInstance from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [isLogin, setIsLogin] =
    useState(true);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const requestData = isLogin
        ? {
            email: email.trim(),
            password,
          }
        : {
            fullName: fullName.trim(),
            email: email.trim(),
            password,
          };

      const response =
        await axiosInstance.post(
          endpoint,
          requestData
        );

      console.log(
        "Authentication response:",
        response.data
      );

      const token =
        response.data?.token;

      const user =
        response.data?.user;

      if (!token || !user) {
        throw new Error(
          "Authentication succeeded but the server did not return a token and user."
        );
      }

      // Save authentication
      login(token, user);

      // Go directly to dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.error(
        "Authentication error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Authentication failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">

        <h1 className="text-3xl font-bold mb-2">
          {isLogin
            ? "Welcome Back"
            : "Create Account"}
        </h1>

        <p className="mb-6 text-gray-500">
          {isLogin
            ? "Sign in to continue to Digital Heroes."
            : "Create your Digital Heroes account."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
              autoComplete="name"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
            autoComplete={
              isLogin
                ? "current-password"
                : "new-password"
            }
            required
          />

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-4 py-3 font-semibold bg-black text-white disabled:opacity-50"
          >
            {loading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-600 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
}