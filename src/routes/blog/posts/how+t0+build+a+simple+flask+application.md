---
title: An easier framework to build web apps with python
description: post description
date: '2022-09-10'
categories:
  - python
  - flask

published: true
---

### Introduction

Python as one of the most powerful backend framework, which are very easy to wrap your head around.

most porpular ones are:

- Django
- Flask
- CherryPy

For this tutorial we are going with Flask cause it the most lightweight and most beginner friendly

### Writing your first Hello World in flask

To use flask we need to install it on our machine

Run this on your terminal/cmd

```bash
~$ pip install flask
```

create a new file and call it whatever you want

app.py

```python
from flask import FLask
app = Flask(__name__)
app.run() # parse arguments ip,
# port if you want to specify
```

execute the python file

```bash
~$ python app.py
```

you should see an output like this

```bash
* Serving Flask app 'app'
* Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server
instead.
    * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

At this point when we visit the url we se nothing because we have not created any view

### Create views and routes

Edit app.py

```python
from flask import FLask
app = Flask(__name__)

@app.route('/')
def index():
    return "Hello world"

@app.route('/blog'):
def blog():
    return "Hello Readers"

app.run()
```

our app currently now have two routes

- http://127.0.0.1:5000
  \-> this return Hello World to a GET request\* http://127.0.0.1:5000/blog
  \-> this returns Hello Readers to a GET request

### Return HTML as view

We can parse html as a string to return function as a view or parse html file

Example:

```python
from flask import FLask, render_template
app = Flask(__name__)

@app.route('/')
def index():
    return "Hello world"

@app.route('/blog'):
def blog():
    return render_templates('blog.html')

app.run()
```

**Note:** Create a \`templates\` folder in the directory where your app.py lives, flask looks for html files in the templates folder

### Handling Requests

By default, route by default are GET only but we can specify the type of reqeust we want for a route

Example:

```python
from flask import FLask, render_template, request
app = Flask(__name__)

@app.route('/' methods=['GET','POST'])
def index():
    if request.method == 'POST':
        return "Hello world from a POST request"
    return "Hello world from a GET reqeuest"

@app.route('/blog', methods=['POST']):
def blog():
    return render_templates('blog.html')

app.run()
```
