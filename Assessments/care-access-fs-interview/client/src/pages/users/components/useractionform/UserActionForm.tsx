import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
} from "@mui/material";

import { useStatusUpdate } from "../../../../shared/layout/statusupdate/StatusUpdateContext";
import { UserActions, actionMapping } from "../userapi/UserActionsEnums";
import { User, emailRegex } from "../userapi/UserApiCommon";
import { useUsers } from "../userapi/UsersContext";

interface UserActionFormDialogProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  userAction: UserActions;
}

export const UserActionFormDialog: React.FC<UserActionFormDialogProps> = ({
  openDialog,
  setOpenDialog,
  userAction,
}) => {
  const { selectedUser: user, setSelectedUser, fetchUsers } = useUsers();
  const { addStatusUpdate } = useStatusUpdate();

  const [name, setName] = useState(
    userAction === "create" ? "" : user?.name || ""
  );
  const [email, setEmail] = useState(
    userAction === "create" ? "" : user?.email || ""
  );
  const [emailError, setEmailError] = useState(false);

  const actionText = userAction
    ? userAction.charAt(0).toUpperCase() + userAction.slice(1)
    : "";

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setEmailError(!emailRegex.test(emailValue));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newUser: User = await actionMapping[userAction]({
        ...user,
        name,
        email,
      });
      addStatusUpdate(`User ${userAction}d successfully`);
      fetchUsers();
      setSelectedUser(newUser);
      setOpenDialog(false);
    } catch (error) {
      addStatusUpdate("An unknown error occurred");
    }
  };

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>{`${actionText} User`}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <React.Fragment>
            <FormControl fullWidth margin="normal" required>
              <TextField
                id="name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                InputProps={{
                  readOnly: userAction === "delete",
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal" required error={emailError}>
              <TextField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                helperText={emailError ? "Invalid email format" : " "}
                InputProps={{
                  readOnly: userAction === "delete",
                }}
              />
            </FormControl>
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="secondary"
            disabled={emailError || !name}
          >{`${actionText}`}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
