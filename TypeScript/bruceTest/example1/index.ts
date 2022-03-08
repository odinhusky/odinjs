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
