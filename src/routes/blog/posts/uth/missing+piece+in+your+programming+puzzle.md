---
title: 'The Missing Piece in Your Programming Puzzle'

description: 'When we face a challenge or are approached with a problem as a novice, what most of us do first is jump onto our computer to spit out some code. However, we might end up in a rigorous trial-and-error situation and be unable to solve the problem to meet the deadline.'

date: '2023-01-02'

lastmod: '2024-01-12'

categories:
  - design pattern
  - problem solving
  - tips

thumbnail: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1672645040163/123b7b16-2c6d-4fa6-a946-9d1029f6e782.png'

published: true
---

Problem-solving is an essential skill not just in software development but in other fields and life in general.

When we face a challenge or are approached with a problem as a novice, what most of us do first is jump onto our computer to spit out some code. However, we might end up in a rigorous trial-and-error situation and be unable to solve the problem to meet the deadline.

Writing code is supposed to be the translation of our solution for the computer to solve subsequent problems and the last step in our problem-solving.

The process of solving a problem involves a series of steps. Thus, solution planning tools help to:

- Plan out steps involved in the solution
- Organise tasks
- Figure out the best approach to the problem
- And carry along both technical and non-technical people on the team or clients.

The three solution planning tools we will be looking at are:

- Problem Analysis Chart (PAC)
- Pseudocode
- Algorithms

### Problem Analysis Chart

The problem analysis chart (**PAC**) helps break a solution into 4 categories.

- Required input
- Required processing
- Required Result
- Alternative processing

If this category is properly filled, it gives a clear picture of what input we need and exactly what result we want to achieve. Thus, saves tons of time and filters unnecessary inputs and steps to achieve the required result.

**Imagine** a problem where we want to write an algorithm that sums up two numbers.

A PAC chart for such will look like this ⬇

| Required input          | Required Result        |
| ----------------------- | ---------------------- |
| num1, num2              | The sum of both inputs |
| **Required processing** | **Alternatives**       |
| num1+num2               |                        |

The PAC of this problem looks really simple and feels unnecessary, but for more complex problems you will be solving in the future, you find the PAC super helpful for you and other team members.

### Pseudocode

Pseudocode is a high-level description of a solution, and it is mostly written independently of a programming language.

A Pseudocode code explains in a series of steps and little details how a program should work or how the algorithm should be written.

**For example**

We need to write a program that calculates the sum of the first hundred even numbers, a pseudocode for such will go as follows:

- Declare three variables sum, iterations, evenNumber and set all of them to zero
- Use a while loop with the condition to check whether or not we've reached a 100 iterations
- Add 2 to evenNumber variable
- Add the evenNumber to the sum
- Add 1 to the iteration
- The return sum of the condition is no longer true.

The above solution might appear to have a lot of details, and that is reasonable considering the small size of the problem.

The ultimate goal of Pseudocode is to break down the program for easier understanding of both technical and non-technical persons on the team.

### Algorithms

Algorithms are finite series of steps to solve a problem.

In this case of solution planning, we will not be looking at the bigger and more complex side of algorithms, but rather algorithms as a series of steps we will need to arrive at our desired result.

We can also see algorithms in this context, as a low-level description of our solution which is written to match more closely to a specific programming language.

**For example**

For our previous problem, an algorithm for such will be:

```txt
1. set sum, iterations, evenNumber = 0

2. while (iteration <= 100) then {
	iterations + 1
	evenNumber + 2
	sum + evenNumber
}

3. Print(sum)

4. End
```

That looks pretty close to a programming language, but it not. It a template we can use to rewrite this algorithm in different programming languages.

Writing algorithm comes with a ton of benefits

- Ensure the solution is accurate and feasible
- Makes debugging and flaws in solutions easier to detect
- Creates a model or template to solve subsequent problems with the crafted solution.
- And so much more…

Another useful tool under the algorithm is Desk Checking

**Desk check** is just like testing, but manually directly from our algorithm.

This is most feasible for small programs and less complex algorithms.

In desk checking, you manually insert all the input and also do the processing in your brain to simulate exactly how the computer will interpret and run the program. Thus, helps you see if your algorithm will arrive at the desired result.

### Conclusion

If you are just starting out reading this, these might look ridiculous and unnecessary, but as you advance further and starts to move to a professional setting, it starts to make sense and you will start to go through these process for every problem you are collectively going to solve with your team members.

**Happy coding!**
