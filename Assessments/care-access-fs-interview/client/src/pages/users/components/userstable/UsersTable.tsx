import React from "react";

import { Box } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { User } from "../userapi/UserApiCommon";
import { useUsers } from "../userapi/UsersContext";

export const UsersTable: React.FC = () => {
  const { users, setSelectedUser } = useUsers();
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);

  React.useEffect(() => {
    const resetSelectedUser = () => {
      setSelectedUser(null);
      setRowSelectionModel([]);
    };

    resetSelectedUser();
  }, [users]);

  const handleRowSelectionModelChange: DataGridProps["onRowSelectionModelChange"] =
    (newRowSelectionModel) => {
      setRowSelectionModel(newRowSelectionModel);
      const selectedID = newRowSelectionModel[0];
      const selectedRow = users.find((row) => row.id === selectedID) || null;
      setSelectedUser(selectedRow);
    };

  const columns: GridColDef<User>[] = [
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
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        onRowSelectionModelChange={handleRowSelectionModelChange}
        rowSelectionModel={rowSelectionModel}
      />
    </Box>
  );
};
