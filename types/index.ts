/**
 * Core Type Definitions for IELTS Karo Application
 * Generated from OpenAPI Specification v1.0.0
 */

// ============================================
// Common Response Types
// ============================================

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error: string | null;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

/**
 * MongoDB ObjectId type
 */
export type ObjectId = string;

// ============================================
// User Types
// ============================================

/**
 * User role enumeration
 */
export type UserRole = "student" | "admin" | "instructor" | "super_admin";

/**
 * User base interface
 */
export interface User {
  id: ObjectId;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: UserRole;
}

/**
 * User creation request
 */
export interface UserCreate {
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role?: UserRole;
}

/**
 * User update request (all fields optional)
 */
export interface UserUpdate {
  email?: string;
  password?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
}

/**
 * Update user role request
 */
export interface UpdateRoleRequest {
  role: UserRole;
}

// ============================================
// Authentication Types
// ============================================

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string; // email
  password: string;
}

/**
 * Bearer token response
 */
export interface BearerResponse {
  access_token: string;
  token_type: string;
}

/**
 * Email verification/reset request
 */
export interface EmailRequest {
  email: string;
}

/**
 * Token verification request
 */
export interface TokenRequest {
  token: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  token: string;
  password: string;
}

/**
 * OAuth2 authorization response
 */
export interface OAuth2AuthorizeResponse {
  authorization_url: string;
}

// ============================================
// Writing Task Types
// ============================================

/**
 * IELTS type enumeration
 */
export type IELTSType = "academic" | "general_training";

/**
 * Writing task part enumeration
 */
export type WritingTaskPart = "part_1" | "part_2";

/**
 * IELTS test book reference
 */
export interface IELTSTestBook {
  book_name?: string;
  book_number?: number;
  test_number?: number;
}

/**
 * Writing task base data
 */
export interface WritingTaskBase {
  ielts_type: IELTSType;
  writing_task: WritingTaskPart;
  ielts_test_book?: IELTSTestBook;
  question: string;
  question_image_id?: ObjectId;
  question_image_url?: string;
  model_answer?: string;
}

/**
 * Writing task creation request
 */
export interface WritingTaskCreate extends WritingTaskBase {}

/**
 * Writing task update request (all fields optional)
 */
export interface WritingTaskUpdate {
  ielts_type?: IELTSType;
  writing_task?: WritingTaskPart;
  ielts_test_book?: IELTSTestBook;
  question?: string;
  question_image_id?: ObjectId;
  question_image_url?: string;
  model_answer?: string;
}

/**
 * Writing task response
 */
export interface WritingTask extends WritingTaskBase {
  id: ObjectId;
}

/**
 * Writing task list filters
 */
export interface WritingTaskFilters extends PaginationParams {
  ielts_type?: IELTSType;
  writing_task?: WritingTaskPart;
  book_number?: number;
  is_active?: boolean;
}

/**
 * Writing task statistics
 */
export interface WritingTaskStats {
  total_tasks?: number;
  tasks_by_type?: Record<string, number>;
  tasks_by_part?: Record<string, number>;
  tasks_by_book?: Record<string, number>;
  active_tasks: number;
}

// ============================================
// Media Types
// ============================================

/**
 * Media file status
 */
export type MediaStatus = "pending" | "uploaded" | "failed";

/**
 * Media file metadata
 */
export interface Media {
  id: ObjectId;
  owner_id: ObjectId;
  key: string;
  filename: string;
  mime_type: string;
  size_mb: number;
  status: MediaStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Media upload response
 */
export interface MediaUploadResponse {
  media: Media;
  url: string;
}

/**
 * Media URL response
 */
export interface MediaUrlResponse {
  url: string;
}

/**
 * Media statistics
 */
export interface MediaStats {
  total_files: number;
  total_size_mb: number;
  total_size_gb: number;
  files_by_status: Record<string, number>;
  files_by_mime_type: Record<string, number>;
  average_file_size_mb: number;
  largest_file_mb: number;
  smallest_file_mb: number;
}

// ============================================
// Error Types
// ============================================

/**
 * Validation error detail
 */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/**
 * HTTP validation error response
 */
export interface HTTPValidationError {
  detail: ValidationError[];
}

/**
 * Generic error model
 */
export interface ErrorModel {
  detail: string | ValidationError[] | Record<string, any>;
}
