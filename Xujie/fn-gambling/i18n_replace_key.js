const fs = require('fs');
const path = require('path');

/**
 * @example '~> npm urn sync:s3 india-game:v6 {accessKeyId} {secretAccessKey}'
 */

// 从命令行参数中获取 projectName 和 projectVersion
const [, , projectName, target, field] = process.argv;

console.log(`Project: ${projectName}`);
console.log(`target: ${target}`);
console.log(`field: ${field}`);

// 載入對照表

const rawMapping =
  field === 'value'
    ? JSON.parse(fs.readFileSync('value_mapping.json', 'utf-8'))
    : JSON.parse(fs.readFileSync('mapping.json', 'utf-8'));
const mapping = Object.fromEntries(
  Object.entries(rawMapping).map(([key, value]) => [key.trim(), value.trim()])
);

// 指定目標目錄  src || i18n 目錄
const targetDirectory =
  target === 'src'
    ? path.join(__dirname, `/apps/${projectName}/src/`)
    : path.join(__dirname, `/apps/${projectName}/plugins/i18next/langs/`);

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // 对特殊字符进行转义
}

// 替換文件中的 keyname
function replaceKeysInFile(filePath, mapping) {
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  let originalContent = fileContent;
  let replacedKeys = new Set();

  for (const [oldKey, newKey] of Object.entries(mapping)) {
    // 使用正則表達式進行精確匹配
    const escapedKey = escapeRegExp(oldKey);
    const regex =
      field === 'value'
        ? new RegExp(`"${escapedKey}"`, 'g')
        : new RegExp(`\\b${oldKey}\\b`, 'g');
    if (regex.test(fileContent)) {
      replacedKeys.add(oldKey);
      fileContent =
        field === 'value'
          ? fileContent.replace(regex, `"${newKey}"`)
          : fileContent.replace(regex, newKey);
    }
  }

  if (fileContent !== originalContent) {
    fs.writeFileSync(filePath, fileContent, 'utf-8');
  }

  return replacedKeys;
}

// 遍歷目錄以替換文件
function traverseAndReplace(directory, mapping) {
  const notReplaced = new Set(Object.keys(mapping));
  const replacedInFiles = new Set();

  const traverseDirectory = (currentDir) => {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const fullPath = path.join(currentDir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        traverseDirectory(fullPath);
      } else if (file.match(/\.(js|ts|tsx|json|html|css)$/)) {
        const replacedKeys = replaceKeysInFile(fullPath, mapping);
        replacedKeys.forEach((key) => {
          notReplaced.delete(key);
          replacedInFiles.add(fullPath);
        });
      }
    });
  };

  traverseDirectory(directory);

  return { notReplaced, replacedInFiles };
}

// 執行替換
const { notReplaced, replacedInFiles } = traverseAndReplace(
  targetDirectory,
  mapping
);

// 結果報告
console.log('替換完成！');
console.log('以下文件已進行替換：');
replacedInFiles.forEach((file) => console.log(file));

if (notReplaced.size > 0) {
  console.log('\n以下 keyname 未在任何文件中找到，未替換：', notReplaced.size);
  console.log([...notReplaced]);
} else {
  console.log('\n所有 keyname 都已成功替換！');
}

// 確保目錄存在，如果不存在則創建
const reportDir = path.join(__dirname, 'i18nReport');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

// 指定報告文件路徑
const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // 格式化時間，防止非法字元
const reportFilePath = path.join(
  __dirname,
  `i18nReport/${projectName}_${
    target === 'src' ? target : 'langs'
  }_${timestamp}.json`
);

// 構造 JSON 報告
const report = {
  message:
    notReplaced.size > 0
      ? `以下 keyname 未在任何文件中找到，未替換：${notReplaced.size}`
      : '所有 keyname 都已成功替換！',
  replacedList: [...replacedInFiles], // 替換的檔案清單
  notReplacedList: [...notReplaced], // 未替換的 keyname
};

// 將報告寫入 JSON 檔案
fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2), 'utf-8');

// 提示用戶報告生成
console.log(`\n報告已生成，檔案路徑：${reportFilePath}`);
