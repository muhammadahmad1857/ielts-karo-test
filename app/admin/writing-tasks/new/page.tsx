"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";
import { WritingTaskCreate } from "@/types";
import { createWritingTask } from "@/dal";

export default function NewWritingTaskPage() {
  const router = useRouter();

  const [task, setTask] = useState<Partial<WritingTaskCreate>>({
    ielts_type: "academic",
    writing_task: "part_1",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!task.question || !task.model_answer) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      task.ielts_test_book?.book_number &&
      task.ielts_test_book.book_number <= 1
    ) {
      toast.error("Book number must be greater than 1");
      return;
    }

    if (
      task.ielts_test_book?.test_number &&
      task.ielts_test_book.test_number <= 1
    ) {
      toast.error("Test number must be greater than 1");
      return;
    }

    setSaving(true);
    try {
      const payload: WritingTaskCreate = {
        ielts_type: task.ielts_type || "academic",
        writing_task: task.writing_task || "part_1",
        question: task.question,
        model_answer: task.model_answer,
        ielts_test_book: task.ielts_test_book,
        question_image_url: task.question_image_url,
        question_image_id: task.question_image_id,
      };
      await createWritingTask(payload);
      toast.success("Task created successfully");
      router.push("/admin/writing-tasks");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/writing-tasks">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Writing Task</h1>
          <p className="text-muted-foreground">
            Create a new IELTS writing task
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">IELTS Type *</label>
              <Select
                value={task.ielts_type}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(value: any) =>
                  setTask({ ...task, ielts_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="general_training">
                    General Training
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Writing Part *</label>
              <Select
                value={task.writing_task}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(value: any) =>
                  setTask({ ...task, writing_task: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="part_1">Part 1</SelectItem>
                  <SelectItem value="part_2">Part 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Book Number</label>
              <Input
                type="number"
                value={task.ielts_test_book?.book_number || ""}
                onChange={(e) =>
                  setTask({
                    ...task,
                    ielts_test_book: {
                      ...task.ielts_test_book,
                      book_number: e.target.value
                        ? Number.parseInt(e.target.value)
                        : undefined,
                    },
                  })
                }
                placeholder="e.g., 17"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Test Number</label>
              <Input
                type="number"
                value={task.ielts_test_book?.test_number || ""}
                onChange={(e) =>
                  setTask({
                    ...task,
                    ielts_test_book: {
                      ...task.ielts_test_book,
                      test_number: e.target.value
                        ? Number.parseInt(e.target.value)
                        : undefined,
                    },
                  })
                }
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question *</label>
            <Textarea
              value={task.question || ""}
              onChange={(e) => setTask({ ...task, question: e.target.value })}
              placeholder="Enter the writing task question..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Model Answer *</label>
            <Textarea
              value={task.model_answer || ""}
              onChange={(e) =>
                setTask({ ...task, model_answer: e.target.value })
              }
              placeholder="Enter the model answer..."
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Question Image</label>
            <ImageUpload
              onUpload={(url: string) =>
                setTask({ ...task, question_image_url: url })
              }
            />
           
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Create Task"}
            </Button>
            <Link href="/admin/writing-tasks">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
