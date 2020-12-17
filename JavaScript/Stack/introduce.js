// Stack 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10215118

// 什麼是堆疊（Stack）？
// 堆疊是一種 後進先出 的資料結構。甚麼是後進先出? 以日常生活例子就是疊盤子。先疊的會在下面，後疊的會在上面，當你要拿盤子一定是從最上面拿 (後疊的)。



// 建立堆疊
// 接下來就進入程式了。我們用 js 的 Array 來實作堆疊。需要方法如下

push(ele):  從最頂端加入
pop(): 從最頂端移除
top():  return 最上面的isEmpty()::: return 長度

// push 從最頂端加入
// pop 從最頂端
class Stack {
  constructor(){
    this.list = []
  }
  // 從最頂端加入
  push(ele) {
    this.list.push(ele)
  }
  // 從最頂端移除
  pop(){
    return this.list.pop()
  }
  // 總共堆了幾個元素
  size(){
    return this.list.length;
  }
  // 看最上面是甚麼
  top(){
    return this.list[this.list.length -  1]
  }
  // 通通刪掉
  clear(){
    this.list = []
  }

}
let stack = new Stack()
stack.push('盤子 1')
stack.push('盤子 2')

console.log(stack.size())

// [LeetCode #20] Stack

// Balanced Brackets

/**
 * A bracket is considered to be any one of the following characters:
 * ( )  { }  [ ]
 *
 * Two brackets are a matched pair if the opening bracket occurs to the left
 * of a closing bracket of the exact same type.
 *
 * A matching pair of brackets is not balanced if the enclosing set of brackets
 * are NOT matched.
 *
 * Implement a function called "" that returns a boolean value
 * indicating if the given string has all balanced brackets.
 *
 * Examples:
 * isBalanced("{[()]}") // true
 * isBalanced("{[(])}") // false
 */
console.log( isBalanced("{[()]}") );
console.log( isBalanced("{[(])}") );

function isBalanced(str){
   
}

// Think
// 極限值/特殊狀況
// 再次強調問面試官問題真的很重要。這次經驗面試官也故意預先隱藏一些特殊狀況。我隨便問，他就把這些特殊狀況丟給我了

/**
 * Additional examples and edge cases:
 */
console.log( isBalanced("") ); // true
console.log( isBalanced("]") ); // false
console.log( isBalanced("{{[[(())]]}}") ); // true
console.log( isBalanced("[]{()()[[{}]]}") ); // true
console.log( isBalanced("a b [d] { (g) (h) i [-[ {;} ]-] }") ); // true

// 遇到 { [ ( 就放到 stack 裡

// 遇到 ) ] } 就去抓 stack 看有沒有相對應的 ( [ {
//   若沒有就回傳 false
//   若有就繼續檢查下一個

// 第一次的想法
function isBalanced(str){
  let listArr = str.split('')
  let current;
  let stack = [] //存 stack
  let stackIndex = 0;
  for(let i=0; i<listArr.length; i++){
    // console.log(stack)
    current = str[i]
	  // 若不是 Brackets 就不處理 
    if(current == '{' || current == '[' || current == '('){
      stack[stackIndex] = current; // 存到 stack
      stackIndex ++;
    }else if(current == '}' || current == ']' || current == ')'){
      // 遇到 Brackets 就要去找 stack top 有沒有相對應囉
			// 找到對應記得 pop 掉
      switch(current){
        case '}':
          if(stack[stack.length - 1] !== '{'){
            return false
          }
         
          break;
        case ']':
            if(stack[stack.length - 1] !== '['){
              return false
            }
          break;
        case ')':
            if(stack[stack.length - 1] !== '('){
              return false
            }
          break;
      }
      stack.pop()

    }
  }

// 以上不會過因為 stackIndex 一直在 +1 ，但後面又把值 pop 掉，所以有可能會出現 [undefined, "("] 之類狀況導致錯誤。另外還有一些部分可以改進

// 不需要用 list.split('') 先做處裡，字串可以直接 for loop
// 先 current == '}' || current == ']' || current == ')' 之後再判斷一次 是哪個符號很不必要
// switch 效能其實是比 if 差的

// 改進程式

function isBalanced(str){
  let current, myStack = [];
  for(let i=0; i<str.length; i++){
    // 把 split 拿掉 string 本身就有 length 的屬性
    current = str[i]
    
    if(current === '{' || current === '[' || current === '('){
      // 直接用 array 原生 push 更簡潔
      myStack.push(current)
    }else if(current === '}'){
			// 就得判斷兩次重覆 所以拿掉剩判斷一次就好
      // pop 回傳移掉那個值, 然後會把 stack 最後面移掉
      if(myStack.pop() !== '{'){
        return false
      }
    }else if(current === ']'){
      if(myStack.pop() !== '['){
        return false
      }
    }else if(current === ')'){
      if(myStack.pop() !== '('){
        return false
      }
    }
  }
   return myStack.length === 0;  // [""] true
}

// 是不是簡潔很多呢，而且 Runtime faster than 82.86% 。所以在刷題以前要對資料結構跟語言本身相當了解才行 (例如，我若不知道 array.pop() 回傳的是被移掉那個值，我可能需要多好幾行程式碼去處理，處裡時同時又讓程式效能更差了 )