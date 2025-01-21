const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

//STEP 获取命令行参数
const argv = process.argv;
const targetName = argv[2];
const [projectName, configuration] = (argv[3] || '').split(':');

// STEP 读取并动态替换 apps/{projectName}/project.json
const projectPath = path.join(__dirname, 'apps', projectName, 'project.json');
const projectConfig = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));

// 动态生成配置
projectConfig.targets.build.configurations[`${configuration}`] = {
  buildTarget: `${projectName}:build:${configuration}`,
};
projectConfig.targets.serve.configurations[`${configuration}`] = {
  mode: `${configuration}`,
};

// STEP 写入更新后的配置
fs.writeFileSync(projectPath, JSON.stringify(projectConfig, null, 2));

// STEP 印出配置
const dynamicProjectConfig = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
console.log(`> project.json`, JSON.stringify(dynamicProjectConfig, null, 2));
execSync(
  `echo "${JSON.stringify(dynamicProjectConfig).replace(/"/g, '\\"')}"`,
  { stdio: 'inherit' }
);

if (!configuration || !projectName) {
  const project = require(`./apps/${projectName}/project.json`);
  const configurations =
    Object.keys(project?.targets?.[targetName]?.configurations || {}) || [];
  console.error(
    `npm run ${targetName} ${projectName || '[projectName]'}:${
      configuration ||
      `[configuration]\n eg:\n` +
        configurations
          .map((v) => `npm run ${targetName} ${projectName}:${v}`)
          .join('\n')
    }`
  );
  process.exit(1);
}

//STEP 动态修改libs project.json 的outputPath，将libs打包到apps中
const envDir = path.resolve(__dirname, `./apps/${projectName}/env`);
const { loadEnv } = require('vite');
const { VITE_MODE,VITE_V_VERSION,  VITE_VERSION } = loadEnv(configuration, envDir, '');
const libsProject = require(`./libs/project.json`);
libsProject.targets.build.options.outputPath = `dist/apps/${projectName}/${
  VITE_MODE === 'dev' ? 'dev_' : ''
}${VITE_V_VERSION}/${VITE_VERSION}/libs`;
fs.writeFileSync('./libs/project.json', JSON.stringify(libsProject, null, 2));

// STEP 执行nx命令
console.log(`> npm run ${targetName} ${projectName}:${configuration}`);
execSync(
  `nx ${targetName} ${projectName} -c=${configuration} --mode=${configuration}`,
  {
    stdio: 'inherit',
  }
);

//STEP clean libs ts
(function () {
  const targetPath = libsProject.targets.build.options.outputPath;
  try {
    const deleteDir = fs
      .readdirSync(targetPath)
      .filter((v) => !v.includes('js') || v.includes('package.json'));

    deleteDir.forEach((dirName) => {
      fs.rmSync(`${targetPath}/${dirName}`, { recursive: true });
      console.log(`dist/${dirName}`, `${targetPath}/${dirName}`, 'utf8');
    });
  } catch (e) {
    console.log(`dist/error`, JSON.stringify(e), 'utf8');
    console.error('[plugin-clean-ts]' + e);
  }
})();

// STEP 还原原始的 project.json 文件 失效
// delete projectConfig.targets.serve.configurations[`${configuration}`];
// delete projectConfig.targets.build.configurations[`${configuration}`];
// fs.writeFileSync(projectPath, JSON.stringify(projectConfig, null, 2));
