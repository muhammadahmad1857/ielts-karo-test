"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  LogOut,
} from "lucide-react";
import { logout } from "@/dal";
import { LogoutButton } from "./auth/LogOutButton";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/writing-tasks", label: "Writing Tasks", icon: FileText },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/media", label: "Media", icon: ImageIcon },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">IELTS Karo</h1>
        <p className="text-sm text-sidebar-foreground/60">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
        
      <div className="p-4 border-t border-sidebar-border">
        <LogoutButton logout={logout} />
      </div>
    </aside>
  );
}
