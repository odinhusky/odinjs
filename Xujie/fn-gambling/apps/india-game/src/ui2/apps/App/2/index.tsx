import * as Sentry from '@mode2/components/Sentry';
import { DynamicTheme } from '@/components/DynamicTheme';
import { ToastContain } from '@components/ToastContain';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import { ConfigProvider } from 'antd';
import { customAntdTheme } from './customAntdtheme';
import MessageContain from '@components/MessageContain';

export const App = () => {
  return (
    <Sentry.ErrorBoundary showDialog={import.meta.env.DEV}>
      <DynamicTheme />
      <ToastContain />
      <MessageContain />
      <Provider store={store}>
        <ConfigProvider theme={customAntdTheme}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

export default App;
