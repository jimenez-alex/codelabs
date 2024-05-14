import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { UserActionFormDialog } from "../useractionform/UserActionForm";
import { UserActions } from "../userapi/UserActionsEnums";
import { useUsers } from "../userapi/UsersContext";

const iconMapping: Record<UserActions, React.ReactNode> = {
  create: <AddIcon />,
  update: <EditIcon />,
  delete: <DeleteIcon />,
};

export interface UserActionButtonProps {
  userAction: UserActions;
}

export const UserActionButton: React.FC<UserActionButtonProps> = ({
  userAction,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <React.Fragment>
      <Tooltip title={`${userAction} user`}>
        <Button
          aria-label={`${userAction}-user-button`}
          data-testid={`${userAction}-user-button`}
          onClick={() => setOpenDialog(true)}
          startIcon={iconMapping[userAction]}
        >
          {userAction}
        </Button>
      </Tooltip>
      <UserActionFormDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        userAction={userAction}
      />
    </React.Fragment>
  );
};

export interface UserActionButtonsProps {}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({}) => {
  const { selectedUser } = useUsers();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      {Object.values(UserActions).map((userAction) => {
        if (userAction == "create" || selectedUser)
          return <UserActionButton key={userAction} userAction={userAction} />;
      })}
    </Box>
  );
};
