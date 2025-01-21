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
 * @example '~> npm urn sync_images:s3 india-game:v6 {accessKeyId} {secretAccessKey}'
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
  maxSockets: 5000, // 提高 socket 并发上限
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

// ex: /apps/india-game/public/images/v2/
// const localImagesPath = `/apps/${projectName}/public/images/${version}/`;

const rootPath = path.join(__dirname, `/apps/${projectName}/public/images/`);
const localImagesPath = path.join(
  __dirname,
  `/apps/${projectName}/public/images/${version}/`
);

const localSharedPath = path.join(
  __dirname,
  `/apps/${projectName}/public/images/shared/`
);

// 上传文件到 S3
async function uploadFile(filePath, uploadFilePath) {
  const fileContent = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  console.log('@@@===> filePath', filePath);
  console.log('@@@===> s3 path', `fn-images/${s3EnvPath}/${uploadFilePath}`);

  // 根據文件擴展名設置 Content-Type
  const getContentType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case '.ico':
        return 'image/vnd.microsoft.icon'; // MIME 类型 for .ico 文件
      case '.gif':
        return 'image/gif';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
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
    Key: `fn-images/${s3EnvPath}/${uploadFilePath}`, // 使用新的文件名上传
    Body: fileContent,
    ACL: 'public-read', // 视需求设置权限
    ContentType: getContentType(fileName), // 設置正確的 Content-Type
  };
  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`成功上传：${uploadFilePath}`);
  } catch (error) {
    console.error(`上传文件 ${uploadFilePath} 失败：`, error);
    process.exit(1); // 如果文件不存在，停止脚本执行
  }
}

// 遍历目录并上传所有文件
function uploadAllFiles(dirPath, basename) {
  if (!fs.existsSync(dirPath)) {
    console.error(`路径不存在: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath);

  if (files.length === 0) {
    console.log(`目录为空: ${dirPath}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isFile()) {
      const uploadFilePath = filePath.replace(rootPath, '');
      uploadFile(filePath, uploadFilePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      const basename = path.basename(filePath);
      uploadAllFiles(filePath, `${basename}/`);
    } else {
      console.warn(`未知文件类型，跳过: ${filePath}`);
    }
  });
}

// 开始上传
uploadAllFiles(localImagesPath, '');
uploadAllFiles(localSharedPath);
