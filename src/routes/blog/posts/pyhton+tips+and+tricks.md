---
title: Python tips and tricks
description: "With the growing popularity of AI, the probability of you coming across Python code keeps increasing. In this article, we'll explore some tips and tricks to improve your code, help you understand them when you come across them, and get the most out of Python."

date: '2023-5-14'

lastmod: '2024-01-12'

categories:
  - python
  - tips
  - how to

published: true
---

With the growing popularity of AI, the probability of you coming across Python code keeps increasing. In this article, we'll explore some tips and tricks to improve your code, help you understand them when you come across them, and get the most out of Python.

Specifically for beginners, these tips will help you write cleaner, more effective code, also helping you get more done with less. Let's dive in!

### 1\. list comprehension

let's say you want to write a code that let's say returns a list of squares of numbers. the normal way of doing this is:

```python
squares = []
for i in range(1,100):
    squares.append(i*i)
```

but list comprehension makes it easier to generate a new list based on an existing sequence or iterable.

**syntax** &gt; `[expression for item in iterable]`

Here, `expression` is the value to be included in the new list, `item` is the element of the iterable being processed

###### Example

```python
squares = [i*i for i in range(1,100)]
```

### 2\. lambda

lambda allows you to create functions on the fly and allows you to also turn anything into a function. lambda functions are also called `anonymous functions`.

```python
add_ = lambda x, y: x+y
add_(5,7)
```

Lambda functions are often used as a convenient way to define a function in one line of code. Lambda functions can take up any number of arguments but are only limited by only one expression.

Here's an example of using a lambda function with the `map()` function to square each element of a list:

```python
numbers = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, numbers))
print(squares)  # Output: [1, 4, 9, 16, 25]
```

lambda is really really powerful, but you wouldn't appreciate it much if you are just starting out.

### 3\. zip and unzip

you can use zip to combine two or more lists together. Unlike extending a list with other lists, zip creates a tuple, where each tuple contains items from the corresponding indices of the two lists.

```python
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
zipped = zip(names, ages)
list(zipped) # [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
```

zip can also be in for loops

```python
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(name, age)
```

you can also use `*` to reverse do the reverse of zip

```python
zipped = [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
names, ages = zip(*zipped)# <<<<
names # ('Alice', 'Bob', 'Charlie')
ages # (25, 30, 35)
```

### 4\. f-strings

if you want to format a string in python with some other variables, the old way would be

```python
"my names is {}".format(name)
```

But, this method can get really messy. The f-string addresses this issue in a cleaner and easier way.

```python
f"my name is {name}"
```

all you need is to add an `f` at the beginning of the string and use `curly braces {}` to add anything from variables, arithmetics or even function calls

### 5 .join, .get functions

if you have a list of strings and you want to concatenate all of them with a separator in between, it is much easier to use the `.join` method.

```python
names = ['Alice', 'Bob', 'Charlie']
print(''.join(names)) #AliceBobCharlie
print(' '.join(names)) #Alice Bob Charlie
print(','.join(names)) #Alice,Bob,Charlie
print('*'.join(names)) #Alice*Bob*Charlie
```

Additionally, instead of the traditional way of getting a value from a dictionary, it is much more efficient to use the `get` method.

```python
students = {'Alice':'Economics', 'Bob':'Physics', 'Charlie':'Math'}

students['John'] # return KeyError
students.get('John') # return None
```

you can also set a default value, which will be returned instead if the key is not found in the dictionary

```python
students.get('John', 'Not Found') # returns Not Found
```

### Conclusion

These tips will definitely help out a lot, even if you don't use them yourself, you would probably come across them in someone else's code. Hence, makes it easier for you to understand what's happening.

**Happy Coding!**
