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

const { DEVELOP_ALLOWED_SITE_KEYS } = require('./developAllowedSiteKeys');

// 要忽略的版型列表（全分支）
const IGNORE_TEMPLATES = ['set_r022_mga', 'cordova_app'];

const username = process.env.USER_NAME;
const accessToken = process.env.GITLAB_ACCESS_TOKEN;
if (!username || !accessToken) {
  console.error('USER_NAME 或 GITLAB_ACCESS_TOKEN 未存在於 .env.deploy 檔案裡');
  process.exit(1);
}
const GIT_REMOTE = `https://${username}:${accessToken}@gltw.6633663.com/web_frontend/Whitelabel_GSI_Platform_Multiverse.git`;

/**
 * 僅對「template/<版型>」在 Git 中最近 N 天內有 commit 的版型進版（undefined = 不篩選）。
 * 以本機 repo 的 `git log` 為準，與 tag 推送時間無關。環境變數：DEPLOY_ALL_ONLY_TOUCHED_WITHIN_DAYS
 */
const ONLY_TOUCHED_WITHIN_DAYS = (() => {
  const n = Number(process.env.DEPLOY_ALL_ONLY_TOUCHED_WITHIN_DAYS);
  if (!process.env.DEPLOY_ALL_ONLY_TOUCHED_WITHIN_DAYS) {
    return undefined;
  }
  if (!Number.isInteger(n) || n <= 0) {
    console.warn(
      'DEPLOY_ALL_ONLY_TOUCHED_WITHIN_DAYS 需為正整數，已忽略此篩選'
    );
    return undefined;
  }
  return n;
})();

function getAllSiteKeys(currentBranch) {
  const allKeys = fs.readdirSync(TEMPLATE_DIR).filter(f => fs.statSync(path.join(TEMPLATE_DIR, f)).isDirectory());
  let keys = allKeys.filter(key => !IGNORE_TEMPLATES.includes(key));
  if (currentBranch === 'develop') {
    keys = keys.filter(key => DEVELOP_ALLOWED_SITE_KEYS.has(key));
  }
  return keys;
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

/**
 * 依現有遠端 tag 計算下一個完整 tag 名稱（不含 refs/tags/）。
 * 若尚無符合 `${env}-${siteKey}-v*.*.*` 的 tag，則從 v0.0.1 起算，並避開遠端已存在的同名 ref。
 * @param {string[]} tags ls-remote 取得的 ref（含 `refs/tags/` 前綴）
 * @param {number[] | null} latestSemver `getLatestTag` 結果
 */
function nextUniqueTagName(env, siteKey, tags, latestSemver) {
  let next;
  if (latestSemver) {
    next = incPatch(latestSemver);
  } else {
    next = [0, 0, 1];
  }
  let tagName = `${env}-${siteKey}-v${next.join('.')}`;
  while (tags.includes(`refs/tags/${tagName}`)) {
    next = incPatch(next);
    tagName = `${env}-${siteKey}-v${next.join('.')}`;
  }
  return tagName;
}

/** @returns {number | null} 最後修改 template 路徑的 commit 時間（ms），無紀錄為 null */
function getLastTouchMsForTemplate(siteKey) {
  // Git 路徑用正斜線，避免 Windows 上 path.join 造成反斜線
  const rel = `template/${siteKey}`;
  try {
    const out = execSync(`git log -1 --format=%ct -- ${rel}`, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024
    }).trim();
    if (!out) {
      return null;
    }
    const sec = Number(out);
    if (!Number.isFinite(sec)) {
      return null;
    }
    return sec * 1000;
  } catch {
    return null;
  }
}

async function main() {
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
  if (currentBranch === 'develop') {
    console.log(
      `develop 分支：僅處理允許清單內的版型（見 tool/deploy/developAllowedSiteKeys.js），其餘已排除`
    );
  }
  if (ONLY_TOUCHED_WITHIN_DAYS != null) {
    console.log(
      `已啟用篩選：僅處理 template/<版型> 在最近 ${ONLY_TOUCHED_WITHIN_DAYS} 天內有 Git commit 的版型（DEPLOY_ALL_ONLY_TOUCHED_WITHIN_DAYS）`
    );
  }

  // 只抓當前環境前綴的 tag，避免 develop/staging tag 爆量時 stdout / execSync 緩衝區不足
  const tagsRaw = execSync(`git ls-remote --tags ${GIT_REMOTE} "refs/tags/${env}-*"`, {
    maxBuffer: 10 * 1024 * 1024
  }).toString().split('\n');
  const tags = tagsRaw.map(line => line.split('\t')[1]).filter(Boolean);
  const siteKeys = getAllSiteKeys(currentBranch);
  const toCreate = [];
  for (const siteKey of siteKeys) {
    if (ONLY_TOUCHED_WITHIN_DAYS != null) {
      const touchedMs = getLastTouchMsForTemplate(siteKey);
      const cutoff = Date.now() - ONLY_TOUCHED_WITHIN_DAYS * 86400000;
      if (touchedMs == null || touchedMs < cutoff) {
        console.log(
          `略過 ${siteKey}：template/${siteKey} 無符合的 commit 紀錄，或最後變更早於 ${ONLY_TOUCHED_WITHIN_DAYS} 天前`
        );
        continue;
      }
    }

    const latest = getLatestTag(tags, siteKey, env);
    const tagName = nextUniqueTagName(env, siteKey, tags, latest);
    toCreate.push(tagName);
    if (!latest) {
      console.log(`版型 ${siteKey} 尚無符合格式的遠端 tag，將納入初次進版：${tagName}`);
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
