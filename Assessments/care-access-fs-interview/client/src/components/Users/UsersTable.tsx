import { Box, Snackbar } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { User, getUsers } from "../Api/Api";
import { UserActionButton } from "./UserActions";

export const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return <UsersTableWithData userData={users} onRefresh={fetchUsers} />;
};

interface UsersTableProps {
  userData: User[];
  onRefresh: () => void;
}

export const UsersTableWithData: React.FC<UsersTableProps> = ({
  userData,
  onRefresh,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = (
    event: React.SyntheticEvent<any, Event> | Event,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const columns: GridColDef<User>[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "",
      width: 120,
      renderCell: (params) => (
        <React.Fragment>
          <UserActionButton
            actionType="create"
            onRefresh={onRefresh}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
          />
          <UserActionButton
            actionType="update"
            onRefresh={onRefresh}
            user={params.row}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
          />
          <UserActionButton
            actionType="delete"
            onRefresh={onRefresh}
            user={params.row}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
          />
        </React.Fragment>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 400,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 400,
      flex: 1,
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={userData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UsersTable;
