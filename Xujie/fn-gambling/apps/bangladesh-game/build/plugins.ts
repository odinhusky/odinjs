import fs from 'fs';
import path from 'path';
import { PluginOption } from 'vite';

export const shakeTreeImage = ({
  version,
}: {
  version: string;
}): PluginOption => {
  return {
    name: 'plugin-image-shake',
    writeBundle(options) {
      if (!options.dir) return;
      //STEP dist图片资源路径
      const targetPath = `${options.dir}/images`;
      try {
        //STEP 过滤掉多余的文件夹
        const deleteDir = fs
          .readdirSync(targetPath)
          .filter((v) => v.startsWith('v') && v !== version);
        console.error('[shakeTreeImage]', deleteDir);
        //STEP 清除多余文件
        deleteDir.forEach((dirName) => {
          fs.rmdirSync(`${targetPath}/${dirName}`, { recursive: true });
        });
      } catch (e) {
        console.error('[shakeTreeImage]' + e);
      }
    },
    apply: 'build',
  };
};

/**
 * 生成preview.json,预览图片使用
 * @param
 * @returns
 */
export const imagePreviewHtml = () => {
  return {
    name: 'image-preview-html',
    buildStart: () => {
      const targetPath = path.join(__dirname, '../public/images');
      const previewPath = path.join(targetPath, '/preview.json');
      const images = fs
        .readdirSync(targetPath)
        .filter((v) => v.includes('u') || v.includes('share'));

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const json = require(previewPath);

      images.forEach((dir) => {
        const data = fs
          .readdirSync(`${targetPath}/${dir}`)
          .filter((v) => v !== '.DS_Store');
        if (data.length > 0) {
          json[dir] = data;
        }
      });

      fs.writeFileSync(previewPath, JSON.stringify(json));
    },
  };
};
