import * as ReactDOM from 'react-dom/client';
import '@/setting/dev/v1/theme.css'; // TODO yaleen 后续更换为DynamicTheme
import App from './app';
import '../plugins/i18next/i18next';
import { adaptHtmlFontSize, replaceHtmlProductInformation } from '@mode2/utils';
import 'animate.css';
import VConsole from 'vconsole';

adaptHtmlFontSize();
replaceHtmlProductInformation();
import.meta.env.VITE_MODE !== 'prod' && new VConsole();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);
