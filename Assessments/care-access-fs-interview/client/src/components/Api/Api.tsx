import axios from 'axios';
import {AxiosError} from 'axios';

// Define the base URL for your API
export const API_BASE_URL = 'http://localhost:4000';

// Set up the headers, typically including the Content-Type
const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': 'Bearer your-auth-token',
};

// Define a type for the expected error response structure
interface ErrorResponse {
  error: string;
}

// Email interface with a type guard for email format validation
interface Email {
  value: string;
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmail(email: any): email is Email {
  return typeof email === 'string' && emailRegex.test(email);
}

// User interface to include the Email interface
export interface User {
  id: string;
  name: string;
  email: Email['value'];
}

/**
 * GET request function to retrieve all users.
 * @returns Promise<User[]> - A promise that resolves to an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ users: User[] }>(`${API_BASE_URL}/api/users`, { headers });
    return response.data.users;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'An error occurred while fetching users.');
  }
};

/**
 * GET request function to retrieve a single user by ID.
 * @param id - The unique identifier of the user.
 * @returns Promise<User> - A promise that resolves to the user object.
 */
export const getUser = async (id: User['id']): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/api/users/${id}`, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || `An error occurred while fetching user with ID: ${id}.`);
  }
};

/**
 * POST request function to create a new user.
 * @param name - The name of the user to create.
 * @param email - The email string of the user to create.
 * @returns Promise<User> - A promise that resolves to the newly created user object.
 */
export const createUser = async (name: User['name'], email: Email['value']): Promise<User> => {
  if (!isEmail(email)) {
    throw new Error('Invalid email format.');
  }
  
  const validEmail: Email = { value: email };

  try {
    const response = await axios.post<User>(`${API_BASE_URL}/api/users`, { name, email: validEmail.value }, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || 'An error occurred while creating a new user.');
  }
};

/**
 * DELETE request function to delete a user by ID.
 * @param id - The unique identifier of the user to delete.
 * @returns Promise<{ success: boolean }> - A promise that resolves to an object indicating the success of the operation.
 */
export const deleteUser = async (id: User['id']): Promise<{ success: boolean }> => {
  try {
    const response = await axios.delete<{ success: boolean }>(`${API_BASE_URL}/api/users/${id}`, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || `An error occurred while deleting user with ID: ${id}.`);
  }
};

/**
 * PATCH request function to update a user's details by ID.
 * @param id - The unique identifier of the user to update.
 * @param name - The new name of the user.
 * @param email - The new email string of the user.
 * @returns Promise<User> - A promise that resolves to the updated user object.
 */
export const updateUser = async (id: User['id'], name: User['name'], email: Email['value']): Promise<User> => {
  if (email && !isEmail(email)) {
    throw new Error('Invalid email format.');
  }

  const validEmail: Email = { value: email };

  try {
    const response = await axios.patch<User>(`${API_BASE_URL}/api/users/${id}`, { name, email: validEmail?.value }, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(axiosError.response?.data.error || `An error occurred while updating user with ID: ${id}.`);
  }
};