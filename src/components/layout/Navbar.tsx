"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut, User, Sparkles, RefreshCw } from "lucide-react";
import { useProductStore } from "@/context/ProductContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { localCreatedProducts, localUpdatedProducts, localDeletedIds, resetLocalOverrides } =
    useProductStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const localCount =
    localCreatedProducts.length +
    Object.keys(localUpdatedProducts).length +
    localDeletedIds.length;

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-3 font-black text-xl tracking-tight text-slate-900 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-none text-slate-900 font-extrabold flex items-center gap-2">
                  NexAdmin
                  <span className="text-[10px] uppercase font-black tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    PRO
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Product Inventory Management
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {localCount > 0 && (
              <div className="hidden md:flex items-center gap-2 bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs px-3 py-1.5 rounded-xl shadow-xs animate-fadeIn">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold">{localCount} local modification{localCount > 1 ? "s" : ""}</span>
                <button
                  onClick={resetLocalOverrides}
                  title="Reset local changes"
                  className="text-amber-800 hover:text-amber-950 font-bold ml-1.5 flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200/80 px-2 py-0.5 rounded-md transition"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.firstName || user.username}
                      width={38}
                      height={38}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 bg-slate-100 shadow-xs"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user.firstName ? user.firstName[0] : <User className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-bold text-slate-900 leading-tight">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">@{user.username}</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 active:bg-rose-200 border border-rose-200/80 rounded-xl transition-all shadow-xs ml-1 sm:ml-2 disabled:opacity-50"
                  title="Log out of admin dashboard"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
