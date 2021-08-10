"use strict";
// let greet: Function
// # example 1
var greet;
greet = function (name, greeting) {
    console.log(name + " says " + greeting);
};
// - example 2
var calc;
calc = function (num1, num2, action) {
    if (action === 'add') {
        return num1 + num2;
    }
    else {
        return num1 - num2;
    }
};
var logDetails;
logDetails = function (ninja) {
    console.log(ninja.name + " is " + ninja.age + " years old");
};
