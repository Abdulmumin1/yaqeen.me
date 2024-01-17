---

title: 'Goodbye Ugly Scrollbars'

description: "At some point, I noticed the chromium scrollbar more than ever. Everyone maybe does, or is it just me?

I guess not!"

date: '2023-12-27'

lastmod: '2024-01-12'

categories:

- chrome
- extension
- js

thumbnail: "https://cdn.hashnode.com/res/hashnode/image/upload/v1703704767703/f10479c5-a422-4b08-897f-57ff35b98bc2.png"

published: true

---

At some point, I begin to notice the ugly and super orthodox scrollbars of the Chromium-based browsers more than ever. Everyone maybe does, or is it just me?

I guess not!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703694840260/cf0473c9-be0c-4557-b138-e478810f59d3.png)

and ...

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703696023314/549d0914-6d85-4c7a-90c3-7e056ae35486.png)

then 😂

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703695940441/d119f5c2-ec26-438e-b73f-c36b02c9b699.png)

It breaks our amazing designs so many times, that we sometimes customize it, if it happens to be a side project of ours, otherwise, we just ignore it.

Also, accessibility is another reason to keep it. But it doesn't have to be as ugly 🤢.

In this article, We're going to go through scrollbars and their properties that we can edit/customize. I'm also going to Introduce SleekScroll, which is a Chrome extension that gives you the ability to customize your browser scrollbar look.

## Scrollbars

Scrollbars can be styled and customized using CSS properties, although the level of customization varies across different browsers and their versions. Here are some of the properties that can be edited or styled for scrollbars:

1. **Scrollbar Width and Height:**

   - `width` and `height` properties to adjust the size of the scrollbar.

2. **Scrollbar Colors:**

   - `scrollbar-color` or `-webkit-scrollbar-color` to set the color of the scrollbar thumb (not widely supported).

3. **Scrollbar Track and Thumb:**

   - `scrollbar-track-color` or `-webkit-scrollbar-track-color` to set the color of the scrollbar track.
   - `scrollbar-thumb-color` or `-webkit-scrollbar-thumb-color` to set the color of the scrollbar thumb.

4. **Scrollbar Corner:**

   - `scrollbar-corner` or `-webkit-scrollbar-corner` to set the color of the scrollbar corner (where horizontal and vertical bars meet).

5. **Scrollbar Shadow:**

   - `scrollbar-shadow-color` or `-webkit-scrollbar-shadow-color` to set the color of the scrollbar shadow.

6. **Scrollbar Borders:**

   - `scrollbar-width` or `-webkit-scrollbar-width` to set the width of the scrollbar.
   - `scrollbar-border-color` or `-webkit-scrollbar-border-color` to set the color of the scrollbar border.

7. **Scrollbar Behavior:**

   - `scrollbar-autohide` or `-webkit-scrollbar-autohide` to control the auto-hiding behavior of the scrollbar.

8. **Scrollbar Pseudo-elements:**

   - `::-webkit-scrollbar` pseudo-element to target the entire scrollbar.
   - `::-webkit-scrollbar-thumb` pseudo-element to target the scrollbar thumb.
   - `::-webkit-scrollbar-track` pseudo-element to target the scrollbar track.

Here is an example of a customized scrollbar on devCanvas

<iframe src="https://snippet-bice.vercel.app/play/vs8OLm/embed" height="500px" width="100%"></iframe>

The accessibility bros are going to yell at you if you try to get rid of it, or even give you a convincing argument that it is perfect. But for me, it is super-duper ugly.

Till that is fixed, here is 'sleek scroll'.

## SleekScroll

Bid farewell to the ugly-looking scrollbar. With a focus on modern aesthetics, SleekScroll empowers you to create a browsing experience that's as elegant as it is functional.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703694636952/84645a5a-3f7b-4833-af64-96ad83c11304.png)

### Features

- Escape the ugly scrollbars with ease.
- Choose from a range of predefined themes or customize your own.
- Enjoy a smooth and engaging scrolling experience.
- Compatible with all Chromium-based browsers.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703694684840/083b4274-4eb4-43be-8439-5416de846814.png)

### Enjoy an experience that suits you better!

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1703694724380/de7fda5e-9022-47af-b337-6f21a4398762.png)

### Installation

1. [Download the extension](https://github.com/Abdumumin1/sleek-scroll)
2. Goto step 4, if you just clone the repository.
3. Unzip the package.
4. Open your Chromium-based browser (e.g., Chrome, Brave).
5. Go to the extension tab (e.g `chrome://extensions/`).
6. Enable "Developer mode".
7. Click "Load unpacked" and select the unzipped folder.

### Contributing

Contributions are welcome! If you'd like to contribute to SleekScroll, follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your forked repository.
5. Create a pull request explaining your changes.

### License

This project is licensed under the [MIT License](https://github.com/Abdulmumin1/sleek-scroll/LICENSE).

I might be taking this too far 😅.

**Get Started** [SleekScroll](https://github.com/Abdulmumin1/sleek-scroll/LICENSE)
