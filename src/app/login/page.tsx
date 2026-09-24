"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import { LayoutDashboard, Lock, User, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.replace(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  useEffect(() => {
    if (searchParams.get("expired")) {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!username.trim() || !password.trim()) {
      setError("Please provide both username and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login({ username, password });
      showToast("success", "Welcome Back!", `Successfully signed in as ${username}.`);
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please check your username and password.";
      setError(msg);
      showToast("error", "Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setError("");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">NexAdmin Portal</h1>
        <p className="text-xs text-gray-500">Sign in to access the product management dashboard</p>
      </div>

      <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-3.5 text-xs text-blue-900 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Demo Admin Credentials:
          </div>
          <div className="text-blue-700 font-mono text-[11px]">
            User: <span className="font-bold">emilys</span> | Pass:{" "}
            <span className="font-bold">emilyspass</span>
          </div>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg shrink-0 transition shadow-sm"
        >
          Use Demo
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
          autoComplete="username"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full rounded-xl mt-2"
        >
          Sign In to Dashboard
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-blue-50/40 to-indigo-50/30">
      <Suspense fallback={<Loader message="Loading portal..." />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
