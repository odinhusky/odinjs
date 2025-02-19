import { theme } from 'antd';

const { fontFamily: defaultFontFamily } = theme.defaultConfig.token;

export const customAntdTheme = {
  token: {
    fontFamily: import.meta.env['VITE_GLOBAL_FONT_FAMILY'] ?? defaultFontFamily,
  },
};
