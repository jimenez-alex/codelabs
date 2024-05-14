/**
 * Defines the base URL for the User API
 */
export const API_BASE_URL = "http://localhost:4000";

/**
 * Headers used for User Api calls
 */
export const headers = {
  "Content-Type": "application/json",
  // 'Authorization': 'Bearer your-auth-token',
};

/**
 * Regular expression for email validation
 * Matches a basic email pattern with local part, @ symbol, and domain part
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Type guard for email format validation
 * @param email - The email address to validate
 * @returns boolean - Returns true if the input is a string that matches the email pattern
 */
export function isEmail(email: string | unknown): email is Email {
  return typeof email === "string" && emailRegex.test(email);
}

/**
 * Email interface
 */
export interface Email {
  value: string;
}

/**
 * User interface to include the Email interface
 */
export interface User {
  readonly id: string;
  name: string;
  email: Email["value"];
}

/**
 * Defines a type for the expected error response structure
 */
export interface ErrorResponse {
  readonly error: string;
}
