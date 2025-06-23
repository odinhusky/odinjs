const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const path = require('path');
const { loadEnv } = require('vite');
const { checkEnv } = require('../build');
const mode = process.env.NX_TASK_TARGET_CONFIGURATION;
const __targetDirname = path.resolve(
  __dirname,
  `../../../../apps/${process.env.NX_TASK_TARGET_PROJECT}`
);

const envDir = path.resolve(__targetDirname, 'env');
const env = loadEnv(mode, envDir, '');

const { VITE_COUNTRY_CODE, VITE_V_VERSION } = checkEnv(env, [
  'VITE_COUNTRY_CODE',
  'VITE_V_VERSION',
]);

const { tailwindVariables } = require('./tailwind.variables');

const plugin = require('tailwindcss/plugin');
const fs = require('fs');
const axios = require('axios');
const postcss = require('postcss');

const isDev = process.env.NODE_ENV === 'development';

/**
 * S3 url
 * 當前還在邊自動部署環境編譯過程，並不是已經部署正式環境，會抓不到 S3 path 轉發 ['/resources/']
 * 所以只能寫死 S3 url path，切記勿改動
 * @type {string}
 * @author Evan
 */

const themeUrl = path.resolve(
  __targetDirname,
  isDev
    ? `./src/setting/dev/${VITE_V_VERSION}/theme.css`
    : `./src/setting/theme.css`
);
const localCss = fs.readFileSync(themeUrl, 'utf8');

const s3Url = 's3://game.ttgroup.vip';
const fnSettingUrl = `${s3Url}/fn-setting/setting`;
const remoteThemeUrl = `${fnSettingUrl}/${VITE_COUNTRY_CODE.toLowerCase()}/${VITE_V_VERSION}/theme.css`;
/**
 * @deprecated 自動部署環境無法直接讀取[S3]資源
 * @returns {Promise<any|string>}
 */
const getRemoteTheme = async () => {
  const response = await axios.get(remoteThemeUrl);
  if (response.status !== 200 || response.data === undefined) {
    // NOTE 確保不崩潰
    return localCss;
  }
  return await response.data; // 返回文件内容
};

/**
 * 解析 theme.css 文件中的 :root 变量
 * isDev ? localCss : await getRemoteTheme() 依照當前環境 read 環境 root theme
 * @returns {Promise<{}>}
 */
const getRootVariables = async () => {
  const rootVars = {};
  await postcss()
    .process(localCss, { from: undefined })
    .then((result) => {
      result.root.walkRules(':root', (rule) => {
        rule.walkDecls((decl) => {
          rootVars[decl.prop] = decl.value;
        });
      });
    });
  return rootVars;
};

/**
 * 判斷 是否為 linear-gradient
 * @param value
 * @param rootVariables
 * @returns {boolean}
 */
