import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { User, createUser, deleteUser, getUsers, updateUser } from "../Api/Api";
import { UsersTable, UsersTableWithData } from "./UsersTable";

// Mocked Api calls module to prevent changes to production
jest.mock("../Api/Api", () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}));

describe("UsersTable and UsersTableWithData", () => {
  let mockUsers: User[];

  beforeEach(() => {
    // Initialize mockUsers before each test
    mockUsers = [
      { id: "1", name: "Alex Jimenez", email: "alex.jimenez@domain.com" },
    ];

    // Cast the mocked getUsers function to the mocked function type
    type MockedGetUsers = jest.MockedFunction<typeof getUsers>;

    const mockedGetUsers = getUsers as MockedGetUsers;
    mockedGetUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  it("fetches and displays users", async () => {
    // Render the UsersTable component
    render(<UsersTable />);

    // Wait for the users to be fetched and displayed
    await waitFor(() => {
      // Confirm that each user's name and email are displayed
      mockUsers.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
      });
    });
  });

  it('adds a user when "Create User" button is clicked', async () => {
    type MockedCreateUser = jest.MockedFunction<typeof createUser>;
    const mockedCreateUser = createUser as MockedCreateUser;

    /**
     * Mock function to simulate refreshing user data.
     * It uses a call count to determine the state of the data returned.
     */
    let callCount = 0;

    const mockOnRefresh = jest.fn(async (): Promise<User[]> => {
      callCount++;
      if (callCount === 0) {
        // On the first call, return the initial mockUsers
        return mockUsers;
      } else if (callCount >= 1) {
        // On the second call, add a new user and return the updated mockUsers
        mockUsers = [
          ...mockUsers,
          { id: "2", name: "Marty McFly", email: "marty.mcfly@example.com" },
        ];
      }
      return mockUsers;
    });

    // Render the UsersTableWithData component
    const { rerender } = render(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Find the IconButton with the test id "create-user-button"
    const createUserButton = await screen.findByTestId("create-user-button");

    // Simulate clicking the "Create User" button
    fireEvent.click(createUserButton);

    // Wait for the dialog to open and confirm if the dialog is present in the document
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Simulate typing a name into the name input field
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Marty McFly" } });

    // Simulate typing an email into the email input field
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;
    fireEvent.change(emailInput, {
      target: { value: "marty.mcfly@example.com" },
    });

    // Find the "Create" confirmation button and click it
    const createButton = screen.getByRole("button", { name: /create/i });
    await act(async () => {
      fireEvent.click(createButton);
    });

    // Wait for the user to be added and confirm that the mockedCreateUser and mockOnRefresh function was called
    await waitFor(() => {
      expect(mockedCreateUser).toHaveBeenCalled();
      expect(mockOnRefresh).toHaveBeenCalled();
    });

    // Rerender the component with the updated mockUsers
    rerender(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Confirm that the new user is displayed in the table
    expect(screen.getByText(/Marty McFly/i)).toBeInTheDocument();
    expect(screen.getByText(/marty.mcfly@example.com/i)).toBeInTheDocument();
  });

  it('updates a user when "Update User" button is clicked', async () => {
    type MockedUpdateUser = jest.MockedFunction<typeof updateUser>;
    const mockedUpdateUser = updateUser as MockedUpdateUser;

    /**
     * Mock function to simulate refreshing user data.
     * It uses a call count to determine the state of the data returned.
     */
    let callCount = 0;

    const mockOnRefresh = jest.fn(async (): Promise<User[]> => {
      callCount++;
      if (callCount === 0) {
        // On the first call, return the initial mockUsers
        return mockUsers;
      } else if (callCount >= 1) {
        // On the second call, update user and return the updated mockUsers
        mockUsers = [
          { id: "1", name: "Alex McFly", email: "alex.mcfly@domain.com" },
        ];
      }
      return mockUsers;
    });

    // Render the UsersTableWithData component
    const { rerender } = render(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Find the IconButton with the test id "update-user-button"
    const updateUserButton = await screen.findByTestId("update-user-button");

    // Simulate clicking the "Update User" button
    fireEvent.click(updateUserButton);

    // Wait for the edit form to open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Simulate updating the name into the name input field
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Alex McFly" } });

    // Simulate updating the email into the email input field
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;
    fireEvent.change(emailInput, {
      target: { value: "alex.mcfly@domain.com" },
    });

    // Find the "Save" confirmation button and click it
    const saveButton = screen.getByRole("button", { name: /update/i });
    await act(async () => {
      fireEvent.click(saveButton);
    });

    // Wait for the user to be updated and confirm that the mockedUpdateUser and mockOnRefresh function was called
    await waitFor(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockOnRefresh).toHaveBeenCalled();
    });

    // Rerender the component with the updated mockUsers
    rerender(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Confirm that the updated user's new name and email is displayed in the table
    expect(screen.getByText(/Alex McFly/i)).toBeInTheDocument();
    expect(screen.getByText(/alex.mcfly@domain.com/i)).toBeInTheDocument();
  });

  it('deletes a user when "Delete User" button is clicked', async () => {
    type MockedDeleteUser = jest.MockedFunction<typeof deleteUser>;
    const mockedDeleteUser = deleteUser as MockedDeleteUser;

    /**
     * Mock function to simulate refreshing user data.
     * It uses a call count to determine the state of the data returned.
     */
    let callCount = 0;

    const mockOnRefresh = jest.fn(async (): Promise<User[]> => {
      callCount++;
      if (callCount === 0) {
        // On the first call, return the initial mockUsers
        return mockUsers;
      } else if (callCount >= 1) {
        // On the second call, remove user and return the updated mockUsers
        mockUsers = [];
      }
      return mockUsers;
    });

    // Render the UsersTableWithData component
    const { rerender } = render(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Find the IconButton with the test id "delete-user-button"
    const deleteUserButton = await screen.findByTestId("delete-user-button");

    // Simulate clicking the "Delete User" button
    fireEvent.click(deleteUserButton);

    // Wait for the confirmation dialog to open
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Find the "Delete" confirmation button and click it
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Wait for the user to be deleted and confirm that the mockedDeleteUser and mockOnRefresh function was called
    await waitFor(() => {
      expect(mockedDeleteUser).toHaveBeenCalled();
      expect(mockOnRefresh).toHaveBeenCalled();
    });

    // Rerender the component with the updated mockUsers
    rerender(
      <UsersTableWithData userData={mockUsers} onRefresh={mockOnRefresh} />
    );

    // Confirm that the deleted user is no longer displayed in the table
    expect(screen.queryByText(/Alex Jimenez/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/alex.jimenez@domain.com/i)
    ).not.toBeInTheDocument();
  });
});
