# Quasar App (wow-core)

GSI Platform Multiverse

## Install the dependencies

```bash
npm install
# 或
pnpm install
# 或
yarn
```

根目錄含 `package-lock.json`、`pnpm-lock.yaml`、`yarn.lock`；請擇一工具安裝，並以該工具對應的鎖檔為準，不要混用多種鎖檔。

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
# 或 pnpm run lint / yarn lint
```

### Format the files

```bash
npm run format
# 或 pnpm run format / yarn format
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

### layout 新頁面新增說明

```
當要新增content 頁面時, 在資料夾layout/content 中, 為所有content頁面
ex:  當有新的頁面 Slot.vue 則, 路徑/Slot 時為顯示此頁
```
