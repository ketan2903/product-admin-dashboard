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
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      setHasRedirected(true);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader message="Verifying session..." />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <Loader message="Redirecting to sign-in portal..." />
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
