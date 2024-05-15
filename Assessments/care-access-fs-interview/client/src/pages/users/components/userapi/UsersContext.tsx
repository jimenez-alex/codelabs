import React from "react";

import { useStatusUpdate } from "../../../../shared/layout/statusupdate/StatusUpdateContext";
import { getUsers } from "./UserApi";
import { User } from "./UserApiCommon";

interface UserContextValue {
  users: User[];
  fetchUsers: () => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const UserContext = React.createContext<UserContextValue | undefined>(
  undefined
);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { addStatusUpdate } = useStatusUpdate();

  const fetchUsers = React.useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      addStatusUpdate(`Error fetching users: ${error}`);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{ users, fetchUsers, selectedUser, setSelectedUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = (): UserContextValue => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
