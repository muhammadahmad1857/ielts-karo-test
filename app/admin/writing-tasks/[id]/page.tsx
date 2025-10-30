"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2, Copy } from "lucide-react";
import Link from "next/link";
import { WritingTask } from "@/types";
import { getWritingTaskById } from "@/dal";
import { toast } from "sonner";

export default function ViewWritingTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<WritingTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await getWritingTaskById(taskId);
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
      toast.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Task not found</p>
          <Link href="/admin/writing-tasks">
            <Button className="mt-4">Back to Tasks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/writing-tasks">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Writing Task Details</h1>
            <p className="text-muted-foreground">
              View and review task information
            </p>
          </div>
        </div>
        <Link href={`/admin/writing-tasks/${taskId}/edit`}>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4" />
            Edit Task
          </Button>
        </Link>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">IELTS Type</p>
            <div className="mt-2 inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full font-medium">
              {task.ielts_type === "academic" ? "Academic" : "General Training"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Writing Part</p>
            <p className="text-2xl font-bold mt-2">
              {task.writing_task.replace("_", " ").toUpperCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Book Number</p>
            <p className="text-2xl font-bold mt-2">
              {task.ielts_test_book?.book_number || "-"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Test Number</p>
            <p className="text-2xl font-bold mt-2">
              {task.ielts_test_book?.test_number || "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Question Image */}
      {task.question_image_url && (
        <Card>
          <CardHeader>
            <CardTitle>Question Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full bg-muted rounded-lg overflow-hidden">
              <img
                src={task.question_image_url}
                alt="Question"
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {task.question_image_url}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Question Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Question</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(task.question, "Question")}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed">
            {task.question}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Word count: {task.question.split(/\s+/).length} words
          </p>
        </CardContent>
      </Card>

      {/* Model Answer Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Model Answer</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(task.model_answer || "", "Model Answer")
            }
          >
            <Copy className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap break-words text-sm leading-relaxed">
            {task.model_answer}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Word count: {task.model_answer?.split(/\s+/).length || 0} words
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link href={`/admin/writing-tasks/${taskId}/edit`}>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Edit2 className="w-4 h-4" />
            Edit Task
          </Button>
        </Link>
        <Link href="/admin/writing-tasks">
          <Button variant="outline">Back to Tasks</Button>
        </Link>
      </div>
    </div>
  );
}
