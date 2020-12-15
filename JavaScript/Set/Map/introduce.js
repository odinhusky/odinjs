// Map 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10214746
// https://ithelp.ithome.com.tw/articles/10214880
//

// MDN
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map

// 來建立 Map 吧
// 會發現 key 值什麼型態都可以
// ES6 Map
let myMap = new Map();

var keyString = 'I am string',
  keyObj = {},
  keyFunc = function () {},
  keyNumber = 1;

// 增加
myMap.set(keyString, 'string value');
myMap.set(keyObj, { obj: 1 });
myMap.set(keyFunc, function () {
  console.log('I am function');
});
myMap.set(keyNumber, 100);

// 有幾個
myMap.size; // 4

// 取值
myMap.get(keyObj); // {obj: 1}

// 看是否存在
myMap.has(keyString); //  true

// 刪掉
myMap.delete(keyNumber);
myMap.size; // 3

// 轉陣列
[...myMap.values()]; // ["string value", {obj: 1}, ƒ]

// 當然你要一開始就把值存進去也可以。

// have value when define
let myMap = new Map([
  [keyString, 'string value'],
  [keyObj, { obj: 1 }],
]);
