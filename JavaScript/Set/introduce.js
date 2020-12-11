// Set 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10214228
// https://ithelp.ithome.com.tw/articles/10214361
// https://ithelp.ithome.com.tw/articles/10214541

// 什麼是集合？ => 一組無順序且不重複的元素組成

// 這三個集合是相同的
// {2, 4} , {4, 2}, {2, 4, 4, 2}

// 先用 javaScript Object 模擬 Set!!

// -------------------------------------
// Before add and remove have to check
// the element already exist in current Set
// -------------------------------------
class MySet {
  constructor() {
    this.items = {};
  }
  // 新增
  add(value) {
    if (!this.has(value)) {
      this.items[value] = value;
    }
  }
  // 刪除
  delete(value) {
    if (this.has(value)) {
      delete this.items[value];
      return true;
    }
    return false;
  }
  // 判斷元素存不存在
  has(value) {
    return this.items.hasOwnProperty(value);
  }
  // 清掉集合所有元素
  clear() {
    this.items = {};
  }
  // 此集合裡有幾個元素
  size() {
    return Object.keys(this.items).length;
  }
  // 印出所有集合元素
  // print all values
  values() {
    return Object.values(this.items);
  }
}

let instruments = new MySet();

instruments.add('piano');
instruments.has('guitar');
instruments.add('guitar');
instruments.add('drum');
instruments.delete('guitar');
newSet.size(); // 2
newSet.values(); //['piano', 'drum']

// 以下是 ES6 原生寫法

// ES6 Set
let instruments = new Set();

instruments.add('piano');
instruments.has('guitar'); // false
instruments.add('drum');
instruments.delete('guitar'); // 裡面根本沒有 guitar 所以回傳 false
instruments.size; // 2
[...instruments]; //['piano', 'drum']

// or use Array.from,
Array.from(instruments);

// 當然你要一開始就把值存進去也可以

// ES6 Set
let instruments = new Set(['piano', 'guitar', 'drum']); // 記得是 Array 格式

instruments.has('guitar'); // true
instruments.add('drum'); // 是不會加進去的喔
instruments.delete('guitar');
instruments.size; // 2
[...instruments2]; //['piano', 'drum']

// 知道集合的基本方法後，就可以開始來操作集合了!!

// 1. Union 聯集 => 給兩個集合，回傳一個包含兩個集合中元素的新集合

const union = (firstSet, otherSet) => {
  // store union, use es6 Spread syntax
  return new Set([...firstSet, ...otherSet]);
};

// 範例一
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4, 5, 6]);
union(a, b); // 1, 2, 3, 4, 5, 6

// 範例二
let c = new Set();
c.add(1);
c.add(2);
c.add(3);
let d = new Set([1, 2, 3]);
union(a, b); // {1, 2, 3, 4, 5, 6}

// 2. Intersection 交集 => 給兩個集合，回傳兩個集合中共同有的元素

const intersection = (firstSet, otherSet) => {
  // store intersectionSet
  let intersectionSet = new Set();
  firstSet.forEach((i) => {
    if (otherSet.has(i) == true) {
      intersectionSet.add(i);
    }
  });
  // get the same value
  return intersectionSet;
};
// 範例
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4, 5, 6]);
intersection(a, b); // {2, 3}

// 3. Symmetric Difference 對稱差 => 給定兩集合，回傳兩個集合的元素但不包含重覆元素

// 運用 union 跟 intersection 達成對稱差
const difference = (firstSet, otherSet) => {
  // store union
  let differenceSet = union(firstSet, otherSet);
  let intersectionSet = intersection(firstSet, otherSet);
  differenceSet.forEach((i) => {
    if (intersectionSet.has(i) == true) {
      differenceSet.delete(i);
    }
  });

  return differenceSet;
};
// 範例
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4, 5, 6]);
difference(a, b); // {1, 4, 5, 6}

// 4. Subtraction 差集 => 給定兩集合，回傳一個包含存在第一個集合元素但不存在於第二集合的集合

const subtracting = (firstSet, otherSet) => {
  let subtractingSet = new Set([...firstSet]);
  otherSet.forEach((i) => {
    if (subtractingSet.has(i) == true) {
      subtractingSet.delete(i);
    }
  });
  return subtractingSet;
};

// 範例
let a = new Set([1, 2, 3]);
let b = new Set([2, 3, 4, 5, 6]);
console.log(subtracting(a, b)); // {1}

// 內建方法 => 參考圖片 compare-array-and-set-manipulations.png
// 初始值，以下範例都會共用這個
let arr = [1, 2, 3]
let map = new Map([1, 2, 3])

// 時間複雜度
// Array Time Complexities => 參考圖片 time-complication.png

// push、pop 都是直接在最後一個元素做增減，所以時間複雜度是 Big O(1);
// 而 unshift、shift、splice、slice 基本上都會動到本來的元素的指引位置(index)，所以是 Big O(n)。

