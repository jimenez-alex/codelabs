import React from 'react';

import { Snackbar } from '@mui/material';

interface StatusUpdateContextValue {
  addStatusUpdate: (message: string) => void;
}

const StatusUpdateContext = React.createContext<StatusUpdateContextValue | undefined>(undefined);

interface StatusUpdateProviderProps {
  children: React.ReactNode;
}

export const StatusUpdateProvider: React.FC<StatusUpdateProviderProps> = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState<Array<{ message: string; key: number }>>([]);

  const addStatusUpdate = (message: string) => {
    setSnackPack((prev) => [...prev, { message, key: Date.now() }]);
  };

  const handleStatusUpdateClose = (key: number) => {
    setSnackPack((prev) => prev.filter((snack) => snack.key !== key));
  };

  return (
    <StatusUpdateContext.Provider value={{ addStatusUpdate }}>
      {children}
      {snackPack.map(({ message, key }) => (
        <Snackbar
          key={key}
          open
          message={message}
          autoHideDuration={6000}
          onClose={() => handleStatusUpdateClose(key)}
        />
      ))}
    </StatusUpdateContext.Provider>
  );
};

export const useStatusUpdate = () => {
  const context = React.useContext(StatusUpdateContext);
  if (!context) {
    throw new Error('useStatusUpdate must be used within a StatusUpdateProvider');
  }
  return context;
};
