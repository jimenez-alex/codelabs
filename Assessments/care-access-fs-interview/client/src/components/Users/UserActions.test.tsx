import { fireEvent, render, screen } from "@testing-library/react";
import { UserActionButton, UserActionForm } from "./UserActions";

jest.mock("../Api/Api", () => ({
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

describe("UserActionButton", () => {
  it("renders an IconButton and opens a dialog on click", () => {
    render(
      <UserActionButton
        actionType="create"
        onRefresh={() => {}}
        setSnackbarOpen={() => {}}
        setSnackbarMessage={() => {}}
      />
    );

    // Check if the IconButton is rendered
    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();

    // Initially, the dialog should not be in the document
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Fire a click event on the iconButton
    fireEvent.click(iconButton);

    // After the click, check that the dialog should be present
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });
});

const mockUser = {
  id: "1",
  name: "Alex Jimenez",
  email: "Alex Jimenez@domain.com",
};

describe("UserActionForm", () => {
  it("renders the name and email correctly on the dialog when using the update action type", () => {
    render(
      <UserActionForm
        actionType="update"
        open={true}
        onClose={() => {}}
        onRefresh={() => {}}
        user={mockUser}
        onSuccess={() => {}}
        onError={() => {}}
      />
    );

    // Check if the dialog is open
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Check if the name input has the correct value
    const nameInput = screen.getByRole("textbox", {
      name: /name/i,
    }) as HTMLInputElement;
    expect(nameInput.value).toBe(mockUser.name);

    // Check if the email input has the correct value
    const emailInput = screen.getByRole("textbox", {
      name: /email/i,
    }) as HTMLInputElement;
    expect(emailInput.value).toBe(mockUser.email);
  });
});
