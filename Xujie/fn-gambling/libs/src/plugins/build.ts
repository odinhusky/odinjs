import os from 'os';
import path from 'path';
import fs from 'fs';
import { BuildOptions } from 'vite';

export const getLocalExternalIPv4 = (): string => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const addressInfo of addresses || []) {
      if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
        return addressInfo.address;
      }
    }
  }
  return 'localhost'; // Fallback in
};

export const getLibsAlias = () => {
  return {
    '@libs': path.resolve(__dirname, '..'),
    '@commonUtils': path.resolve(__dirname, '../commonUtils'),
    '@mode2': path.resolve(__dirname, '../mode2'),
    '@mode2API': path.resolve(__dirname, '../mode2/external/api'),
    '@mode2Trans': path.resolve(__dirname, '../mode2/external/transform'),
    '@constant': path.resolve(__dirname, '../constant'),
  };
};

export const setupComponentsMapping = (
  env: Record<string, string>,
  __dirname: string
): Record<string, string> => {
  const { VITE_MODE, VITE_V_VERSION } = checkEnv(env, [
    'VITE_MODE',
    'VITE_V_VERSION',
  ]);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateConfigPath = path.resolve(
    __dirname,
    VITE_MODE === 'dev'
      ? `./src/setting/${`dev/${VITE_V_VERSION}`}/template_config.json`
      : `./src/setting/template_config.json`
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(path.resolve(__dirname, templateConfigPath));

  const generatePaths = (
    sectionName: string,
    entries: Record<string, string>
  ): Record<string, string> => {
    const output: Record<string, string> = {};

    if (!entries) return {};

    Object.entries(entries).forEach(([name, value]) => {
      const basePath = `${sectionName}/${name}`;
      output[`@${basePath}`] = path.resolve(
        __dirname,
        `./src/ui/${value}/${basePath}`
      );
    });
    return output;
  };
  // 分别调用生成不同部分的路径
  const apps = generatePaths('apps', config.apps);
  const components = generatePaths('components', config.components);
  const modals = generatePaths('modals', config.modals);
  const pages = generatePaths('pages', config.pages);
  const templates = generatePaths('templates', config.templates);
  // const styles = generatePaths('styles', config.styles);
  let styles = {};

  if (config.styles) {
    const stylesFiles = fs.readdirSync(
      path.resolve(__dirname, `./src/ui/${config.styles}/styles`)
    );
    const stylesRecord: Record<string, string> = Object.fromEntries(
      stylesFiles.map((fileName) => {
        return [fileName, `${config.styles}`];
      })
    );
    styles = generatePaths('styles', stylesRecord);
  }

  let routes = {};
  if (config.routes) {
    const output: Record<string, string> = {};
    Object.entries(config.routes).forEach(([name, value]) => {
      const basePath = `${name}`;
      output[`@router/${basePath}`] = path.resolve(
        __dirname,
        `./src/router/${value}/${basePath}`
      );
    });
    routes = output;
  }

  const templateResult = {
    ...apps,
    ...components,
    ...modals,
    ...pages,
    ...templates,
    ...styles,
    ...routes,
  };

  console.log('@@@===>', templateResult);

  return templateResult;
};

/**
 * output build 输出文件
 */
export const getRollupOptions: (
  env: Record<string, string>
) => BuildOptions['rollupOptions'] = (env) => {
  const { VITE_MODE, VITE_V_VERSION, VITE_VERSION, VITE_IS_UAT } = checkEnv(
    env,
    ['VITE_MODE', 'VITE_V_VERSION', 'VITE_VERSION', 'VITE_IS_UAT']
  );
  const envPrefix = `${
    VITE_MODE === 'prod' ? (VITE_IS_UAT === 'true' ? 'uat_' : '') : 'dev_'
  }`;
  return {
    output: [
      {
        chunkFileNames: `${envPrefix}${VITE_V_VERSION}/${VITE_VERSION}/js/[name].js`, // 引入文件名的名称
        entryFileNames: `${envPrefix}${VITE_V_VERSION}/${VITE_VERSION}/js/[name].js`, // 包的入口文件名称
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return `${envPrefix}${VITE_V_VERSION}/${VITE_VERSION}/[ext]/[name].[ext]`; // 资源文件像 字体，图片等
          }
          return `[ext]/[name]-${VITE_VERSION}.[ext]`; // 资源文件像 字体，图片等
        },

        // TODO Ronan test
        // 分包配置
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lodash')) return 'vendor-lodash';
            if (id.includes('swiper')) return 'vendor-swiper';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('sentry')) return 'vendor-sentry';
            if (id.includes('posthog')) return 'vendor-posthog';
            if (id.includes('html2canvas')) return 'vendor-html2canvas';
            if (id.includes('html-to-image')) return 'vendor-html-to-image';
            if (id.includes('elliptic')) return 'vendor-elliptic';
            if (id.includes('vite')) return 'vendor-vite';
            if (id.includes('crypto')) return 'vendor-crypto';
            if (id.includes('babel')) return 'vendor-babel';
            if (id.includes('router')) return 'vendor-router';
            if (id.includes('sensor')) return 'vendor-sensor';
            if (id.includes('adjust')) return 'vendor-adjust';

            if (id.includes('mordern-screenshot'))
              return 'vendor-mordern-screenshot';

            return 'vendor-others';
          }

          // i18next plugin 分出獨立包
          if (id.includes('apps/india-game/plugins/i18next')) {
            return 'plugin-i18next';
          }

          // if (id.includes('apps/india-game/src/components/')) {
          //   const parts = id.split('src/components/')[1].split('/');
          //   return `app-src-components-${parts[0]}`;
          // }

          // if (id.includes('apps/india-game/src/hooks/')) {
          //   const parts = id.split('src/hooks/')[1].split('/');
          //   return `app-src-hooks-${parts[0]}`;
          // }

          return undefined;
        },
      },
    ],
  };
};

