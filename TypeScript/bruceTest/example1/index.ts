let a: string = '';

interface odin {
  odin1: number,
  odin2?: string,
  odin3: object
}

// function test (a: number, b?: string, c: object) {
//   console.log(a, b, c)
// }

class Live {
  public roomId: number
  private id: number
  protected name: string

  constructor(roomId: number, id: number, name: string) {
    this.roomId = roomId
    this.id = id
    this.name = name
  }

  start() {
    console.log('Live this.id', this.id)
    console.log('Live this.roomId', this.roomId)
    console.log('Live this.name', this.name)
  }
}

class CarLive extends Live{

  constructor(roomId: number, id: number, name: string) {
    super(roomId, id, name)
  }

  start() {
    // console.log('CarLive this.id', this.id)
    console.log('CarLive this.roomId', this.roomId)
    console.log('CarLive this.name', this.name)
  }
}

const liveInstance = new Live(0, 1, '1')
const carLiveInstance = new CarLive(1, 2, '3')

console.log('liveInstance', liveInstance);
console.log('carLiveInstance', carLiveInstance);

class Live2 {
  // ! #{變數名稱} => 會透過 weekMap 實作出 Javascript 的私有變數
  #name
  constructor(name: string) {
    this.#name = name
  }
}

class Live2Extend extends Live2 {
  constructor(name: string) {
    super(name)
    console.log(name)
  }

  start() {
    // console.log(this.name);
  }
}

const live2Instance = new Live2('odin')
console.log(live2Instance)

// ----------------- 泛型 ---------------------
function print<T> (data: T) {
  console.log('data', data)
}

print<number>(123)
print<string>('123')
print<object>({
  name: 123
})

class Print<T> {
  data: T
  constructor (d: T) {
    this.data = d
  }
}

const numberPrint = new Print<number>(123)
const stringPrint = new Print<string>('123')

console.log('numberPrint', numberPrint);
console.log('stringPrint', stringPrint);

// ----------------- Utility ---------------------

interface CatInfo {
  age: number;
  breed: string;
}
 
type CatName = "miffy" | "boris" | "mordred";
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
 
cats.boris;

// # ------------------- Pick --------------------------

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
 
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
 
todo;

// # ------------------- Omit --------------------------

interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
 
type TodoPreview2 = Omit<Todo, "description">;
 
const todo2: TodoPreview2 = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};
 
todo2;
 
// const todo3: TodoPreview
 
type TodoInfo3 = Omit<Todo, "completed" | "createdAt">;
 
const todoInfo: TodoInfo3 = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};
 
todoInfo;

// * =========== The Net Ninja lecture =====================
// * https://www.youtube.com/watch?v=hcuKd-Q_tP8&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=11
// ^ TypeScript Tutorial #11 - The DOM & Type Casting

// 選取特定的 Dom 元素的時候，可以利用 ! 的方式告知 typescript 目前的值確實存在
// const anchor = document.querySelector('.odin');
const anchor = document.querySelector('.odin')! as HTMLDivElement;


console.log('anchor', anchor)
console.log('anchor classList', anchor.classList)


// * https://www.youtube.com/watch?v=EpOPR03z4Vw&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=14
// ^ TypeScript Tutorial #14 - Modules

// * https://www.youtube.com/watch?v=IOzkOXSz9gE&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=18
// ^ TypeScript Tutorial #18 - Generics

// 同上面泛形的教學

// ? example 1
const addUID = <T extends {name: string}>(obj: T) => {
  let uid = Math.floor(Math.random() * 100);
  return { ...obj, uid }
}

let docOne = addUID({ name: 'yoshi', age: 40 })
console.log('docOne', docOne);

interface Resource<T> {
  uid: number,
  resourceName: string,
  data: T
}

const obj: Resource<string[]> = {
  uid: 1,
  resourceName: 'odin',
  data: ['a']
}

const obj2: Resource<number> = {
  uid: 1,
  resourceName: 'odin',
  data: 810923
}

// * https://www.youtube.com/watch?v=r8G7-hQG07o&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=19
// ^ TypeScript Tutorial #19 - Enums 列舉
// https://medium.com/enjoy-life-enjoy-coding/typescript-%E5%96%84%E7%94%A8-enum-%E6%8F%90%E9%AB%98%E7%A8%8B%E5%BC%8F%E7%9A%84%E5%8F%AF%E8%AE%80%E6%80%A7-%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95-feat-javascript-b20d6bbbfe00

enum ResourceType {
  BOOK,
  AUTHOR,
  FILM,
  DIRECTOR,
  PERSON
}

// 預設的 enum 會帶入 index，以此例來說會 BOOK 會對應到 0，PERSON 會對應到 4

console.log('enum BOOK', ResourceType.BOOK)
console.log('enum PERSON', ResourceType.PERSON)

// 也可以像是用物件一樣的方式，傳入特定相同類型的值，但內部定義是直接賦值的概念

enum StatusCode {
  success = 200,
  error = 400
}

// 可以看到 render 完的 enum 會用一個立即函示包起來，並且傳入我們定義的值，產生出一個物件，但如果用 const 宣告，則不會產生這種物件，但還是可以使用在某個 type 或是 interface 上，只是單純要用物件名稱訪問的方式就會報錯，因為他沒有產生這個物件

const enum OdinDetail {
  name = 'husky',
  age = '30'
}

interface odinObj {
  name: OdinDetail.name,
  age: OdinDetail.age
}

// console.log('OdinDetail', OdinDetail)

// * https://www.youtube.com/watch?v=tHSstkiVbc8&list=PL4cUxeGkcC9gUgr39Q_yD6v-bSyMwKPUI&index=20
// ^ TypeScript Tutorial #20 - Tuples 元組
// https://ithelp.ithome.com.tw/articles/10221546

// - 嚴格限制每個陣列的每個位置應該是什麼類型

//宣告一個元組陣列
let arr:[number,string,boolean];

//賦值，初始化陣列
arr = [10,'hello',true]; 

//初始化陣列錯誤
// arr = [true, 10, 'hello']; //各索引值型別不符，報錯
// arr = [10, 'hello']; //少了第三個元素，報錯
// arr[0]='hi' //，型別限定為數字，報錯

// ! 無法任意調整該陣列中的類型位置