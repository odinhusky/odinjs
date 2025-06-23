import { DynamicTheme } from '@/components/DynamicTheme';
import { ToastContain } from '@components/ToastContain';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import { ConfigProvider } from 'antd';
import { customAntdTheme } from './customAntdtheme';
import MessageContain from '@components/MessageContain';
import PostHogAnalyticsWrapper from '@libs/components/PostHogAnalyticsWrapper';
import SentryAnalyticsWrapper from '@libs/components/SentryAnalyticsWrapper';

export const App = () => {
  return (
    <PostHogAnalyticsWrapper>
      <SentryAnalyticsWrapper>
        <DynamicTheme />
        <ToastContain />
        <MessageContain />
        <Provider store={store}>
          <ConfigProvider theme={customAntdTheme}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </Provider>
      </SentryAnalyticsWrapper>
    </PostHogAnalyticsWrapper>
  );
};

export default App;
