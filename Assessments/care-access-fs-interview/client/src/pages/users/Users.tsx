import React from "react";

import { UserProvider } from "./components/userapi/UsersContext";
import { UsersTable } from "./components/userstable/UsersTable";
import { UserActionButtons } from "./components/useractionbutton/UserActionButton";

export const Users: React.FC = () => {
  return (
    <UserProvider>
      <UserActionButtons />
      <UsersTable />
    </UserProvider>
  );
};
