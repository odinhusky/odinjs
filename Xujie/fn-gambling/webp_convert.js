const { execSync } = require('child_process');
const { readdirSync, statSync } = require('fs');
const path = require('path');

/**
 * @example '~> npm urn sync:s3 india-game:v6 {accessKeyId} {secretAccessKey}'
 */

// 从命令行参数中获取 projectName 和 projectVersion
const [, , targetName, accessKeyId, secretAccessKey] = process.argv;

const [projectName, version] = (targetName || '').split(':');

console.log(`Project: ${projectName}`);
console.log(`Version: ${version}`);

// 獲取當前工作目錄，並組合成目標路徑
const localImagesPath = path.join(
  __dirname,
  `/apps/${projectName}/public/images/${version}/`
); // 使用 path.join 組合路徑
const localSharedPath = path.join(
  __dirname,
  `/apps/${projectName}/public/images/shared/`
); // 使用 path.join 組合路徑
console.log(`localImagesPath: ${localImagesPath}`);
console.log(`localSharedPath: ${localSharedPath}`);

// function processDirectories(basePath) {
//   try {
//     execSync(
//       `for dir in ${basePath}*/; do
//         echo "$dir"
//         cd $dir
//         for f in *.png; do
//           cwebp $f -q 70 -o \"\${f\/png\/webp}\";
//         done
//         cd ../
//       done`,
//       { stdio: 'inherit', shell: '/bin/bash' }
//     );
//   } catch (error) {
//     console.error(`Failed to convert: ${basePath}`, error.message);
//   }
// }

function processDirectories(basePath) {
  const items = readdirSync(basePath);
  items.forEach((item) => {
    const fullPath = path.join(basePath, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      // 如果是資料夾，遞迴處理
      processDirectories(fullPath);
    } else if (stats.isFile() && item.endsWith('.png')) {
      // 如果是 .png 文件，轉換成 .webp
      const outputWebp = fullPath.replace(/\.png$/, '.webp');
      try {
        execSync(`cwebp "${fullPath}" -q 100 -o "${outputWebp}"`);
        console.log(`Converted: ${fullPath} -> ${outputWebp}`);
      } catch (error) {
        console.error(`Failed to convert: ${fullPath}`, error.message);
      }
    }
  });
}

// 執行腳本
processDirectories(localImagesPath);
processDirectories(localSharedPath);
