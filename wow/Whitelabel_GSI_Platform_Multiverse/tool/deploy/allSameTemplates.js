const spawn = require("cross-spawn");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const { execSync } = require('child_process');
const dotenv = require('dotenv');

const prompt = inquirer.prompt || inquirer.default?.prompt;

if (!prompt) {
  throw new Error('Inquirer prompt 初始化失敗，請確認 inquirer 版本與安裝狀態');
}

dotenv.config({ path: path.join(__dirname, './.env.deploy') });

const { DEVELOP_ALLOWED_SITE_KEYS } = require('./developAllowedSiteKeys');

/** inquirer v8 用 list；v9+ 已移除 list，需改 select 才會顯示選項 */
function getChoicePromptType() {
  const major = Number(String(require('inquirer/package.json').version).split('.')[0]);
  return Number.isFinite(major) && major >= 9 ? 'select' : 'list';
}

// 要忽略的版型列表（全分支）
const IGNORE_TEMPLATES = ['set_r022_mga', 'cordova_app'];

/** 單一版型在互動 deploy 時，僅列出最近幾筆 tag（develop/staging 累積量大時避免洗版） */
const RECENT_TAG_DISPLAY_LIMIT = 12;

const LS_REMOTE_MAX_BUFFER = 10 * 1024 * 1024;

let siteKeys = []

function checkRequireConfigs (...arrays) {
  return arrays.every(array =>
    Array.isArray(array) &&
    array.length > 0 &&
    array.every(item => typeof item === 'string')
  )
}

async function getFoldersInDirectory(directoryPath) {
  try {
    // 讀取指定目錄下的所有項目
    const items = await fs.promises.readdir(directoryPath, { withFileTypes: true });

    // 取出資料夾名稱
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name);

    return folders;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

async function main() {
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const branchToEnvMap = {
      'main': 'production',
      'develop': 'develop',
      'staging': 'staging'
    };
    const environment = branchToEnvMap[currentBranch];

    if (!environment) {
      throw new Error(`當前分支 (${currentBranch}) 不在允許的部署清單中 (develop, staging, main)`);
    }

    siteKeys = await getFoldersInDirectory(path.join(__dirname, '../../template'));

    // 過濾掉要忽略的版型
    siteKeys = siteKeys.filter(key => !IGNORE_TEMPLATES.includes(key));
    if (currentBranch === 'develop') {
      siteKeys = siteKeys.filter(key => DEVELOP_ALLOWED_SITE_KEYS.has(key));
    }

    // 檢查所需要的檔案是否存在
    if (!siteKeys.length) {
      throw new Error("找不到版型，停止執行");
    }

    if (!checkRequireConfigs(siteKeys)) {
      throw new Error("版型資料異常，停止執行");
    }

    console.log(`目前要進版的環境是 ${environment} (分支: ${currentBranch})`);
    if (currentBranch === 'develop') {
      console.log(
        'develop 分支：選單僅顯示允許清單內的版型（見 tool/deploy/developAllowedSiteKeys.js），其餘已排除'
      );
    }
    console.log(`共 ${siteKeys.length} 個可部署版型`);

    const questions = [
      {
        type: getChoicePromptType(),
        name: 'siteKey',
        message: '請選擇欲部屬的版型:',
        choices: siteKeys.map((key) => ({ name: key, value: key })),
      },
    ];

    const { siteKey } = await prompt(questions);

    if(!environment){
      throw new Error("未選擇環境");
    }
    if(!siteKey){
      throw new Error("未選擇版型");
    }

    // 列出目前的 tags，並取得建議下一版（作為輸入預設值）
    const { suggestedVersion } = await showCurrentTags({ environment, siteKey });

    const versionQuestion = [
      {
        type: 'input',
        name: 'version',
        message: '請輸入版本號:',
        default: suggestedVersion ?? ''
      }
    ];

    const { version } = await prompt(versionQuestion);

    if(!version){
      throw new Error("未輸入版本號");
    }

    deploy({
      environment,
      siteKey,
      version
    });

  } catch (error) {
    console.error("執行出錯:", error);
    process.exit(1);
  }
}

function semverFromDeployTag(tag) {
  const m = tag.match(/-v(\d+)\.(\d+)\.(\d+)$/);
  if (!m) {
    return null;
  }
  return m.slice(1).map(Number);
}

function parseRefsFromLsRemote(output) {
  const refs = new Set();
  for (const line of output.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const ref = trimmed.split('\t')[1];
    if (!ref || !ref.startsWith('refs/tags/')) {
      continue;
    }
    if (ref.endsWith('^{}')) {
      continue;
    }
    refs.add(ref);
  }
  return [...refs];
}

