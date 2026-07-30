# Quasar App (wow-core)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### store 新增新的項目指令

```bash
quasar new store [名稱]
```

### Commit Message 說明

#### message 格式

```txt
[type縮寫(feat/fix/docs/refactor/perf/test/build/ci/add)]: [標題]

- [條列細項說明、原因...等]
```

#### type

| 分類       | 縮寫     | 說明                       |
| ---------- | -------- | -------------------------- |
| Feature    | feat     | 新功能                     |
| Bug fix    | fix      | Bug 修正                   |
| Docs       | docs     | 文檔修改                   |
| Refactor   | refactor | 重構                       |
| Perf       | perf     | 優化                       |
| Testing    | test     | 測試用                     |
| Build      | build    | 改變 build 工具            |
| CI         | ci       | 與 ci 相關的設定           |
| Add others | add      | 增加與功能、代碼無關的檔案 |

#### 範例

```
feat: axios新增呼叫mock api的判斷

- 新增判斷，於run dev:mock時，判斷api function name並將request proxy到mock server api
```

#### 使用方式

```bash
# 在此專案目錄下，以以下指令將 template 加入 git config
git config commit.template .\.gitmessage.txt
```
