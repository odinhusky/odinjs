import * as ReactDOM from 'react-dom/client';
import App from './app';
import '@plugins/i18next/i18next';
import sdkUtils from '@mode2/utils/sdk';
import { adaptHtmlFontSize, replaceHtmlProductInformation } from '@mode2/utils';
import 'animate.css';
import { useAppStore } from '@mode2/zustand/appStore';
import { useImageCache } from '@mode2/usecase/useImageCache';

adaptHtmlFontSize();
replaceHtmlProductInformation();

sdkUtils.init();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

useAppStore.getState().clear();
useImageCache.syncAllImageCacheStore();
root.render(<App />);