const isLinearGradient = (value, rootVariables) => {
  const variableName = value.trim().slice(4, -1).trim();
  const variableValue = rootVariables[variableName] || '';
  return variableValue.includes('linear-gradient');
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(
      __targetDirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__targetDirname),
  ],
  theme: {
    extend: {
      screens: tailwindVariables.theme.screens,
      fontSize: tailwindVariables.theme.fontSize,
      colors: tailwindVariables.theme.colors,
      bgGradientDeg: {
        75: '75deg',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: ' translateX(-200%)' },
        },
        heartBeat: {
          '0%': {
            transform: 'scale(1)',
          },
          '14%': {
            transform: 'scale(1.5)',
          },
          '28%': {
            transform: 'scale(1)',
          },

          '42%': {
            transform: 'scale(1.5)',
          },
          '70%': {
            transform: 'scale(1)',
          },
        },
        heartBeatIcon: {
          '0%': {
            transform: 'scale(1)',
          },
          '14%': {
            transform: 'scale(1.1)',
          },
          '28%': {
            transform: 'scale(1)',
          },
          '42%': {
            transform: 'scale(1.1)',
          },
          '70%': {
            transform: 'scale(1)',
          },
        },
        scrollContent: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(calc(-1 * var(--scroll-content-width)))',
          },
        },
        loadingWave: {
          '0%': {
            height: '5px',
          },
          '50%': {
            height: '40px',
          },
          '100%': {
            height: '5px',
          },
        },
        showAni: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, -100%, 0)',
          },
          '100%': {
            opacity: '1',
            transform: 'translate3d(0, 0, 0)',
          },
        },
        hideAni: {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
            transform: 'translate3d(0, -100%, 0)',
          },
        },
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'up-baloon': {
          '0%': { transform: 'translateY(0rem)' },
          '50%': { transform: 'translateY(-1.875rem)' },
          '100%': { transform: 'translateY(0rem)' },
        },
        'wheel-prev-spin-infinitely': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },

        // [V6] 排行榜動畫
        'flicker-rotate': {
          '0%': { opacity: '0.4', transform: 'rotate(-10deg)' },
          '50%': { opacity: '0.8', transform: 'rotate(10deg)' },
          '100%': { opacity: '0.4', transform: 'rotate(-10deg)' },
        },
        'shine-r-20': {
          '0%': { left: '-50%', transform: 'translateX(-100%) rotate(20deg)' },
          '100%': { left: '120%', transform: 'translateX(200%) rotate(20deg)' },
        },
        'star-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
          '57.14%': { transform: 'scale(1)' }, // 0.8s / 1.4s ≈ 57.14%
          '100%': { transform: 'scale(1)' },
        },
        'coins-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '57.14%': { transform: 'scale(1)' }, // 0.8s / 1.4s ≈ 57.14%
          '100%': { transform: 'scale(1)' },
        },
        'clound-bouncing': {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-0.5rem)' }, // 約 0.35s / 0.7s
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
        heartBeat: 'heartBeat 2s infinite',
        scrollContent: 'scrollContent 15s linear infinite',
        loadingWave: 'loadingWave 1s ease-in-out infinite',
        showAni: 'showAni 0.5s 0s 1',
        hideAni: 'hideAni 0.5s 0s 1',
        heartBeatIcon: 'heartBeatIcon 1s infinite',
        'spin-reverse': 'spin-reverse 0.5s linear infinite',
        'up-baloon': 'up-baloon 3s linear infinite',
        'wheel-prev-spin-infinitely':
          'wheel-prev-spin-infinitely 20s linear infinite',
        'pulse-scale-infinitely': 'pulse-scale 1s linear infinite',

        // [V6] 排行榜動畫
        'flicker-rotate': 'flicker-rotate 2s ease-in-out infinite',
        'shine-r-20': 'shine-r-20 2s linear infinite',
        'star-pulse': 'star-pulse 1.4s ease-in-out infinite',
        'coins-pulse': 'coins-pulse 1.4s ease-in-out infinite',
        'clound-bouncing': 'clound-bouncing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
    plugin(async function ({
      addBase,
      addUtilities,
      matchUtilities,
      config,
      theme,
    }) {
      const rootVariables = await getRootVariables();
      addBase({
        '.numbered-item': {
          // position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr', // 自动分配编号和内容的空间
          counterIncrement: 'item-counter',
        },
        '.numbered-item:before': {
          content: 'counter(item-counter) ". "',
          marginRight: 'calc(0.75rem)',
        },

        '.dots-item': {
          // position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr', // 自动分配编号和内容的空间
          counterIncrement: 'item-counter',
        },
        '.dots-item:before': {
          content: '" ∙"',
          marginRight: 'calc(0.75rem)',
        },

        // '.after-rounded': {
        //   '::after': {
        //     borderRadius: '0.25rem', // 圆角边
        //   },
        // },
        '.after-rounded-sm:after': {
          borderRadius: '0.125rem', // 圆角边
        },
        '.after-rounded:after': {
          borderRadius: '0.25rem', // 圆角边
        },
        '.after-rounded-lg:after': {
          borderRadius: '0.5rem', // 圆角边
        },
        '.after-rounded-xl:after': {
          borderRadius: '0.75rem', // 圆角边
        },
      });
      addUtilities({
        '.text-xxxs': {
          'font-size': '8px',
          'line-height': '10px',
        },
        '.text-xxs': {
          'font-size': '10px',
          'line-height': '12px',
        },
        '.text-3xxl': {
          'font-size': '32px',
          'line-height': '36px',
        },
        '.bgi-cover-center': {
          'background-size': 'cover',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
        },
        '.bgi-contain-center': {
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
        },
        '.bg-size-100': {
          'background-size': '100% 100%',
        },
        '.bgi-text-border': {
          position: 'relative',
          '&::before': {
            content: 'attr(data-stroke)',
            position: 'absolute',
            zIndex: -1,
            WebkitTextStroke: '1px black',
            textStroke: '1px black',
          },
        },
      });
      matchUtilities({
        bgi: (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              'background-image': value,
            };
          } else {
            return {
              background: value,
            };
          }
        },
        'bgi-text': (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              color: 'transparent',
              'background-clip': 'text',
              '-webkit-background-clip': 'text',
              'background-image': value,
            };
          } else {
            return {
              color: value,
            };
          }
        },
        'bg-shadow': (value) => ({
          'box-shadow': value,
        }),
        'bgi-border-b': (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '1px',
                backgroundImage: value,
              },
            };
          } else {
            return {
              borderBottomColor: value,
            };
          }
        },
        'bgi-border-t': (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '1px',
                backgroundImage: value,
              },
            };
          } else {
            return {
              borderBottomColor: value,
            };
          }
        },
        'bgi-border': (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-1px',
                bottom: '-1px',
                left: '-1px',
                right: '-1px',
                display: 'block',
                border: '1px solid transparent',
                background: `${value} border-box`,
                WebkitMask:
                  'linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              },
            };
          } else {
            return {
              borderColor: value,
            };
          }
        },
        'bgi-border-2': (value) => {
          if (isLinearGradient(value, rootVariables)) {
            return {
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-2px',
                bottom: '-2px',
                left: '-2px',
                right: '-2px',
                display: 'block',
                border: '2px solid transparent',
                background: `${value} border-box`,
                WebkitMask:
                  'linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                borderRadius: 'inherit',
                pointerEvents: 'none',
              },
            };
          } else {
            return {
              borderColor: value,
            };
          }
        },

        'bgi-after-zIndex': (zindex) => {
          return {
            '&::after': {
              zIndex: `${zindex}`,
            },
          };
        },
        'bgi-text-border': (value) => {
          const [color = 'black', strokeWidth = '1px'] = value
            ? value.split(',')
            : [];

          return {
            position: 'relative',
            '&::before': {
              content: 'attr(data-stroke)',
              position: 'absolute',
              zIndex: -1,
              WebkitTextStroke: `${strokeWidth} ${color}`,
              textStroke: `${strokeWidth} ${color}`,
            },
          };
        },
      });
    }),
  ],
};
