---
title: How to build mobile apps with Python
description: `frameworks are not fully optimized to build a production ready applications.

Nevertheless, we are going to checkout kivy in this tutorial to build and deploy a simple mobile app.
`
date: '2022-09-13'

lastmod: '2024-01-12'

categories:
  - python
  - kivy

published: true
---

### #Introduction

When we talk python, we don't normally include building mobile apps, this is because these python frameworks are not fully optimized to build a production ready applications.

Nevertheless, we are going to checkout kivy in this tutorial to build and deploy a simple mobile app.

### #Prerequsite

- Have a little understanding of OOP(Object Oriented Programming)
- Apps are not production ready

### #Installing

To use kivy we need to get it on our machine

**run**

```bash
$ pip install kivy
```

### #Create a simple hello world app

```python
from kivy.app import App
from kivy.uix.label import Label

class MainApp(App):
    def build(self):
        return Label(text='Hello World')

if __name__ == '__main__':
    MainApp().run()
```

- The imports are straight forward and clear
- In our class, it inherits from the `App` class we imported.
- In the `build` function we return the object that would takeup our window

in our case an Hello World label

### #Taking it further

We definitly don't want just a label or button on our app, this is where layouts comes in and we are going to build an app that takes a person name as an input and Greets Them when they press the `Greet` button.

### #Layouts, Inputs and Buttons

There are fundamentally two types of layout

- Vertical
- Horizontal

Grids and others are derived from those.

We are going to use kivy's `BoxLayout` to create a vertical and horizontal layout

```python
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput

class Great(BoxLayout):
    def __init__(self):
        super().__init__()
        self.orientation = 'vertical'

        self.greet_label = Label(text='Greet')
        self.user_name = TextInput()
        self.greet_button = Button(text='Greet')

        # adds the widgets to our BoxLayout
        self.add_widget(self.greet_label)
        self.add_widget(self.user_name)
        self.add_widget(self.greet_button)

class MainApp(App):
    def build(self):
        return Great()

if __name__ == '__main__':
    MainApp().run()
```

### #Taking the code apart

- The imports are straight forward and clear
- We now have a new class which inherit from `BoxLayout`  
  we used super to call the init from the inherited function.  
  we set the orientation to vertical cause by `BoxLayout` is horizontal by defualt.
- created new components and added them to our `BoxLayout`
- the `build` function now returns the `Greet` class

### #The Functions

What left for our app is to greet the user whenever it enters it name and press the greet button.

```python
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput


class Great(BoxLayout):
    def __init__(self):
        super().__init__()
        self.orientation = 'vertical'
        self.greet_label = Label(text='Greet')
        # setting a custom font size for the greet label

        self.greet_label.font_size = 40
        self.user_name = TextInput()
        self.greet_button = Button(text='Greet')
        self.greet_button.on_press = self.great_user
        self.add_widget(self.greet_label)
        self.add_widget(self.user_name)
        self.add_widget(self.greet_button)

    def great_user(self):
        """This function get the name from the textinput
        and set the text of the greet_label to a message for the user
        """
        # get the text from self.user_name
        user_name = self.user_name.text

        # set the text for the label
        self.greet_label.text = f"Hello {user_name}"

        # clear the self.user_name text input

        self.user_name.text = ''


class MainApp(App):
    def build(self):
        return Great()


if __name__ == '__main__':
    MainApp().run()
```

### Compile

kivy apps are compiled using buildozer

See buildozer documentation
