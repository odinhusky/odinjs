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
//           cwebp $f -Q 70 -o \"\${f\/png\/webp}\";
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
      // const outputWebp = fullPath.replace(/\.png$/, '.avif');
      const outputAvif = path.join(
        path.dirname(fullPath),
        path.basename(fullPath, '.png') + '.avif'
      );
      console.log('!! outputAvif =>', outputAvif);

      try {
        execSync(`cavif "${fullPath}" -Q 70 --speed 4 -o "${outputAvif}"`);
        console.log(`Converted AVIF: ${fullPath} -> ${outputAvif}`);
      } catch (error) {
        console.error(`Failed to convert: ${fullPath}`, error.message);
      }
    }
  });
}

// 執行腳本
processDirectories(localImagesPath);
processDirectories(localSharedPath);

// ########################################################

// 首先，你需要安裝 [cavif]，這是一個支援 .avif 的命令列工具：

// ### macOS/Linux 安裝方式如下（需先安裝 Rust）：

// # 安裝 Rust（如果你還沒有）
// curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

// 配置 cargo 設定
// . "$HOME/.cargo/env (指令包含前面那個點)

// # 安裝 cavif
// cargo install cavif

// 這會透過 Rust 的 package manager `cargo` 來從原始碼編譯並安裝 cavif。

// ### ❗注意事項

// - 安裝過程需要一些時間，因為會從原始碼 build。
// - 安裝完成後，`cavif` 指令就會出現在你的 `$HOME/.cargo/bin` 裡。
//     - 建議把這路徑加入 `~/.zshrc` 或 `~/.bashrc` 中：
//         export PATH="$HOME/.cargo/bin:$PATH"

// 使用方法
// cavif [輸入圖片路徑] -o [輸出圖片路徑]

// cavif input.png -o output.avif

// 只處理 png
// for f in *.png; do cavif "$f" -o "${f%.png}.avif"; done

// 一次處理 .png 跟 .jpg/.jpeg
// for ext in png jpg jpeg; do
//   for f in *."$ext"; do
//     [ -e "$f" ] || continue  # 如果檔案不存在，跳過
//     [ -f "$f" ] && cavif "$f" -o "${f%.*}.avif" -Q 70 --speed 4
//   done
// done

// - `-speed 4` 是 `cavif` 的壓縮速度選項，範圍是 `0` 到 `10`：
// - **`-speed 0`**：最慢、畫質最好、檔案最小（最耗時）
// - **`-speed 10`**：最快、畫質比較差、檔案比較大（用於極速轉檔）
// - **`-speed 4`**：一個 **平衡點**，轉檔速度與畫質都不錯，實務上滿常用
