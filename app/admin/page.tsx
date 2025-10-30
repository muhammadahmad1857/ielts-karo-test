"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ImageIcon, Plus, TrendingUp } from "lucide-react";
import { WritingTask } from "@/types";
import { getMediaStats, getWritingTaskStats, listWritingTasks } from "@/dal";
import { getAllUsers } from "@/dal/auth/users";

interface DashboardStats {
  total_tasks: number;
  active_tasks: number;
  total_media?: number;
  total_users?: number;
  tasks_by_type?: Record<string, number>;
  media_by_type?: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_tasks: 0,
    active_tasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<WritingTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from DAL
        const [taskStats, tasks, media] = await Promise.all([
          getWritingTaskStats(),
          listWritingTasks(),
          // Add user and media fetching here
          getMediaStats(),
        ]);

        // Update stats
        setStats({
          total_tasks: taskStats?.data?.total_tasks || 0,
          active_tasks: taskStats?.data?.active_tasks || 0,
          total_media: media?.data?.total_files || 0,
          total_users: 0, // placeholder if you add user stats later
          tasks_by_type: taskStats?.data?.tasks_by_type || {},
        });

        // Update tasks
        if (Array.isArray(tasks.data)) {
          setRecentTasks(tasks.data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total_tasks,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Tasks",
      value: stats.active_tasks,
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Media Files",
      value: stats.total_media || 0,
      icon: ImageIcon,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Users",
      value: stats.total_users || 0,
      icon: Users,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to IELTS Karo Admin Panel
          </p>
        </div>
        <Link href="/admin/writing-tasks/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading statistics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {card.title === "Active Tasks" && "Currently active"}
                      {card.title === "Total Tasks" && "All time"}
                      {card.title === "Media Files" && "Uploaded"}
                      {card.title === "Total Users" && "Registered"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Writing Tasks</CardTitle>
              <CardDescription>Latest 5 active writing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 max-w-[60%]">
                        <p className="font-medium line-clamp-2 truncate">
                          {task.question}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {task.ielts_type}
                          </span>
                          <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                            {task.writing_task}
                          </span>
                        </div>
                      </div>
                      <Link href={`/admin/writing-tasks/${task.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No writing tasks yet</p>
                  <Link href="/admin/writing-tasks/new">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                    >
                      Create First Task
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/writing-tasks">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <FileText className="w-4 h-4" />
                    Manage Tasks
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Users className="w-4 h-4" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/writing-tasks/new">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <Plus className="w-4 h-4" />
                    New Task
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
