import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import {
  User,
  createUser,
  deleteUser,
  emailRegex,
  updateUser,
} from "../Api/Api";

type ActionType = "create" | "update" | "delete";

interface UserActionButtonProps {
  actionType: ActionType;
  onRefresh: () => void;
  user?: User;
  setSnackbarOpen: (open: boolean) => void;
  setSnackbarMessage: (message: string) => void;
}

export const UserActionButton: React.FC<UserActionButtonProps> = ({
  actionType,
  onRefresh,
  user,
  setSnackbarOpen,
  setSnackbarMessage,
}) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    handleClose();
    onRefresh();
  };

  const handleError = (error: Error) => {
    console.error("Error performing action:", error);
    setSnackbarMessage(error.message);
    setSnackbarOpen(true);
  };

  const renderIcon = () => {
    switch (actionType) {
      case "create":
        return <AddIcon />;
      case "update":
        return <EditIcon />;
      case "delete":
        return <DeleteIcon />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <Tooltip title={`${actionType} user`}>
        <IconButton
          onClick={handleClickOpen}
          data-testid={`${actionType}-user-button`}
        >
          {renderIcon()}
        </IconButton>
      </Tooltip>
      <UserActionForm
        actionType={actionType}
        open={open}
        onClose={handleClose}
        onRefresh={onRefresh}
        user={user}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </React.Fragment>
  );
};

interface UserActionFormProps {
  actionType: ActionType;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  user?: User;
  onSuccess: (message: string) => void;
  onError: (error: Error) => void;
}

export const UserActionForm: React.FC<UserActionFormProps> = ({
  actionType,
  open,
  onClose,
  onRefresh,
  user,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emailError, setEmailError] = useState(false);

  const actionText = actionType.charAt(0).toUpperCase() + actionType.slice(1);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setEmailError(!emailRegex.test(emailValue));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError) {
      onError(new Error("Please enter a valid email address."));
      return;
    }

    try {
      switch (actionType) {
        case "create":
          await createUser(name, email);
          onSuccess("User created successfully");
          break;
        case "update":
          if (user) {
            await updateUser(user.id, name, email);
            onSuccess("User updated successfully");
          }
          break;
        case "delete":
          if (user) {
            const confirmation = await deleteUser(user.id);
            onSuccess("User deleted successfully");
          }
          break;
        default:
          throw new Error("Invalid action type");
      }
    } catch (error) {
      onError(new Error("An unknown error occurred"));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
                  readOnly: actionType === "delete",
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
                  readOnly: actionType === "delete",
                }}
              />
            </FormControl>
          </React.Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
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
