/**
 * @deprecated This file is deprecated. Use `dal/writing-tasks/writing-tasks.ts` instead.
 * See `dal/MIGRATION.md` for migration guide.
 */

import { apiWithAuth } from "@/lib/axios";

export interface IELTSBook {
  book_name: string;
  book_number: number;
  test_number: number;
}

export interface WritingTask {
  id: string;
  ielts_type: "academic" | "general";
  writing_task: "part_1" | "part_2";
  ielts_test_book: IELTSBook;
  question: string;
  question_image_url?: string | null;
  question_image_id?: string | null;
  model_answer?: string;
}

export interface WritingTaskStats {
  total_tasks: number;
  active_tasks: number;
  total_media: number;
  total_users: number;
  tasks_by_type: Record<string, number>;
  media_by_type: Record<string, number>;
}

/* ---------------------- CREATE TASK ---------------------- */
export async function createWritingTask(payload: {
  ielts_type: string;
  writing_task: string;
  ielts_test_book: IELTSBook;
  question: string;
  question_image_url?: string;
  model_answer?: string;
}) {
  try {
    const res = await apiWithAuth.post("/writing-tasks/", payload);
    return { data: res.data, success: true };
  } catch (error: any) {
    console.error("❌ createWritingTask error:", error);
    return {
      data: null,
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

/* ---------------------- UPDATE TASK ---------------------- */
export async function updateWritingTask(
  id: string,
  payload: Partial<WritingTask>
) {
  try {
    const res = await apiWithAuth.patch(`/writing-tasks/${id}`, payload);
    return { data: res.data, success: true };
  } catch (error: any) {
    console.error("❌ updateWritingTask error:", error);
    return {
      data: null,
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

/* ---------------------- DELETE TASK ---------------------- */
export async function deleteWritingTask(id: string) {
  try {
    const res = await apiWithAuth.delete(`/writing-tasks/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("❌ deleteWritingTask error:", error);
    return { success: false, error: error.response?.data || error.message };
  }
}
