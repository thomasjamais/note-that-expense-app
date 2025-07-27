import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

type SnackbarType = 'info' | 'success' | 'error';

interface SnackbarContextProps {
  showMessage: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextProps>({
  showMessage: () => {},
});

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState<SnackbarType>('info');

  const showMessage = (message: string, type: SnackbarType = 'info') => {
    setMsg(message);
    setSeverity(type);
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={[
          { margin: 16, borderRadius: 4 },
          severity === 'error' && { backgroundColor: '#D32F2F' },
          severity === 'success' && { backgroundColor: '#388E3C' },
        ]}
      >
        <Text>{msg}</Text>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
