// 如何使用 B5
// https://v5.getbootstrap.com/docs/5.0/getting-started/download/
// Download => ['Compiled CSS and JS', 'Source files']

// Compiled CSS and JS
// --------------------------------
// 直接下載編譯好的 css 跟 js，在需要的網頁分別引入
// 無法客製化

// Source files(包含SCSS)
// --------------------------------
// 可以在需要的地方引入，進行需要的客製化設定，再 compile 出來使用
// 又可以分為 使用 npm 以及 直接使用編譯

// 使用 npm(參考 npm_practice 的資料夾做法) --------------------------------
// 安裝好 nodejs 以後，在專案資料夾使用 npm init 創建新的 package.json
// npm install bootstrap@next --save (因為現在還是4的版本，可以用這樣的語法來下載 B5)
// 客製化引導: https://v5.getbootstrap.com/docs/5.0/customize/sass/

// Custom.scss
// Option A: Include all of Bootstrap

// @import "../node_modules/bootstrap/scss/bootstrap";

// Custom.scss
// Option B: Include parts of Bootstrap

// // Required
// @import "../node_modules/bootstrap/scss/functions";
// @import "../node_modules/bootstrap/scss/variables";
// @import "../node_modules/bootstrap/scss/mixins";

// // Optional
// @import "../node_modules/bootstrap/scss/root";
// @import "../node_modules/bootstrap/scss/reboot";
// @import "../node_modules/bootstrap/scss/type";
// @import "../node_modules/bootstrap/scss/images";
// @import "../node_modules/bootstrap/scss/containers";
// @import "../node_modules/bootstrap/scss/grid";

// 下載下來之後，官方有提供兩種方式載入，很明顯我們要細部的客製化，就使用 Option B，這樣可以只用到我們需要的部分
// 但 Required 的三隻檔案是一定必要的！


// 不使用 npm --------------------------------
// 使用 source file 的 scss 檔案抓出來，引入必要的 scss 檔案，之後再一次 compile 就可以了！