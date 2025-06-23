import * as Sentry from '@mode2/components/Sentry';
import { DynamicTheme } from '@/components/DynamicTheme';
import { ToastContain } from '@components/ToastContain';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import MessageContain from '@components/MessageContain';

export const App = () => {
  console.log('@@@===> App mode 0');
  return (
    <Sentry.ErrorBoundary showDialog={import.meta.env.DEV}>
      <DynamicTheme />
      <ToastContain />
      <MessageContain />
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

export default App;
