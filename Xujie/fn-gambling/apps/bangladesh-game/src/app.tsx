import { Provider } from 'react-redux';
import router from '@/router';
import { RouterProvider } from 'react-router-dom';
import { DeviceWrapper } from './templates/DeviceWrapper';
import { store } from '@/redux/store';
import * as Sentry from '@mode2/components/Sentry';
import { ToastContain } from '@libs/mode2/components/Toast';
import { DynamicTheme } from '@/components/DynamicTheme';

export function App() {
  return (
    <Sentry.ErrorBoundary showDialog={import.meta.env.DEV}>
      <DynamicTheme />
      <ToastContain />
      <Provider store={store}>
        <DeviceWrapper>
          <RouterProvider router={router} />
        </DeviceWrapper>
      </Provider>
    </Sentry.ErrorBoundary>
  );
}

export default App;
