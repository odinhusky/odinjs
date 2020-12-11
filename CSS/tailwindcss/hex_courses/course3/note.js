// 我們利用 npx tailwindcss build styles.css -o output.css 所產生的 output.css 其實大小不算小誒
// 在官網的地方有一個叫做 Controlling File Size 的篇章

// 利用 tailwind.config.js 的配置檔中的 purge 設定，tailwindcss 就可以偵測你指定得檔案中，尋找哪些 class 你有用到哪些沒有，幫你把沒有用到的class 拿掉，降低css檔案的大小

// 最簡單的設定如下，當你使用 node 的環境去編譯你的 css 的時候，設定，tailwindcss 就會自動幫你的 css 檔案大小做監控
// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {},
  variants: {},
  plugins: [],
};

// 如果使用手動的 CLI 進行編譯的話，則要加上 enable: true 的設定，並用 content: ['檔案路徑'] 告知哪些檔案需要被監控
// tailwind.config.js
module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html'],
  },
  // ...
};

// 超危險不建議使用的，不只針對 tailwind ，包含其他你所指定得檔案中，其他三方的套件所使用到的 css class，沒有用到的話也會一併被 tailwind 刪除。
// tailwind.config.js
module.exports = {
  purge: {
    mode: 'all',
    content: ['./src/**/*.js', './node_modules/pikaday/pikaday.js'],
  },
  // ...
};

// 瀏覽器支援度
// 因為主要是用flex 排版，如果專案要支援 IE 甚至是 IE 9 的話，建議不要使用 tailwind 作為 library 的框架

// tailwind intelliSense plugin(For vs code)
// 在專案中有 tailwind.config.js 的設定檔才有提示，並且載入css在專案中。
// 如果沒有的話，就重開 vs code
