// let greet: Function

// # example 1

let greet: (a: string, b: string) => void

greet = (name: string, greeting: string) => {
  console.log(`${name} says ${greeting}`);
}

// - example 2
let calc: (a: number, b: number, c: string) => number;

calc = (num1: number, num2: number, action: string) => {
  if(action === 'add') {
    return num1 + num2
  } else {
    return num1 - num2
  }
}

// % example 3
type person = { name: string, age: number };
let logDetails: (obj: person) => void

logDetails = (ninja: person) => {
  console.log(`${ninja.name} is ${ninja.age} years old`);
}
