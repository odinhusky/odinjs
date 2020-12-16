// Map 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10214746
// https://ithelp.ithome.com.tw/articles/10214880
// https://ithelp.ithome.com.tw/articles/10215037

// ES6 — Map vs Object — What and when? => https://medium.com/front-end-weekly/es6-map-vs-object-what-and-when-b80621932373
// ES6 Collections: Using Map, Set, WeakMap, WeakSet => https://www.sitepoint.com/es6-collections-map-set-weakmap-weakset/

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

// 身為 javaScript 工程師，聽到 key pair value 第一個一定想到 Object。那跟同樣是 Key pair value 的 Map 有什不一樣呢?

// 來比較吧!
// 建立 object 有下列幾種方法

// 1 literal
// 最常見到也是最推薦的
let objLiteral = {
  id: 1,
  name: 'Hannah',
};

// 2 by constructor
// 比較不建議因為效能較差
let objConstructor = new Object();
objConstructor['id'] = 1;

// 3 using Object.prototype.create
// 通常用在繼承別人的 prototype
let objCreate = Object.create(null);
Object.defineProperty(objCreate, 'id', {
  value: 1,
});

// Map 只有一種

//Empty Map
let map1 = new Map();

// have value when define
let map = new Map([
  ['id', 1],
  ['name', 'Hannah'],
]);

// 實務上我們的確可以用 Object 來模擬 Map
class myMap {
  constructor() {
    this.items = {};
  }
  set(key, value) {
    this.items[key] = value;
  }
  delete(key) {
    if (this.has(key)) {
      delete this.items[key];
      return true;
    }
    return false;
  }
  has(key) {
    return this.items.hasOwnProperty(key);
  }
  get(key) {
    return this.has(key) ? this.items[key] : undefined;
  }
  clear() {
    this.items = {};
  }
  size() {
    return Object.keys(this.items).length;
  }
  keys() {
    return Object.keys(this.items);
  }
  values() {
    return Object.values(this.items);
  }
}
const dictionary = new myMap();
dictionary.set('Mark', 'mark@gmail.com');
dictionary.set('Ivy', 'ivy@gmail.com');
dictionary.set('Mary', 'mary@gmail.com');
console.log(dictionary.values());

// 但是
// ES5 Object key 一定要是 String
// 這在使用上多了一些限制，你可能要寫很多額外程式去處理功能需求。就算 ES6 的 Object key type 不只 String，但 key 還是必須是 simple types。不然你試試 obj 當 key 看看 ~~
// 而 Map 前一章有提過 key 值可以接受任何 type

// Objects 抓值效率比較差
// 可以看連結 Object.keys 效率並沒有很好，但你若用 for in 去抓值，可能會抓到父層的值 (當然你可以用 es6 for of 啦 js 夠熟悉 )

// Object 裡的元素是沒有順序性的
var myObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(myObj)); // console: ['2', '7', '100']

var myMap = new Map([
  [100, 'a'],
  [2, 'b'],
  [7, 'c'],
]);
myMap.keys(); // {100, 2, 7}

// Map instanceof Object，但 Object 並沒有 instanceof Map
var map = new Map([
  [1, 2],
  [3, 4],
]);
console.log(map instanceof Object); //true

var obj = new Object();
console.log(obj instanceof Map); //false

// 看來 Map 似乎都比 Object 好，那我們就可以不用 Object ? No No No

// 適合用 Object 時機
// Object 是最基礎也最重要概念，貫穿整個 javaScript。當我們只需要儲存一些簡單的資料，並且確定 Key 值是 simple type (String、Number、Symbol...)。那用 Object 會快很多 (你用 Map 還是要 new Map() 出來沒別的方法。而 literal 建立比 constructor 快多了)
// 如果你想要寫類似下面程式碼

var obj = {
  id: 1,
  name: "It's Me!",
  print: function () {
    return `Object Id: ${this.id}, with Name: ${this.name}`;
  },
};
console.log(obj.print()); //Object Id: 1, with Name: It's Me.

// 如果你要處裡 JSON，因為 JSON 跟 Object 之間很容易轉換

// 適合用 Map 時機
// key 或 value 需要順序時候 (像 LeetCode # 1122 Relative Sort Array(https://hannahpun.gitbook.io/leetcode-note/set-map/1122-relative-sort-array) 就有善用到 Map 順序性)
// key 需要不同型別時
// 找東西時，Map 比 Object 還快

// [LeetCode #1] Map

// 1. Two Sum => https://leetcode.com/problems/two-sum/

/*
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:

Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1]
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

var twoSum = function (nums, target) {};

// Answer
var twoSum = function (nums, target) {
  const m = new Map();
  let result;
  nums.forEach((item, index) => {
    let indValue = target - item;
    if (m.has(indValue)) {
      result = [m.get(indValue), index];
    }
    m.set(item, index);
  });
  return result;
};
