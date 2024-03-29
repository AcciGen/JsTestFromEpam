# Control flow 

## Tasks

### Min
Your code must return min between 3 numbers
For example:
```js
getMin(5, 9, 7) // result: 5
getMin(5, 0, -7) // result: -7
```

### Even Odd checker
Your code should return "even" if all of the numbers are even, and "odd" if all of the numbers are odd. In other cases, return "even/odd". You have 3 numbers to compare.
For example:
```js
evenOrOdd(1, 3, 11); // result: odd
evenOrOdd(2, 4, 8); // result: even
evenOrOdd(2, 5, 8); // result: even/odd
```

### Range
Your code should return "In range" if the number is between number x and number y. otherwise, it should return "Out of range"

For example:
```js
inOrOutRange(5, 10, 8); // result: In range
inOrOutRange(0, 6, 11); // result: Out of range
```

Write your code in `src/index.js.
*All test cases are designed as “error-free”, so don't worry about handling any errors.*

## Prepare and test
1. Install [Node.js](https://nodejs.org/en/download/)   
2. Fork this repository: control-flow
3. Clone your newly created repo: https://gitlab.com/<%your_gitlab_username%>/control-flow/  
4. Go to folder `control-flow`  
5. To install all dependencies use [`npm install`](https://docs.npmjs.com/cli/install)  
6. Run `npm run test:dev` in the command line    
7. You will see the number of passing and failing tests

## Check the task

1. Add the files in the local repository and stage them for commit (you can use a command line window and the commands shown below, or you can use the git functionality available in your IDE to perform the Add – Commit – Push operations.

git add

2. Commit the files that you have staged in your local repository:

git commit -m "name your commit"

3. Push the changes in your local repository to GitLab:

git push -u origin master

4. After you are done with the task, get back to the LEARN platform, and click on `Submit solution` for Autocode to verify it


### Notes
1. We recommend you to use nodejs of version 14 or lower. If you using are any of the features which are not supported by v14, the score won't be submitted.
2. Each of your test case is limited to 30 sec.
