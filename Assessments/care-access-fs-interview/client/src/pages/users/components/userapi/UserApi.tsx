import React from "react";

import axios, { AxiosError } from "axios";
import {
  API_BASE_URL,
  Email,
  ErrorResponse,
  User,
  headers,
  isEmail,
} from "./UserApiCommon";
import { UserActions } from "./UserActionsEnums";

/**
 * GET request function to retrieve all users.
 * @returns Promise<User[]> - A promise that resolves to an array of users.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<{ users: User[] }>(
      `${API_BASE_URL}/api/users`,
      { headers }
    );
    return response.data.users;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.error ||
        "An error occurred while fetching users."
    );
  }
};

/**
 * GET request function to retrieve a single user by ID.
 * @param id - The unique identifier of the user.
 * @returns Promise<User> - A promise that resolves to the user object.
 */
export const getUser = async (id: User["id"]): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/api/users/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.error ||
        `An error occurred while fetching user with ID: ${id}.`
    );
  }
};

/**
 * POST request function to create a new user.
 * @param name - The name of the user to create.
 * @param email - The email string of the user to create.
 * @returns Promise<User> - A promise that resolves to the newly created user object.
 */
export const createUser = async (
  user: User
): Promise<User> => {
  if (!isEmail(user.email)) {
    throw new Error("Invalid email format.");
  }

  const validEmail: Email = { value: user.email };

  try {
    const response = await axios.post<User>(
      `${API_BASE_URL}/api/users`,
      { name: user.name, email: validEmail.value },
      { headers }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.error ||
        "An error occurred while creating a new user."
    );
  }
};

/**
 * DELETE request function to delete a user by ID.
 * @param id - The unique identifier of the user to delete.
 * @returns Promise<{ success: boolean }> - A promise that resolves to an object indicating the success of the operation.
 */
export const deleteUser = async (
  user: User
): Promise<{ success: boolean }> => {
  try {
    const response = await axios.delete<{ success: boolean }>(
      `${API_BASE_URL}/api/users/${user.id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.error ||
        `An error occurred while deleting user with ID: ${user.id}.`
    );
  }
};

/**
 * PATCH request function to update a user's details by ID.
 * @param id - The unique identifier of the user to update.
 * @param name - The new name of the user.
 * @param email - The new email string of the user.
 * @returns Promise<User> - A promise that resolves to the updated user object.
 */
export const updateUser = async (
  // id: User["id"],
  // name: User["name"],
  // email: Email["value"]
  user: User
): Promise<User> => {
  if (user.email && !isEmail(user.email)) {
    throw new Error("Invalid email format.");
  }

  const validEmail: Email = { value: user.email };

  try {
    const response = await axios.patch<User>(
      `${API_BASE_URL}/api/users/${user.id}`,
      { name: user.name, email: validEmail?.value },
      { headers }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data.error ||
        `An error occurred while updating user with ID: ${user.id}.`
    );
  }
};

/**
 * Custom hook for fetching all users from the server.
 *
 * @returns {object} An object containing:
 * - `users`: An array of `User` objects representing the users.
 * - `error`: A string describing the error if one occurred during the fetch.
 * - `isLoading`: A boolean indicating whether the request is in progress.
 * - `getUsers`: A function that initiates the fetch operation.
 */
export const useActionUser = (actionType: UserActions) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const getUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ users: User[] }>(
        `${API_BASE_URL}/api/users`,
        { headers }
      );
      setUsers(response.data.users);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(
        axiosError.response?.data.error ||
          "An error occurred while fetching users."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { users, error, isLoading, getUsers };
};
