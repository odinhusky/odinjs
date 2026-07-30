const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const dotenv = require('dotenv');

const prompt = inquirer.prompt || inquirer.default?.prompt;
if (!prompt) {
  throw new Error('Inquirer prompt 初始化失敗，請確認 inquirer 版本與安裝狀態');
}

const ENV_PATH = path.join(__dirname, '.env.deploy');
const TEMPLATE_DIR = path.join(__dirname, '../../template');

if (!fs.existsSync(ENV_PATH)) {
  console.error('.env.deploy 檔案不存在，請確認 tool/deploy/.env.deploy 是否存在');
  process.exit(1);
}
dotenv.config({ path: ENV_PATH });

const username = process.env.USER_NAME;
const accessToken = process.env.GITLAB_ACCESS_TOKEN;
if (!username || !accessToken) {
  console.error('USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .env.deploy 檔案裡');
  process.exit(1);
}
const GIT_REMOTE = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;

// 指定的 templates 列表，預設為空
const SPECIFIC_SITE_KEYS = [
];

function getSpecificSiteKeys() {
  // 驗證指定的 siteKeys 是否存在
  const existingSiteKeys = fs.readdirSync(TEMPLATE_DIR).filter(f =>
    fs.statSync(path.join(TEMPLATE_DIR, f)).isDirectory()
  );

  const validSiteKeys = SPECIFIC_SITE_KEYS.filter(siteKey => {
    if (!existingSiteKeys.includes(siteKey)) {
      console.warn(`警告: ${siteKey} 不存在於 template 目錄中，將跳過`);
      return false;
    }
    return true;
  });

  return validSiteKeys;
}

function getLatestTag(tags, siteKey, env) {
  const re = new RegExp(`^refs/tags/${env}-${siteKey}-v(\\d+)\\.(\\d+)\\.(\\d+)$`);
  let max = null;
  tags.forEach(tag => {
    const m = re.exec(tag);
    if (m) {
      const v = m.slice(1).map(Number);
      if (!max || v[0] > max[0] || (v[0] === max[0] && v[1] > max[1]) || (v[0] === max[0] && v[1] === max[1] && v[2] > max[2])) {
        max = v;
      }
    }
  });
  return max;
}

function incPatch(v) {
  return [v[0], v[1], v[2] + 1];
}

async function main() {
  // 先檢查是否有指定的 siteKeys
  if (SPECIFIC_SITE_KEYS.length === 0) {
    console.error('錯誤: SPECIFIC_SITE_KEYS 陣列為空，請至少指定一個 template');
    process.exit(1);
  }

  const siteKeys = getSpecificSiteKeys();
  if (siteKeys.length === 0) {
    console.error('錯誤: 沒有任何有效的 siteKey 可以處理（所有指定的 templates 都不存在）');
    process.exit(1);
  }

  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const branchToEnvMap = {
    'main': 'production',
    'develop': 'develop',
    'staging': 'staging'
  };

  const env = branchToEnvMap[currentBranch];

  if (!env) {
    console.error(`錯誤：當前分支 (${currentBranch}) 不在允許的部署清單中 (develop, staging, main)`);
    process.exit(1);
  }

  console.log(`目前要進版的環境是 ${env} (分支: ${currentBranch})`);

  const tagsRaw = execSync(`git ls-remote --tags ${GIT_REMOTE}`).toString().split('\n');
  const tags = tagsRaw.map(line => line.split('\t')[1]).filter(Boolean);

  console.log(`\n將處理以下 ${siteKeys.length} 個 templates:`);
  siteKeys.forEach(siteKey => console.log(`  - ${siteKey}`));

  const toCreate = [];
  for (const siteKey of siteKeys) {
    let latest = getLatestTag(tags, siteKey, env);
    if (latest) {
      let next = incPatch(latest);
      let tagName = `${env}-${siteKey}-v${next.join('.')}`;
      // 檢查遠端是否已存在同名 tag，若有則 patch++
      while (tags.includes(`refs/tags/${tagName}`)) {
        next = incPatch(next);
        tagName = `${env}-${siteKey}-v${next.join('.')}`;
      }
      toCreate.push(tagName);
    } else {
      console.log(`跳過 ${siteKey} 版型: ${env}-${siteKey} 不存在`);
    }
  }

  if (toCreate.length === 0) {
    console.log('沒有任何 tag 需要建立');
    return;
  }

  console.log('\n即將建立並推送以下 tags：');
  for (const tag of toCreate) {
    console.log(tag);
  }

  const { confirmPush, delaySeconds } = await prompt([
    {
      type: 'confirm',
      name: 'confirmPush',
      message: `允許建立，是否確認建立並推送?`,
      default: false
    },
    {
      type: 'input',
      name: 'delaySeconds',
      message: '每個 tag 之間的延遲秒數 (預設0:不延遲)',
      default: '0',
      when: (answers) => answers.confirmPush,
      validate: (input) => {
        const value = Number(input);
        if (!Number.isInteger(value) || value < 0) {
          return '請輸入 0 或正整數';
        }
        return true;
      },
      filter: (input) => Number(input)
    }
  ]);

  if (!confirmPush) {
    console.log('已取消建立所有 tags');
    return;
  }

  for (let i = 0; i < toCreate.length; i++) {
    const tagName = toCreate[i];
    try {
      execSync(`git tag ${tagName}`, { stdio: 'inherit' });
      execSync(`git push ${GIT_REMOTE} ${tagName}`, { stdio: 'inherit' });
      console.log(`建立並推送成功: ${tagName}`);

      // 如果不是最後一個 tag，且有設定延遲時間，則等待
      if (i < toCreate.length - 1 && delaySeconds > 0) {
        console.log(`等待 ${delaySeconds} 秒後繼續...\n`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      }
    } catch (e) {
      console.error(`遠端建立 ${tagName} 失敗: `, e.message);
    }
  }
  console.log('\n全部 tags 已建立並推送完畢！');
}

main();

