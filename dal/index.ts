/**
 * Data Access Layer (DAL) - Main Barrel Export
 *
 * Centralized export for all DAL modules
 * All functions return: { data: T | null, success: boolean, error: string | null }
 */

// Authentication
export * from "./auth";

// Users
export * from "./users";

// Admin
export * from "./admin";

// Writing Tasks
export * from "./writing-tasks";

// Media
export * from "./media";
