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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  RotateCcw,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { WritingTask } from "@/types";
import { listWritingTasks, restoreWritingTask } from "@/dal";

/* -------------------------------------------------------------------------- */
/*                            RESTORE TASKS PAGE                              */
/* -------------------------------------------------------------------------- */

export default function RestoreWritingTasksPage() {
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
  const [bulkRestoring, setBulkRestoring] = useState(false);
  const [restoringTaskId, setRestoringTaskId] = useState<string | null>(null);
  const [bulkRestoreDialogOpen, setBulkRestoreDialogOpen] = useState(false);
  const [isRestoringBulk, setIsRestoringBulk] = useState(false);

  /* ------------------------------ Fetch Tasks ----------------------------- */
  useEffect(() => {
    fetchDeletedTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterPart, filterBook]);

  const fetchDeletedTasks = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = { limit: 100, is_active: false };
      if (filterType !== "all") params.ielts_type = filterType;
      if (filterPart !== "all") params.writing_task = filterPart;
      if (filterBook !== "all")
        params.book_number = Number.parseInt(filterBook);

      const res = await listWritingTasks(params);
      if (res.success && Array.isArray(res.data)) setTasks(res.data);
      else setTasks([]);
    } catch (error) {
      console.error("❌ Failed to fetch deleted tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ Restore Task ------------------------------ */
  const handleRestore = async (taskId: string) => {
    setRestoringTaskId(taskId);
    try {
      const res = await restoreWritingTask(taskId);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        setSelectedTasks((prev) => {
          const copy = new Set(prev);
          copy.delete(taskId);
          return copy;
        });
        toast.success("✅ Task restored successfully!");
      } else {
        toast.error("❌ Failed to restore task: " + res.error);
      }
    } catch (error) {
      console.error("❌ Failed to restore task:", error);
      toast.error("❌ Error restoring task");
    } finally {
      setRestoringTaskId(null);
    }
  };

  /* ----------------------------- Bulk Restore ------------------------------ */
  const handleBulkRestore = async () => {
    if (selectedTasks.size === 0) return;
    setBulkRestoreDialogOpen(true);
  };

  const confirmBulkRestore = async () => {
    setBulkRestoreDialogOpen(false);
    setBulkRestoring(true);
    setIsRestoringBulk(true);
    try {
      const results = await Promise.all(
        Array.from(selectedTasks).map((id) => restoreWritingTask(id))
      );

      const successCount = results.filter((r) => r.success).length;
      setTasks((prev) => prev.filter((t) => !selectedTasks.has(t.id)));
      setSelectedTasks(new Set());

      if (successCount === selectedTasks.size) {
        toast.success(`✅ Successfully restored ${successCount} tasks!`);
      } else {
        toast.warning(
          `⚠️ Restored ${successCount}/${selectedTasks.size} tasks. Some failed.`
        );
      }
    } catch (error) {
      console.error("❌ Bulk restore failed:", error);
      toast.error("❌ Bulk restore failed");
    } finally {
      setBulkRestoring(false);
      setIsRestoringBulk(false);
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
      {/* Bulk Restore Dialog */}
      <AlertDialog
        open={bulkRestoreDialogOpen}
        onOpenChange={setBulkRestoreDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Restore {selectedTasks.size} Tasks
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore {selectedTasks.size} task(s)?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoringBulk}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkRestore}
              disabled={isRestoringBulk}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isRestoringBulk ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                "Restore"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restore Writing Tasks</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <AlertCircle className="w-4 h-4" />
            Manage deleted IELTS writing tasks
          </p>
        </div>
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
                  onClick={handleBulkRestore}
                  disabled={bulkRestoring}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {bulkRestoring ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  {bulkRestoring
                    ? "Restoring..."
                    : `Restore ${selectedTasks.size}`}
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
            <CardTitle>Deleted Tasks ({filteredTasks.length})</CardTitle>
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
                <p>Loading deleted tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors border-destructive/20"
                >
                  {/* <input
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
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        Deleted
                      </span>
                    </div>
                  </div> */}
                    <div className="flex items-center gap-2 max-w-[60%]">
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
                    <div className="flex-1 max-w-[100%]">
                      <p className="font-medium line-clamp-1 truncate">
                        {task.question}
                      </p>
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
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRestore(task.id)}
                      disabled={restoringTaskId === task.id}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      {restoringTaskId === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      {restoringTaskId === task.id ? "Restoring..." : "Restore"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No deleted writing tasks found
              </p>
              <p className="text-sm text-muted-foreground">
                All your writing tasks are active and safe!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