// 什麼叫做會動到本來元素指引位置？
// 以 unshft() 為例，因為他要把原本元素都往後移一個位置然後把新元素插入最前面，所以時間複雜度是 Big O(n)

arr = [1, 2, 3] // 本來的 Array
arr.unshift(3); //[3,1,2,3]

// -- 以上是怎麼運作的呢
[1, 2, 3]
 0  1  2  // 這邊是 index 指引位置
 
[3, 1, 2, 3]  // 所有本來在 Array 裡元素都往後一格 index +1
 0  1  2  3

//  參考圖片 set-time-complexities.png

// Data Structure
// Array 是 indexed collection 而 Set 是 keyed collection

// “Indexed collections” are collections of data which are ordered by an index value

// “Keyed collections” are collections which use keys; these contain elements which are iterable in the order of insertion.

// 結論
// Set 並不能取代 Array。Set 的優勢就是 value 不能是重覆的，所以可以減少記憶體存取重覆值的浪費。另外尋找跟新增/刪除元素平均的時間複雜度都比 Array 好。
// Array 的優勢因為資料是連續的，所以存取非常快速 O(1)，需要順序姓的問題用 Array 來解就很適合(例如 Binary Search)。並且他提供非常多內建方法可以使用（map、reduce、filter...等）




// [LeetCode #217, #804] Set

// 217. Contains Duplicate
// https://leetcode.com/problems/contains-duplicate/

/*javascript
Given an array of integers, find if the array contains any duplicates.

Your function should return true if any value appears at least twice in the array, and it should return false if every element is distinct.

Example 1:

Input: [1,2,3,1]
Output: true
Example 2:

Input: [1,2,3,4]
Output: false
Example 3:

Input: [1,1,1,3,3,4,3,2,4,2]
Output: true
*/

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  
};

// 解答
var containsDuplicate = function(nums) {
  return new Set(nums).size < nums.length;
};

// 804. Unique Morse Code Words
// https://leetcode.com/problems/unique-morse-code-words/

/*
International Morse Code defines a standard encoding 
where each letter is mapped to a series of dots and dashes, 
as follows: "a" maps to ".-", "b" maps to "-...", "c" maps to "-.-.", and so on.

For convenience, the full table for the 26 letters of the English alphabet is given below:

[".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]
Now, given a list of words, each word can be written as a concatenation of the Morse code of each letter. 
For example, "cba" can be written as "-.-..--...", (which is the concatenation "-.-." + "-..." + ".-").
We'll call such a concatenation, the transformation of a word.

Return the number of different transformations among all words we have.

Example:
Input: words = ["gin", "zen", "gig", "msg"]
Output: 2
Explanation: 
The transformation of each word is:
"gin" -> "--...-."
"zen" -> "--...-."
"gig" -> "--...--."
"msg" -> "--...--."

There are 2 different transformations, "--...-." and "--...--.".
Note:

The length of words will be at most 100.
Each words[i] will have length in range [1, 12].
words[i] will only consist of lowercase letters.
*/

/**
 * @param {string[]} words
 * @return {number}
 */
var uniqueMorseRepresentations = function(words) {
  
};

// 作者解答

// Think
//  哪種資料結構解
//  前面會用 Array method，然後也利用 Set 回傳不重覆值的 size
// 大概會怎麼解
//  先把英文數字轉成 a = 0, b = 1,... z = 26，這樣到時候才能抓摩斯密碼（想到用 charCodeAt ）
//  看每一個 words (ex. "gin")
//  再看每一個 word (ex. g, i, n)
//  轉成摩斯密碼後合併起來

let mos = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."];
let getIndex = char => char.charCodeAt(0) - "a".charCodeAt(0)
var uniqueMorseRepresentations = function(words) {
   // ["gin", "zen", "gig", "msg"]
  let transform = words.map( word =>{
      // ["gin"]
      return word.split('')   // // ["g", "i", "n"]
          .map( char => {
            // ["g"]
            return mos[getIndex(char)]
          })
          .join('')
  })
  return new Set([...transform]).size;
};

// 另一個 runtime 更快的解答

const morseCode = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',  J: '.---',  K: '-.-',  L: '.-..', M: '--',
  N: '-.',  O: '---', P: '.--.',  Q: '--.-',  R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',  Y: '-.--', Z: '--..', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----', ' ': ' '
}

const uniqueMorseRepresentations = words => {
  return new Set(words.map(word => word.split('').map(letter => alphabet[letter]).join(''))).size;
}

const morseCode = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',  J: '.---',  K: '-.-',  L: '.-..', M: '--',
  N: '-.',  O: '---', P: '.--.',  Q: '--.-',  R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',  Y: '-.--', Z: '--..', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----', ' ': ' '
}

const translateToMorse = string => {
  return string.toUpperCase().split('').map(letter => morseCode[letter]).join('/');
}

const translateToAlphabets = code => {
  const morseReverseObject = {};
  Object.keys(morseCode).forEach(key => {
    morseReverseObject[morseCode[key]] = key;
  })

  return code.split('/').map(letter => morseReverseObject[letter]).join('');
}


