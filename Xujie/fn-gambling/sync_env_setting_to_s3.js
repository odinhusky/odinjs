const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler'); // 注意这里！

/**
 * @description
 * install :
 * !~> pnpm add @aws-sdk/client-s3
 * !~> pnpm add @aws-sdk/node-http-handler
 *
 * @example '~> npm urn sync:s3 india-game:v6 {accessKeyId} {secretAccessKey}'
 */
// 从命令行参数中获取 projectName 和 projectVersion
const [, , targetName, accessKeyId, secretAccessKey] = process.argv;

const [projectName, version] = (targetName || '').split(':');

// 检查是否提供了 projectName 和 projectVersion
if (!projectName || !version || !accessKeyId || !secretAccessKey) {
  console.error(
    'Usage: node sync_env_setting_to_s3.js <projectName> <version> <accessKeyId> <secretAccessKey>'
  );
  process.exit(1);
}

console.log(`Project: ${projectName}`);
console.log(`Version: ${version}`);
console.log(`Access Key ID: ${accessKeyId}`);
console.log(`Secret Access Key: ${secretAccessKey}`);

// 增加連線控制，避免 timeout , sockets limit
const customHttpHandler = new NodeHttpHandler({
  connectionTimeout: 10000, // 增加连接超时时间（毫秒）
  socketTimeout: 30000, // 增加 socket 超时时间
  maxSockets: 1000, // 提高 socket 并发上限
});

// 使用传入的 IAM 密钥初始化 AWS SDK
const s3Client = new S3Client({
  region: 'ap-south-1',
  requestHandler: customHttpHandler,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const mapEnvName = {
  ['india-game']: 'in',
  ['bangladesh-game']: 'bd',
  ['pakistan-game']: 'pk',
};

const bucketName = 'game.ttgroup.vip'; // 替换为实际 S3 存储桶名称
const s3EnvPath = mapEnvName[projectName]; // 對照 S3 env路徑

// 如果找不到对应的 S3 环境路径
if (!s3EnvPath) {
  console.error(`项目 ${projectName} 不支持，请检查项目名称。`);
  process.exit(1);
}

const localSettingPath = `/apps/${projectName}/src/setting/dev/${version}`;
const localEnvPath = `/apps/${projectName}/env`;

const localProdProperties = path.join(
  __dirname,
  localEnvPath,
  `.env.${version}.prod`
);
// const localUatProperties = path.join(
//   __dirname,
//   localEnvPath,
//   `.env.${version}.uat`
// );

// 使用对象来映射源文件路径到新文件名
const filesToUpload = {
  [path.join(__dirname, localSettingPath, 'theme.css')]: 'theme.css',
  [path.join(__dirname, localSettingPath, 'template_config.json')]:
    'template_config.json',
  [path.join(__dirname, localEnvPath, `.env.${version}`)]: 'dev.properties',
  [path.join(__dirname, localEnvPath, `.env.${version}.uat`)]: 'uat.properties',
  [path.join(__dirname, localEnvPath, `.env.${version}.prod`)]:
    'prod.properties',
};

// 打印文件路径和目标文件名，同时提前检查文件路径是否存在
console.log('Files to upload:');
for (const [filePath, newFileName] of Object.entries(filesToUpload)) {
  // 提前检查文件路径是否存在
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    process.exit(1); // 如果文件不存在，停止脚本执行
  }
}

// async function copyAndModifyFile(sourcePath, destinationPath) {
//   try {
//     // 复制文件
//     fs.copyFileSync(sourcePath, destinationPath);
//     console.log('文件复制成功');
//
//     // 读取文件内容
//     // 同步读取文件内容
//     const content = fs.readFileSync(destinationPath, 'utf-8');
//     console.log('文件复制成功', content);
//     // 修改文件内容
//     const newContent = content.replace(
//       /VITE_IS_UAT="false"/g,
//       'VITE_IS_UAT="true"'
//     );
//
//     console.log('文件复制成功 new', newContent);
//     // 将修改后的内容写回文件
//     fs.writeFileSync(destinationPath, newContent);
//     console.log('文件内容修改成功');
//   } catch (err) {
//     console.error('操作失败:', err.message);
//   }
// }

// 處理prod 檔案 複製一份給 uat
// copyAndModifyFile(localProdProperties, localUatProperties);

// 上传文件到 S3
async function uploadFile(filePath, newFileName) {
  const fileContent = fs.readFileSync(filePath);

  // 根據文件擴展名設置 Content-Type
  const getContentType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case '.css':
        return 'text/css';
      case '.json':
        return 'application/json';
      default:
        return 'text/plain';
    }
  };
  const uploadParams = {
    Bucket: bucketName,
    Key: `fn-setting/setting/${s3EnvPath}/${version}/${newFileName}`, // 使用新的文件名上传
    Body: fileContent,
    ACL: 'public-read', // 视需求设置权限
    ContentType: getContentType(newFileName), // 設置正確的 Content-Type
  };

  console.log('@@@===> uploadParams', uploadParams);

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`成功上传：${newFileName}`);
  } catch (error) {
    console.error(`上传文件 ${newFileName} 失败：`, error);
    process.exit(1); // 如果文件不存在，停止脚本执行
  }
}

// 逐个上传文件并重命名
const uploadPromises = Object.entries({
  ...filesToUpload,
  // ...{ [localUatProperties]: 'uat.properties' }, // 加入複製出來的 uat Properties
}).map(([filePath, newFileName]) => uploadFile(filePath, newFileName));

// 等待所有上传完成
Promise.all(uploadPromises)
  .then(() => {
    // 都上传成功后删除本地文 uat 檔案
    // fs.unlinkSync(localUatProperties);
    console.info('全部上传完成');
  })
  .catch((error) => {
    console.error('上传过程中出现错误：', error);
  });
