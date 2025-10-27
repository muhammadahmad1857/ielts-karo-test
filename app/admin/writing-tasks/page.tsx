// eslint-disable @typescript-eslint/no-explicit-any
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
import { Trash2, Edit, Plus, Search, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { WritingTask } from "@/types";
import { deleteWritingTask, listWritingTasks } from "@/dal";

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function WritingTasksPage() {
  const [tasks, setTasks] = useState<WritingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "academic" | "general_training"
  >("all");
  const [filterPart, setFilterPart] = useState<"all" | "part_1" | "part_2">(
    "all"
  );
  const [filterBook, setFilterBook] = useState<string>("all");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  /* ------------------------------ Fetch Tasks ----------------------------- */
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterPart, filterBook]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { limit: 100 };
      if (filterType !== "all") params.ielts_type = filterType;
      if (filterPart !== "all") params.writing_task = filterPart;
      if (filterBook !== "all")
        params.book_number = Number.parseInt(filterBook);

      const res = await listWritingTasks(params);
      if (res.success && Array.isArray(res.data)) setTasks(res.data);
      else setTasks([]);
    } catch (error) {
      console.error("❌ Failed to fetch tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ Delete Task ----------------------------- */
  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await deleteWritingTask(taskId);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setSelectedTasks((prev) => {
          const copy = new Set(prev);
          copy.delete(taskId);
          return copy;
        });
      }
    } catch (error) {
      console.error("❌ Failed to delete task:", error);
    }
  };

  /* ----------------------------- Bulk Delete ------------------------------ */
  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return;
    if (!confirm(`Delete ${selectedTasks.size} tasks?`)) return;

    setBulkUpdating(true);
    try {
      await Promise.all(
        Array.from(selectedTasks).map((id) => deleteWritingTask(id))
      );
      setTasks((prev) => prev.filter((t) => !selectedTasks.has(t.id)));
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("❌ Bulk delete failed:", error);
    } finally {
      setBulkUpdating(false);
    }
  };

  /* ------------------------------- Select All ----------------------------- */
  const filteredTasks = tasks.filter((t) =>
    t.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const uniqueBooks = Array.from(
    new Set(
      tasks
        .map((t) => t.ielts_test_book?.book_number)
        .filter((b): b is number => !!b)
    )
  );

  /* ------------------------------- UI Render ------------------------------ */
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Writing Tasks</h1>
          <p className="text-muted-foreground">
            Manage IELTS writing tasks with advanced filtering
          </p>
        </div>
        <Link href="/admin/writing-tasks/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advanced Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* IELTS Type */}
            <Select
              value={filterType}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(v) => setFilterType(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="IELTS Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="general_training">
                  General Training
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Writing Part */}
            <Select
              value={filterPart}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(v) => setFilterPart(v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Writing Part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parts</SelectItem>
                <SelectItem value="part_1">Part 1</SelectItem>
                <SelectItem value="part_2">Part 2</SelectItem>
              </SelectContent>
            </Select>

            {/* Book */}
            <Select value={filterBook} onValueChange={(v) => setFilterBook(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Book Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                {uniqueBooks.map((b) => (
                  <SelectItem key={b} value={String(b)}>
                    Book {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTasks.size > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {selectedTasks.size} task(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={bulkUpdating}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete {selectedTasks.size}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
            {filteredTasks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelectAll}
                className="gap-2 bg-transparent"
              >
                {selectedTasks.size === filteredTasks.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" /> Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" /> Select All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={(e) => {
                      const copy = new Set(selectedTasks);
                      if (e.target.checked) copy.add(task.id);
                      else copy.delete(task.id);
                      setSelectedTasks(copy);
                    }}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">{task.question}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {task.ielts_type === "academic"
                          ? "Academic"
                          : "General"}
                      </span>
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                        {task.writing_task === "part_1" ? "Part 1" : "Part 2"}
                      </span>
                      {task.ielts_test_book?.book_number && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Book {task.ielts_test_book.book_number}
                        </span>
                      )}
                      {task.ielts_test_book?.test_number && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Test {task.ielts_test_book.test_number}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/writing-tasks/${task.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No writing tasks found
              </p>
              <Link href="/admin/writing-tasks/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Create First Task
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
