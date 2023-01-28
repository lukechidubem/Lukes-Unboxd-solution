// Problem Solving Solutions

// Funtions used to solve the problems
const add1 = (x) => x + 1;
const minus2 = (x) => x - 2;
const multiplyBy3 = (x) => x * 3;

//============================= 1 =========================

// Here the function takes in 2 arguments, an initial value of x and an array of functions arrOfFns
function pipe(x, arrOfFns) {
  // Here the funtion uses reduce method to apply the result of each function
  // in the array to the previous result starting with the initail value of x which is 5
  return arrOfFns.reduce((acc, fn) => fn(acc), x);
}

console.log(pipe(5, [add1, minus2, multiplyBy3]) == 12);

//============================== 2 ===========================

// The compose function uses the spread operator (...) to accept multiple functions as arguments
function compose(...fns) {
  // It then uses reduce method to apply the result of each spread functions
  // to the previous result starting with the initail value of x
  return (x) => fns.reduce((acc, fn) => fn(acc), x);
}

// The function addMinusMultiply is the composition of the functions passed to compose
// function with 5 as the initial value of x
const addMinusMultiply = compose(add1, minus2, multiplyBy3);
console.log(addMinusMultiply(5) == 12);

//=============================== 3 ============================

// The reverseCompose function uses the spread operator (...) to accept multiple functions as arguments
function reverseCompose(...fns) {
  // It then uses reduceRight method to apply the result of each spread functions
  // to the previous result in reverse order, starting with the initail value of x

  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

// The function addMinusMultiply is the composition of the functions passed to reverseCompose
// function with 5 as the initial value of x
// The is applied to the previouse result reversed that is from multiplyBy3 to minus2 to add1
const multiplyMinusAdd = reverseCompose(add1, minus2, multiplyBy3);
console.log(multiplyMinusAdd(5) == 14);

// run node app.js in the tarminal for result
