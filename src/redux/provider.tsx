import { Provider } from 'react-redux';
import { FC, ReactNode } from 'react';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

interface providerProps {
  children: ReactNode;
}

const ReduxProvider: FC<providerProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
