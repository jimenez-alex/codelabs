import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { StatusUpdateProvider } from "../../../../shared/layout/statusupdate/StatusUpdateContext";
import { UserActions } from "../userapi/UserActionsEnums";
import * as UsersContext from "../userapi/UsersContext";
import { UserActionButton, UserActionButtons } from "./UserActionButton";

describe("UserActionButton", () => {
  Object.values(UserActions).forEach((action) => {
    it(`renders the ${action} button and opens the dialog on click`, () => {
      render(
        <StatusUpdateProvider>
          <UsersContext.UserProvider>
            <UserActionButton userAction={action} />
          </UsersContext.UserProvider>
        </StatusUpdateProvider>
      );
      const button = screen.getByTestId(`${action}-user-button`);
      expect(button).toHaveTextContent(action);
      fireEvent.click(button);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});

describe("UserActionButtons", () => {
  it("renders the correct buttons based on no selected user", async () => {
    jest.spyOn(UsersContext, "useUsers").mockImplementation(() => ({
      users: [
        { id: "123", name: "Alex Jimenez", email: "alex.jimenez@domain.com" },
      ],
      fetchUsers: () => {},
      setSelectedUser: () => {},
      selectedUser: null,
    }));

    render(
      <StatusUpdateProvider>
        <UsersContext.UserProvider>
          <UserActionButtons />
        </UsersContext.UserProvider>
      </StatusUpdateProvider>
    );

    expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
    expect(screen.queryByTestId("update-user-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-user-button")).not.toBeInTheDocument();
  });

  it("renders the correct buttons based on the selected user", async () => {
    jest.spyOn(UsersContext, "useUsers").mockImplementation(() => ({
      users: [
        { id: "123", name: "Alex Jimenez", email: "alex.jimenez@domain.com" },
      ],
      fetchUsers: () => {},
      setSelectedUser: () => {},
      selectedUser: {
        id: "456",
        name: "Marty McFly",
        email: "marty.mcfly@example.com",
      },
    }));

    render(
      <StatusUpdateProvider>
        <UsersContext.UserProvider>
          <UserActionButtons />
        </UsersContext.UserProvider>
      </StatusUpdateProvider>
    );

    expect(screen.getByTestId("create-user-button")).toBeInTheDocument();
    expect(screen.getByTestId("update-user-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-user-button")).toBeInTheDocument();
  });
});
