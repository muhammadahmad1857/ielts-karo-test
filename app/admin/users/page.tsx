"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Shield, User, Search } from "lucide-react";
import {
  listAllUsers,
  updateUserRole,
  updateUserById,
  deleteUserById,
} from "@/dal";
import type { User as UserType } from "@/types";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<
    "all" | "student" | "super_admin"
  >("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (filterRole !== "all") params.role = filterRole;

      const response = await listAllUsers({
        ...params,
        role: filterRole !== "all" ? filterRole : undefined,
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "student" | "super_admin"
  ) => {
    setUpdatingUserId(userId);
    try {
      const response = await updateUserRole(userId, newRole);
      if (response.success && response.data) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success("User role updated successfully");
      } else {
        toast.error(response.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleActiveToggle = async (userId: string, isActive: boolean) => {
    setUpdatingUserId(userId);
    try {
      const response = await updateUserById(userId, { is_active: isActive });
      if (response.success && response.data) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, is_active: isActive } : u
          )
        );
        toast.success(
          `User ${isActive ? "activated" : "deactivated"} successfully`
        );
      } else {
        toast.error(response.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${userEmail}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const response = await deleteUserById(userId);
      if (response.success) {
        setUsers(users.filter((u) => u.id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(response.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filterRole}
              onValueChange={(value: any) => setFilterRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-medium">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={user.role}
                          onValueChange={(value: any) =>
                            handleRoleChange(user.id, value)
                          }
                          disabled={updatingUserId !== null}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Student
                              </div>
                            </SelectItem>
                            <SelectItem value="super_admin">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Super Admin
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={user.is_active ? "active" : "inactive"}
                          onValueChange={(value) =>
                            handleActiveToggle(user.id, value === "active")
                          }
                          disabled={updatingUserId !== null}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">
                              <span className="text-green-600 font-medium">
                                Active
                              </span>
                            </SelectItem>
                            <SelectItem value="inactive">
                              <span className="text-red-600 font-medium">
                                Inactive
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteUser(user.id, user.email)
                            }
                            disabled={updatingUserId !== null}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
