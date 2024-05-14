import React from "react";

import { AppFrame } from "../../shared/layout/appframe/AppFrame";
import { Users } from "../users/Users";

export const App: React.FC = () => {
  return (
    <AppFrame title="Welcome to Kyruus">
      <Users />
    </AppFrame>
  );
};
