import { createUser, deleteUser, updateUser } from "./UserApi";

/**
 * Enum for user-related operations
 */
export enum UserActions {
  Create = "create",
  Update = "update",
  Delete = "delete",
}

/**
 * Action mapping
 */
export const actionMapping: Record<UserActions, Function> = {
  [UserActions.Create]: createUser,
  [UserActions.Update]: updateUser,
  [UserActions.Delete]: deleteUser,
};
