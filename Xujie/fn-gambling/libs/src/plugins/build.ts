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

  const templateResult = {
    ...components,
    ...modals,
    ...pages,
    ...templates,
    ...styles,
  };

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
