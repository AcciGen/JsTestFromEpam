# Loops

## Tasks

### String of numbers

The function has three arguments. The first is the minimum value, the second is the maximum value, the third step
Return a string of numbers separated by a space.
For example:

```js
createString(0, 20, 5); // result 0 5 10 15 20
createString(0, 21, 4); // result 0 4 8 12 16 20
```

### Range sum1

 write a function which returns the sum of following series upto nth term(parameter).
For example:

```js
rangeSum1(0, 3); // result: 10 (0+1+2+3+0+1+2+0+1+0)
rangeSum1(1, 4); // result: 20 (1+2+3+4+1+2+3+1+2+1)
```

### Range sum2

Create a JavaScript function to get a sum of all numbers in the given range.

For example:

```js
rangeSum2(5, 10); // result: 45 (5+6+7+8+9+10)
rangeSum2(0, 6); // result: 21 (0+1+2+3+4+5+6)
```

### Series Sum

Write a function which returns the sum of following series upto nth term(parameter).
Series: 1 + 1/4 + 1/9 + 1/16 + 1/25 + 1/36 +...

You need to round the answer to 2 decimal places and return it as String.

For example:

```js
seriesSum(1) // result:  "1.00"
seriesSum(5); // result:  (5 --> 1 + 1/4 + 1/9 + 1/16 + 1/25 --> "1.46")
seriesSum(0) // result:  "0.00"
```

### Number of digits

Create a function to calculate count the number of digits

For example:

```js
countDigits(123654789) // result:  9
countDigits(252525); // result:  6
countDigits(0) // result:  1
```


Write your code in `src/index.js.
_All test cases are designed as “error-free”, so don't worry about handling any errors._

## Prepare and test

1. Install [Node.js](https://nodejs.org/en/download/)   
2. Fork this repository: operators-and-operands
3. Clone your newly created repo: https://gitlab.com/<%your_gitlab_username%>/operators-controls-loops/  
4. Go to folder `operators-and-operands`  
5. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)  
6. Run `npm run test:dev` in the command line  
7. You will see the number of passing and failing tests

## Submit to AutoCode
1. Select your task (Loops and iterations)
2. Press the `Check task` button and enjoy, results will be available in few minutes

### Notes
1. We recommend you to use nodejs of version 14 or lower. If you using are any of the features which are not supported by v18, the score won't be submitted.
2. Each of your test case is limited to 30 sec.

