"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Loader } from "@/components/common/Loader";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { LogIn } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated && pathname !== "/login") {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, mounted]);

  // Before hydration, render null smoothly to prevent flash
  if (!mounted || isLoading) {
    return null;
  }

  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <Loader message="Redirecting to login portal..." />
        <div className="mt-4">
          <Link href="/login">
            <Button variant="primary" leftIcon={<LogIn className="w-4 h-4" />}>
              Go to Login Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
