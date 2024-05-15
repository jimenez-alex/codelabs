import { API_BASE_URL, User, headers, isEmail } from "./UserApiCommon";

/**
 * Handles the HTTP response by checking for errors and returning the JSON data.
 * @template T - The expected type of the response data.
 * @param {Response} response - The response object to handle.
 * @returns {Promise<T>} - A promise that resolves to the response data.
 * @throws {Error} - Throws an error if the response is not OK or if data parsing fails.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: { error?: string } = await response.json();
    throw new Error(
      errorData.error || "An error occurred while fetching data."
    );
  }
  return response.json();
}

/**
 * Retrieves all users from the API.
 * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
 */
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`, { headers });
  const data: { users: User[] } = await handleResponse(response);
  return data.users;
}

/**
 * Retrieves a single user by ID from the API.
 * @param {User['id']} id - The unique identifier of the user.
 * @returns {Promise<User>} - A promise that resolves to a User object.
 */
export async function getUser(id: User["id"]): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, { headers });
  return handleResponse(response);
}

/**
 * Creates a new user with the provided details.
 * @param {User} user - The user details to create.
 * @returns {Promise<User>} - A promise that resolves to the newly created User object.
 * @throws {Error} - Throws an error if the email format is invalid.
 */
export async function createUser(user: User): Promise<User> {
  if (!isEmail(user.email)) {
    throw new Error("Invalid email format.");
  }
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: user.name, email: user.email }),
  });
  return handleResponse(response);
}

/**
 * Deletes a user by their ID.
 * @param {User} user - The user to delete.
 * @returns {Promise<{ success: boolean }>} - A promise that resolves to an object indicating the success of the operation.
 */
export async function deleteUser(user: User): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
    method: "DELETE",
    headers,
  });
  return handleResponse(response);
}

/**
 * Updates a user's details by their ID.
 * @param {User} user - The user details to update.
 * @returns {Promise<User>} - A promise that resolves to the updated User object.
 * @throws {Error} - Throws an error if the email format is invalid.
 */
export async function updateUser(user: User): Promise<User> {
  if (user.email && !isEmail(user.email)) {
    throw new Error("Invalid email format.");
  }
  const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name: user.name, email: user.email }),
  });
  return handleResponse(response);
}
