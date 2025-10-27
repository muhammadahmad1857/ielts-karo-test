/**
 * Writing Tasks Data Access Layer
 * Handles IELTS writing task API calls
 */
// eslint-disable @typescript-eslint/no-explicit-any
import { apiWithAuth } from "@/lib/axios";
import type {
  ApiResponse,
  WritingTask,
  WritingTaskCreate,
  WritingTaskUpdate,
  WritingTaskFilters,
  WritingTaskStats,
  IELTSType,
  WritingTaskPart,
  ObjectId,
} from "@/types";

/**
 * Create a new writing task
 * Requires super admin role
 *
 * @param taskData - Writing task creation data
 * @returns ApiResponse with created task
 */
export async function createWritingTask(
  taskData: WritingTaskCreate
): Promise<ApiResponse<WritingTask>> {
  try {
    const { data } = await apiWithAuth.post<WritingTask>(
      "/writing-tasks/",
      taskData
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to create writing task";

    if (Array.isArray(errorDetail)) {
      errorMessage = errorDetail[0]?.msg || errorMessage;
    } else if (typeof errorDetail === "string") {
      errorMessage = errorDetail;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    return {
      data: null,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * List all writing tasks with optional filters
 * Requires authentication
 *
 * @param filters - Optional filters for IELTS type, task part, book number, etc.
 * @returns ApiResponse with array of writing tasks
 */
export async function listWritingTasks(
  filters?: WritingTaskFilters
): Promise<ApiResponse<WritingTask[]>> {
  try {
    const { data } = await apiWithAuth.get<WritingTask[]>("/writing-tasks/", {
      params: filters,
    });

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch writing tasks",
    };
  }
}

/**
 * Get a specific writing task by ID
 * Requires authentication
 *
 * @param taskId - Writing task ID
 * @returns ApiResponse with writing task
 */
export async function getWritingTaskById(
  taskId: ObjectId
): Promise<ApiResponse<WritingTask>> {
  try {
    const { data } = await apiWithAuth.get<WritingTask>(
      `/writing-tasks/${taskId}`
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch writing task",
    };
  }
}

/**
 * Update an existing writing task
 * Requires super admin role
 *
 * @param taskId - Writing task ID
 * @param taskData - Writing task update data
 * @returns ApiResponse with updated task
 */
export async function updateWritingTask(
  taskId: ObjectId,
  taskData: WritingTaskUpdate
): Promise<ApiResponse<WritingTask>> {
  try {
    const { data } = await apiWithAuth.put<WritingTask>(
      `/writing-tasks/${taskId}`,
      taskData
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    const errorDetail = err.response?.data?.detail;
    let errorMessage = "Failed to update writing task";

    if (Array.isArray(errorDetail)) {
      errorMessage = errorDetail[0]?.msg || errorMessage;
    } else if (typeof errorDetail === "string") {
      errorMessage = errorDetail;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }

    return {
      data: null,
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Delete a writing task (soft delete)
 * Requires super admin role
 * Marks the task as inactive instead of permanently deleting
 *
 * @param taskId - Writing task ID
 * @returns ApiResponse with void data
 */
export async function deleteWritingTask(
  taskId: ObjectId
): Promise<ApiResponse<void>> {
  try {
    await apiWithAuth.delete(`/writing-tasks/${taskId}`);

    return {
      data: null,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to delete writing task",
    };
  }
}

/**
 * Restore a soft-deleted writing task
 * Requires super admin role
 *
 * @param taskId - Writing task ID
 * @returns ApiResponse with restored task
 */
export async function restoreWritingTask(
  taskId: ObjectId
): Promise<ApiResponse<WritingTask>> {
  try {
    const { data } = await apiWithAuth.post<WritingTask>(
      `/writing-tasks/${taskId}/restore`
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to restore writing task",
    };
  }
}

/**
 * Get writing tasks from a specific Cambridge IELTS book
 * Requires authentication
 *
 * @param bookNumber - Cambridge IELTS book number
 * @param testNumber - Optional specific test number (1-4)
 * @returns ApiResponse with array of writing tasks
 */
export async function getTasksByBook(
  bookNumber: number,
  testNumber?: number
): Promise<ApiResponse<WritingTask[]>> {
  try {
    const params = testNumber ? { test_number: testNumber } : {};
    const { data } = await apiWithAuth.get<WritingTask[]>(
      `/writing-tasks/by-book/${bookNumber}`,
      { params }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch tasks by book",
    };
  }
}

/**
 * Get writing tasks filtered by IELTS type and task part
 * Requires authentication
 *
 * @param ieltsType - IELTS type (academic/general_training)
 * @param writingTask - Writing task part (part_1/part_2)
 * @returns ApiResponse with array of writing tasks
 */
export async function getTasksByTypeAndPart(
  ieltsType: IELTSType,
  writingTask: WritingTaskPart
): Promise<ApiResponse<WritingTask[]>> {
  try {
    const { data } = await apiWithAuth.get<WritingTask[]>(
      "/writing-tasks/filter/by-type-and-part",
      {
        params: {
          ielts_type: ieltsType,
          writing_task: writingTask,
        },
      }
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch tasks by type and part",
    };
  }
}

/**
 * Get statistics about writing tasks
 * Requires authentication
 *
 * @returns ApiResponse with task statistics
 */
export async function getWritingTaskStats(): Promise<
  ApiResponse<WritingTaskStats>
> {
  try {
    const { data } = await apiWithAuth.get<WritingTaskStats>(
      "/writing-tasks/stats/summary"
    );

    return {
      data,
      success: true,
      error: null,
    };
  } catch (err: any) {
    return {
      data: null,
      success: false,
      error:
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch task statistics",
    };
  }
}