/**
 * 检查所需要的env变量是否有配置
 * @returns env
 */
export const checkEnv = (env: Record<string, string>, keys: string[]) => {
  keys.forEach((key) => {
    if (!env[key.trim()]) {
      console.error(`未配置env==>${key}`);
      process.exit(-1);
    }
  });

  return env;
};

export const setupComponentsUi2Mapping = (
  env: Record<string, string>,
  __dirname: string
): Record<string, string> => {
  const { VITE_MODE, VITE_V_VERSION } = checkEnv(env, [
    'VITE_MODE',
    'VITE_V_VERSION',
  ]);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const templateConfigPath = path.resolve(
    __dirname,
    VITE_MODE === 'dev'
      ? `./src/setting/${`dev/${VITE_V_VERSION}`}/template_config.json`
      : `./src/setting/template_config.json`
  );

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(path.resolve(__dirname, templateConfigPath));

  const generatePaths = (
    sectionName: string,
    entries: Record<string, string>
  ): Record<string, string> => {
    const output: Record<string, string> = {};

    if (!entries) return {};

    Object.entries(entries).forEach(([name, value]) => {
      const basePath = `${sectionName}/${name}`;
      const relativePath =
        !value || value === '0'
          ? `./src/ui2/${sectionName}/${name}`
          : `./src/ui2/${sectionName}/${name}/${value}`;
      output[`@${basePath}`] = path.resolve(__dirname, relativePath);
    });

    return output;
  };
  // 分别调用生成不同部分的路径
  const apps = generatePaths('apps', config.apps);
  const components = generatePaths('components', config.components);
  const modals = generatePaths('modals', config.modals);
  const pages = generatePaths('pages', config.pages);
  const templates = generatePaths('templates', config.templates);
  // const styles = generatePaths('styles', config.styles);
  let styles = {};

  if (config.styles) {
    styles = {
      '@styles': path.resolve(__dirname, `./src/ui2/styles/${config.styles}/`),
    };
    //
    // const stylesFiles = fs.readdirSync(
    //   path.resolve(__dirname, `./src/ui2/styles/${config.styles}`)
    // );
    // console.log('####===>stylesFiles', stylesFiles);
    // const stylesRecord: Record<string, string> = Object.fromEntries(
    //   stylesFiles.map((fileName) => {
    //     return [`${config.styles}`, fileName];
    //   })
    // );
    //
    // console.log('####===>stylesRecord', stylesRecord);
    // // styles = generatePaths('styles', stylesRecord);
    // styles = {
    //   '@styles': path.resolve(__dirname, `./src/ui2/styles/${config.styles}/`),
    // };
  }

  let routes = {};
  if (config.routes) {
    const output: Record<string, string> = {};
    Object.entries(config.routes).forEach(([name, value]) => {
      const basePath = `${name}`;
      output[`@router/${basePath}`] = path.resolve(
        __dirname,
        `./src/router/${value}/${basePath}`
      );
    });
    routes = output;
  }

  const templateResult = {
    ...apps,
    ...components,
    ...modals,
    ...pages,
    ...templates,
    ...styles,
    ...routes,
  };

  console.log('###===>', templateResult);

  return templateResult;
};
