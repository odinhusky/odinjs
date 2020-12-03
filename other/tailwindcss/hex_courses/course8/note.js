// 詳解 Variant Tailwind config 設定方式

// 可以在終端機下這個指令，查看所有的預設設定(Configurataion)
// 這邊也提供網頁版的查詢 https://unpkg.com/browse/tailwindcss@2.0.1/stubs/defaultConfig.stub.js
// npx tailwindcss init --full

// 一般使用 tailwind.config.js 的 extend 去覆蓋掉原始的設定
// 但也可以使用改動預設設定值得方式，來達成你要的效果，不過一般還是建議使用覆蓋預設值得方式比較好，但兩種都可以。

// 希望每個 utitlity 支援特定的偽元素，要怎麼設定

// variants: {
//   backgroundClip: ['responsive'], // => backgroundClip: ['responsive', 'focus']
// }

// 這樣改動之後，就可以讓 focus:utitlity(bg-clip-border) 可以成功吃到樣式