/**
 * @returns {{ suggestedVersion?: string }} suggestedVersion 為下一 patch（含前綴 v），無法推算時不帶
 */
async function showCurrentTags(options) {
  const accessToken = process.env.GITLAB_ACCESS_TOKEN;
  const username = process.env.USER_NAME;
  if (!username || !accessToken) {
    console.error('Error: USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .deploy-env 檔案裡');
    process.exit(1);
  }

  try {
    const remoteUrl = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;

    const prefix = `refs/tags/${options.environment}-${options.siteKey}-`;
    const existingTags = execSync(
      `git ls-remote --tags ${remoteUrl} "${prefix}*"`,
      { maxBuffer: LS_REMOTE_MAX_BUFFER }
    ).toString();

    const matchingTags = parseRefsFromLsRemote(existingTags).map(r => r.replace(/^refs\/tags\//, ''));

    if (matchingTags.length) {
      const sortedAsc = matchingTags
        .filter(t => semverFromDeployTag(t))
        .sort((a, b) => {
          const av = semverFromDeployTag(a);
          const bv = semverFromDeployTag(b);
          for (let i = 0; i < 3; i++) {
            if (av[i] !== bv[i]) {
              return av[i] - bv[i];
            }
          }
          return 0;
        });

      if (!sortedAsc.length) {
        console.log(
          `找到 ${options.environment}-${options.siteKey} 的 tag，但無符合 semver（-v主.次.patch）的項目`
        );
        return {};
      }

      // 取「全體中版本最新的 N 筆」，畫面上依舊→新排列
      const window = sortedAsc.slice(-RECENT_TAG_DISPLAY_LIMIT);
      const olderOmitted = sortedAsc.length - window.length;

      console.log(
        `以下為 ${options.environment}-${options.siteKey} 最近版本（舊→新，最多 ${RECENT_TAG_DISPLAY_LIMIT} 筆）:\n`
      );
      window.forEach(line => console.log(line));
      if (olderOmitted > 0) {
        console.log(
          `\n（另有 ${olderOmitted} 筆較舊 tag 未列出；輸入新版號時請避免與既有 tag 重複）`
        );
      }

      const latestTag = sortedAsc[sortedAsc.length - 1];
      const latestV = semverFromDeployTag(latestTag);
      let suggestedVersion;
      if (latestV) {
        suggestedVersion = `v${latestV[0]}.${latestV[1]}.${latestV[2] + 1}`;
        console.log(
          `\n目前最新為 ${latestTag}；下一 patch 建議為 ${suggestedVersion}（已帶入下方輸入預設，可直接 Enter）\n`
        );
      } else {
        console.log('\n');
      }
      return suggestedVersion ? { suggestedVersion } : {};
    }

    const firstTag = `${options.environment}-${options.siteKey}-v0.0.1`;
    console.log(
      `當前選擇的環境與版型並未存在其他版本的 tags；預設版本 v0.0.1（完整 tag：${firstTag}）`
    );
    return { suggestedVersion: 'v0.0.1' };
  } catch (error) {
    console.error(`取得當前選擇的環境與版型 tags 失敗: ${error.message}`);
    return {};
  }
}

async function deploy(options){
  const accessToken = process.env.GITLAB_ACCESS_TOKEN;
  const username = process.env.USER_NAME;
  if (!username || !accessToken) {
    console.error('Error: USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .deploy-env 檔案裡');
    process.exit();
  };

  try {
    const remoteUrl = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;
    const tagName = `${options.environment}-${options.siteKey}-${options.version}`;

    const existingTags = execSync(
      `git ls-remote --tags ${remoteUrl} "refs/tags/${tagName}"`,
      { maxBuffer: LS_REMOTE_MAX_BUFFER }
    ).toString();
    const tagExists = parseRefsFromLsRemote(existingTags).includes(`refs/tags/${tagName}`);

    if (tagExists) {
      console.log(`${tagName} tag 已經存在`);
    } else {
      const answer = await prompt([
        {
          type: "confirm",
          name: "confirmPush",
          message: `${tagName} 允許建立，是否確認建立並推送?`,
          default: false
        }
      ])

      if (!answer.confirmPush) {
        console.log(`取消建立 tag: ${tagName}`);
        process.exit();
      }

      execSync(`git tag ${tagName}`);
      execSync(`git push ${remoteUrl} ${tagName}`, { stdio: 'inherit' });

      console.log(`${tagName} tag 已成功建立並完成推送`);
    }
  } catch(error) {
    console.error(`建立或推送 tag 失敗: ${error.message}`);
  }
}

main()
