/**
 * @deprecated This file is deprecated. Use `dal/writing-tasks/writing-tasks.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */

import { apiWithAuth } from "@/lib/axios";

// ==============================
// 🔹 Types & Interfaces
// ==============================

export interface WritingTaskBook {
  book_name: string;
  book_number: number;
  test_number: number;
}

export interface WritingTask {
  id: string;
  ielts_type: "academic" | "general_training";
  writing_task: "part_1" | "part_2";
  ielts_test_book: WritingTaskBook;
  question: string;
  question_image_id?: string | null;
  question_image_url?: string | null;
  model_answer?: string;
}

export interface WritingTaskStats {
  total_tasks: number;
  active_tasks: number;
  inactive_tasks: number;
  by_type: Record<string, number>;
  by_part: Record<string, number>;
}

// ==============================
// 🔹 API Functions
// ==============================

/**
 * Fetches overall statistics for writing tasks.
 * GET /writing-tasks/stats/summary
 */
export async function getWritingTaskStats(): Promise<{
  data: WritingTaskStats | null;
  success: boolean;
}> {
  try {
    const res = await apiWithAuth.get("/writing-tasks/stats/summary");
    return { data: res.data as WritingTaskStats, success: true };
  } catch (error) {
    console.error("❌ Error fetching writing task stats:", error);
    return { data: null, success: false };
  }
}

/**
 * Fetches list of writing tasks with optional filters.
 * GET /writing-tasks
 * Example filters: { ielts_type, writing_task, is_active, skip, limit }
 */
export interface WritingTaskFilter {
  ielts_type?: "academic" | "general_training";
  writing_task?: "part_1" | "part_2";
  is_active?: boolean;
  skip?: number;
  limit?: number;
}

export async function getWritingTasks(
  filters: WritingTaskFilter = {}
): Promise<{ data: WritingTask[]; success: boolean }> {
  try {
    const res = await apiWithAuth.get("/writing-tasks", { params: filters });
    return { data: Array.isArray(res.data) ? res.data : [], success: true };
  } catch (error) {
    console.error("❌ Error fetching writing tasks:", error);
    return { data: [], success: false };
  }
}

/**
 * Fetch a single writing task by ID.
 * GET /writing-tasks/:id
 */
export async function getWritingTaskById(
  id: string
): Promise<{ data: WritingTask | null; success: boolean }> {
  try {
    const res = await apiWithAuth.get(`/writing-tasks/${id}`);
    return { data: res.data as WritingTask, success: true };
  } catch (error) {
    console.error(`❌ Error fetching writing task ${id}:`, error);
    return { data: null, success: false };
  }
}
