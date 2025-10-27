"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getToken } from "@/dal/auth/getToken";
import { isSuperAdmin as checkSuperAdmin } from "@/dal/auth/users";
import { getCurrentUser } from "@/dal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        console.log(user);
        if (!user.data) {
          setIsAuthenticated(false);
          setLoading(false);
          router.push("/auth");
          return;
        }

        setIsAuthenticated(true);

        // Check if user is super admin
        const superAdminStatus = user.data.role === "super_admin";
        console.log(superAdminStatus)
        setIsSuperAdmin(superAdminStatus);
        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setLoading(false);
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You need super admin privileges to access this area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
