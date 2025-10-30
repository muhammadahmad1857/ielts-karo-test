// eslint-disable @typescript-eslint/no-explicit-any
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
  Menu,
  ChevronDown,
} from "lucide-react";
import { logout } from "@/dal";
import { LogoutButton } from "./auth/LogOutButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/admin/writing-tasks",
      label: "Writing Tasks",
      icon: FileText,
      subItems: [
        { href: "/admin/writing-tasks", label: "All Tasks" },
        { href: "/admin/writing-tasks/restore", label: "Restore Tasks" },
      ],
    },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/media", label: "Media", icon: ImageIcon },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">IELTS Karo</h1>
        <p className="text-sm text-sidebar-foreground/60">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const hasSubItems =
            (item as any).subItems && (item as any).subItems.length > 0;
          const isMenuExpanded = expandedMenu === item.href;
          const isActive = pathname === item.href;
          if (hasSubItems) {
            return (
              <div key={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between gap-2",
                    isActive &&
                      "bg-sidebar-primary transition text-sidebar-primary-foreground hover:text-white hover:bg-sidebar-primary/90"
                  )}
                  onClick={() =>
                    setExpandedMenu(isMenuExpanded ? null : item.href)
                  }
                >
                  <div className="flex gap-2 items-center">
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isMenuExpanded && "rotate-180"
                    )}
                  />
                </Button>

                {isMenuExpanded && (
                  <div className="mt-2 ml-4 space-y-1 border-l border-sidebar-border pl-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(item as any).subItems.map(
                      (subItem: { href: string; label: string }) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start gap-2 text-sm",
                                isSubActive &&
                                  "bg-sidebar-primary transition text-sidebar-primary-foreground hover:text-white hover:bg-sidebar-primary/90"
                              )}
                            >
                              {subItem.label}
                            </Button>
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  isActive &&
                    "bg-sidebar-primary transition text-sidebar-primary-foreground hover:text-white hover:bg-sidebar-primary/90"
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
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-sidebar text-sidebar-foreground"
          >
            <aside className="flex flex-col h-full">
              <SidebarContent />
            </aside>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
