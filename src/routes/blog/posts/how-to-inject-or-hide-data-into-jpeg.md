---
title: 'Hacking 101: How to Inject or hide data Into JPEG Images'

description: 'In this tutorial, we will learn using Python as our programming language, how we can hide data in JPEG images, and also, how you can read the data you stored in the image.'

date: '2024-02-24'

lastmod: '2024-02-24'

categories:
  - python

  - hacking

visual: false

published: true
---

Trojan horses have been one of the most effective way to get payloads on a target’s device, If you don’t know what a Trojan horse is — The Idea behind It Is that you hide payload behind what the target finds legitimate.

Recently I discovered a cool stuff about JPEG images, and figured we could attach additional Information or store data Inside of the JPEG, without distorting the Image.

In this tutorial, we will learn using Python as our programming language, how we can hide data in JPEG images, and also, how you can read the data you stored in the image.

> Disclaimer: This tutorial has nothing to do with creating Trojan horses.

## What is FFD9;

FFD9 or in `x0FFx0D9` Is one of the many markers in JPEG images that marks _end of the image._ Other markers includes `FFD8` for the start of the image, `FFFE` for a comment and soo much more. you can look up all available markers on the [wikipedia page](https://en.wikipedia.org/wiki/JPEG#Syntax_and_structure).

We will be taking advantage of end marker I.e FFD9, and add whatever we want behind it, anything from other images, videos, audios, executables, any bit of data you can think of.

First, let try adding an hello world to an Image, I will be using this example image (I promise it not bugged 😀, you can trust me 🙂) for this demo. It safe to download.

![Naruto and his teacher jiraiya share a stick sweet. Abdulmumin yaqeen](https://paper-attachments.dropboxusercontent.com/s_EA202B613A1B366F3BBE06A9229C822665469C9FB6A5409DBB17EDEEBCBD6156_1708366286608_image.jpg)

### Create a new python file.

`app.py`

```python
def inject(image, data):
    image_file = open(image, 'ab')
    image_file.write(data)
    image_file.close()
```

What we have here is a very simple function, that takes the image and the data we want to append to the JPEG. Very straight forward stuff; we opened the Image in `ab` mode, appending bytes mode.

### Adding hello world;

We can call our function and add:

```python
inject('demo.jpg', b'Hello world')
```

That’s it! Hello world now in our image, and if you’re to reopen your image, no damage has been made to it. Also not we’re adding a `byte sequence` instead of a string.

> **Good to know**: In Python when you see a string preceded by a **b**, such as **b'Hello world'**, it signifies that the string is represented as a sequence of bytes rather than a sequence of characters.

You might be thinking, “It that simple”! Well, Yes! Writing the data is quite a piece of cake, but, we will do a little more to get our data out of the Image.

### Reading our stored data;

In other to write a function that will return our stored data, This is where `FFD9` is going to come to play.

- We will read to Image to locate the position of `FFD9`
- Then, seek to that index (Place our cursor in the location, so our reading of the image will start from there.)

Here is what the function will look like:

```python
def get_end_flag(image):
  image_file = open(image, 'rb')
  content = image_file.read()
  end_flag_index = content.indexof(bytes.fromhex('FFD9'))
  end_flag_offset = end_flag_index+2
  image_file.close()
  return end_flag_offset
```

The reason we’re adding 2 (two) is to skip past the marker to read the next section of the data. In this case, adding 2 to `end_flag_index` would position our pointer just after the `FFD9` marker, ready to process the next part of the data.

Our function to read the data will look like this:

```python
def read_injected_data(image):
  image_file = open(image, 'rb')
  image_file.seek(get_end_flag(image))
  data = image_file.read()
  image_file.close()
  return data
```

Yahoo! we’re are done with the program, Let start by reading our hello world we Initially added.

```python
data = read_injected_data(image)
print(data)
```

There you have: our Hello World and Image, both clean and Intact.

![Abdulmumin yaqeen naruto yaqeen.me blog](https://paper-attachments.dropboxusercontent.com/s_EA202B613A1B366F3BBE06A9229C822665469C9FB6A5409DBB17EDEEBCBD6156_1708783901971_Screenshot+from+2024-02-24+15-10-05.png)

### A Problem 🤨;

We got a problem, you see, In other of add more data to this image, we will first need to get rid of what ever we’ve added initially.

We can write a function to do this:

```python
def clear_injected(image):
  image_file = open(image, 'rb')
  old_content = image_file.read()
  new_content = old_content[:get_end_flag(image)]
  with open(image, 'wb') as new_image:
    new_image.write(new_content)
  image.close()
```

This function basically the original content of the Image, I.e the content from the beginning to the end flag, then rewrites it to the same file. So everything after the End Of Image flag (EOI) is lost.

We can test our function again and everything we’ve appended to the Image vanishes 🪄

```python
clear_injected('image.jpg')
```

Optionally, you can call `clear_injected` inside of the `inject` function, so it clears anything added to the Image, before appending any other thing.

```python
def inject(image, data):
  clear_injected(image)
  ## rest of function
```

### Injecting media files;

As said earlier, Let see how we can Inject media files to our Image.
Since everything we’re write is a byte sequence, we can just read any file in bytes mode and inject that to our Image.

This will look something like this:

```python
with open('somevid.mp4', 'rb') as media:
  inject('image.jpg', media.read())
```

You can see that after appending the video into the image, the size have increased:

![Abdulmumin yaqeen naruto yaqeen.me blog](https://paper-attachments.dropboxusercontent.com/s_EA202B613A1B366F3BBE06A9229C822665469C9FB6A5409DBB17EDEEBCBD6156_1708784631122_editnow.png)

We can easily fetch our video using:

```python
data = read_injected_data('image.jpg')
with open('injected-video.mp4', 'wb') as file:
    file.write(data)
```

There you have, how you can hide or store data into jpeg images, without sacrificing the anything in the image details, the image works everywhere without a problem. This is a god mode kind of way of hiding stuff in your computer, without ever being noticed, the only catch is that, the larger the data you’re hiding in the image, the larger it size gets.

**Comeback again, Peace** ✌️!
