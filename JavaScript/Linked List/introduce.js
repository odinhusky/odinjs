// Linked List 基礎介紹文章

// 參考文章
// https://ithelp.ithome.com.tw/articles/10216257
// https://ithelp.ithome.com.tw/articles/10216443

// 今天要介紹一個對我而言非常陌生的資料結構 Linked List。它不像 Array 在 javaScript 有內建的方法，所以弄懂它真的花了非常多功夫。

// Linked List?

// 不必以連續空間來儲存串列中的元素。由多個節點 (node) 所組成，而每個 node 至少包含資料 (ele) 欄及連結欄位 (next)，透過某個 node 的連結欄位可以取得下一個 node

// 想知道更精確解釋可以看維基百科 => https://zh.wikipedia.org/wiki/%E9%93%BE%E8%A1%A8

// Linked List 是一個方便動態增加與刪除的 data structure，也不像 Array 資料是連續的。每個元素(Linked List 裡叫節點 Node ) 都只存在自己的值、跟指向下一個的指標

class LinkedListNode {
  constructor(ele) {
    this.next = null; // 指向下一個
    this.ele = ele; // 自己
  }
}

// 生活中的例子就是火車，Node 就像是火車的車廂。
// Linked List 常常拿來跟 Array 做比較。我整理了一個表格如下 (參考圖片 3)

// 看到這裡應該稍微對 Linked List 有基本認識了，接下來就來介紹它的特性方法

// 建立 Linked List
// javaScript 並沒有內建 linked list，所以我們只好用物件來來模擬。
// 首先會建立兩個東西，一個是 Node(火車的個別車廂)，一個是 List(火車)

// Node 的屬性有
// ele (資料)
// next (指向下一個 node)
// List 的屬性有
// head: 最前面的 node 是誰
// length: 總共有幾個

class LinkedListNode {
  constructor(ele) {
    this.next = null;
    this.ele = ele;
  }
}
class LinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }
  // method here
  // ....
}

// Linked List 方法
// 下列就是我們要建立的方法

// append(ele):  從尾部增加一個 node
// insert(position, ele): 從特定位置增加一個 node
// removeAt(position): 刪除特定位置的 node
// remove (ele): 移除某個 node
// indexOf(ele):  回傳此 node 是否存在，不存在回傳 -1
// toString(): 把 List 物件內容轉換成字串
// size(): 回傳總共有幾個 node 在 list 內


// 1. append(ele)
// 從尾部增加元素 (node)，尾部新增元素會有兩種可能

// List 裡完全沒 node 所以會被增加到第一個， head 也會指到 newNode (head = newNode)
// List 裡已經有其他 node，所以先 while loop 找到最後一個再 current.next = newNode ，怎麼知道哪一個是最後一個? node.next = null 就是最後一個

append(ele){
	let newNode = new LinkedListNode(ele);

	// 判斷 nodelist 是不是空的
	if(this.head == null){
		// 1. 是空的
		this.head = newNode
	}else{
		// 2. 不是空的
		// loop nodelist 到最後一個然後加進去 
        // 最後一個就是 current.next == null
		let current = this.head;
		while(current.next != null){
			current = current.next
		}
        current.next = newNode 
	}
	this.length ++;
}

// 2. insert(position, ele)
// 在特定位置(position) 插入 node，也是有兩種可能

// 插入最前面。也就是當 position = 0 時
// 其他。while loop 找到 position 位置，把本來的 node (current) 替換成要插入的 node(newNode) ，然後 newNode.next 指向本來的 node(current)

insert (position, ele){
	// 判斷極限值
	if(position > -1 && position <= this.length){
	  let newNode = new LinkedListNode(ele)
	  let current = this.head;
      
	  // 1.1 判斷是否為 head
	  if(position == 0){
		newNode.next = current;
	    this.head = newNode;
		}else{
			// 1.2 loop current = previous  找到 position = index
            let previous;
            let index = 0;
            while(index != position){
                index ++;
                previous = current;
                current = current.next;
            }
	    newNode.next = current;
	    previous.next = newNode;
	  }
	  this.length ++;
	  return true;
	}else{
        return false;
	}
}

{
}

{
}

{
}

{
	let current = this.head
	let string = ''
	while(current){
        string += current.ele
		current = current.next
	}
	return string
}

// 7. size()
// 回傳長度

size(){
	return this.length;
}

// Double linked list
// node 多了一個 prev，而 list 也多一個 tail。可以避免一般 Linked List 只能從前面循序存。

class LinkedListNode{
	constructor(ele){
		this.next = null;
		this.prev = null;
		this.ele = ele
	}
}
class LinkedList {
	constructor(){
		this.head = null
		this.tail = null
		this.length = 0
	}
	methodHere(){}
}

// Double linked list 方法就不再文章一一列出來了。大家有興趣也可以參考 DS with JS — Linked Lists — II

// 坦白說我不知道前端哪邊會用到 Linked List XD (假如知道的人可以跟我說)。但特性比起 Array 的確大大減少浪費記憶體的狀況。模擬 Linked List 時也順便訓練自己的思考模式，因為它幾乎每種方法都有兩個以上可能，不像前幾天的資料結構這麼單純。


// [LeetCode #206] Linked List

// 206. Reverse Linked List

// Question:
// Reverse a singly linked list.

// Example:
Input: 1->2->3->4->5->NULL
Output: 5->4->3->2->1->NULL

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {

}

// 參考圖片8

// Think
// 極限值/特殊狀況
// Linked List 裡面沒有 node
// 只有一個 node (所以反轉後還是它自己)

// 處理極端值
// linked list 裡面沒東西
if(!head){
  return null
}
// 只有一個值所以反轉之後還是他自己
if(!head.next){
  return head;
}

// 哪種資料結構解
// Linked List (範例都給你 ListNode 了)
// 大概會怎麼解
// 主要就是反轉指標，本來是 prev 的變成 next。

// 首先會定義三個東西
// cur: 初始值 = head，然後判斷完會往下一個 node 移動 cur = cur.next
// temp: 暫存 cur
// prev: 初始值 = null，這個用來反轉指標

let prev = null,
cur = head,
temp;

// 參考圖片9

temp = cur;   // 用 temp 來存目前的 node，不然會被後面的操作影響
cur = cur.next;   // 目前的 node 指標先往下

// 將 next 指向先前的值
temp.next = prev; 

// prev 變成先前的值
prev = temp;

// 然後一直重覆以上步驟，直到結束 (current.next == null 代表結束了)

var reverseList = function(head) {
  // 極端值
  // linked list 裡面沒東西
  if(!head){
      return null
  }
  // 只有一個值所以反轉之後還是他自己
  if(!head.next){
      return head;
  }

  let prev = null,
  cur = head,
  temp;
  
  while(cur != null){
      temp = cur;   // 用 temp 來存目前的 node，不然會被後面的操作影響
      cur = cur.next;   // 目前的 node 指標先往下

      // 將 next 指向先前的值
      temp.next = prev; 

      // prev 變成先前的值
      prev = temp;
  }

  return prev;

};
