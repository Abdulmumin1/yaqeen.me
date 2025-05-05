---

title: 'Git: Beginners Guide'

description: "If you are just starting out, you might be wondering what exactly is git 🤔 and why the heck is it everywhere.
tied
Most of the time, you are working on building simple projects, and the code base doesn't get too complex. Hence, easy to maintain."

date: '2022-12-7'

lastmod: '2024-09-21'

categories:

- git
- version control
- cdl tools

label: 'mini course'

thumbnail: "https://cdn.hashnode.com/res/hashnode/image/upload/v1670257472877/Pg48r2kfi.png"

published: true

---

If you are just starting out, you might be wondering what exactly is Git 🤔 and why is it everywhere.

Most of the time, you are working on building simple projects, and the code base doesn't get too complex. Hence, easy to maintain.

But there is a catch, What if you want to show off your work? What if you can to deploy to production? What if you want to collaborate? What if you need to version your code? What if you need to revert back to a point in your project? And What if... Trust me bro, it can get really messy.

Thus, Git helps us solve this problem.

### What is Git

Git is a free and open source version control software that helps you manage and maintain your codebase.

With Git, Versioning becomes easy, collaboration can't get easier, managing and scaling your codebase comes in handy.

### A journey to learn Git

So, let say we set out to build a beautiful landing page, we're pumped to use Git, then we realise we don't have Git installed on our machine yet 😅.

> I will try my best to create an ideal imaginative workflow of working with Git as a beginner, so you can learn and relate properly.

### Installing Git

- on Windows
  Download installer [here](https://git-scm.com/download/win)
- on Linux
  If not already installed. use

```bash
sudo apt install git
```

- on Mac

```bash
brew install git
```

Learn more installing Git [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Initialize a Git repository

A Git repository/repo just as it sounds, is a repository where Git store changes and manages our tracked files 📂(files we've added to our repo) .

In our landing page project root directory we run

In terminal/cmd

```bash
git init
```

_Congratulations_ 🎊, we now have a Git repo in our project, but we are not tracking any of our project files 📂 yet.

### Adding files to our repo

First, we want to know the status of our landing page Git repo, that is, the files in the repo, tracked and untracked files, etcetera.

Run this in terminal/cmd:

```bash
git status
```

looks like no files in our Git repo, so now we decided to add the project files we are working on to the repo.

```bash
git add index.html main.css index.js
```

we have a simple stack, hence our project files does not look like some baobab tree 😅.

**Greate**, but the catch here is that, what if our project has lots of files, manually adding each of them is not the way we go about things as programmers, what we can do is run:

```bash
git add .
```

Now, that makes alot of sense, all the files have been added, like allll 😱.

### .gitignore

We are in trouble, let say we're using more modern js framework. Like all the _node_modules_ files and folders are now in our REPO??! That like 250 MEGABYTES crap!!!

We need to be able to **git add .** without getting worried that the images, files or other large assets that are just for local development and wouldn't be needed in anywhere in production ends up in our repo.

The **.gitignore** file allows to specify folders, files or specific extensions types we want to exempt from been tracked.

To achieve this, we create a **.gitignore** file in our project root directory and we can specify the following.

Folder, files or specific extensions to ignore.

.gitignore example

```txt
node_modules/
todo.txt
*.png
```

> Learn more about .**gitignore** [here](https://www.pluralsight.com/guides/how-to-use-gitignore-file)

That makes much more sense now, but we have only added our project files though, let make a commit 😀.

### Remove files

Maybe we mistakingly added all those files we are not suppose to track, or maybe we don't need some files to be tracked anymore.

we can remove those files with:

```bash
git rm FILENAME/FOLDER
```

> add `-r` to recursively remove if it a folder

The problem with this though is that, it completely delete that file from Git and in our directory.

But, if we want to untrack file we mistakenly track or we don't want to track anymore. We can add `--cache` flag to only remove that file from the Git repo.

```bash
git rm --cached FILENAME/FOLDER
```

> add `-r` to recursively remove if it a folder

### Commit

A commit is the state of our project files at a point in time.

Let imagine our landing coming together already, we've added the nav, and the hero text we came up with looks great in the header 😋.

Perfect moment to capture 😁✌.

#### To commit

- First we add changed files for staging:

We can either **git add .** or **manually** add the files we made changes to.

```bash
git commit -m "page hero text and nav"
```

> **\-m** flags message.

**Note:** make sure to use meaningful commit messages

If no new file is created though just like in our case, we did'nt introduce new file whatsoever. We can opt for the shortcut:

```bash
git commit -am "page hero text and nav"
```

### Log

We can see our commits with

```bash
git log
```

> **git log** displays commit message, date, author and their SHA key.

### Reset

Our project going great and so far, we've been creating meaningful commit or we can say restore point.

On this faithful day, we had bug, in trying to solve it we broke our code 😄.

We couldn't figure out what went wrong, fortunately we haven't done much from our previous commit.

Oh good God, let default back to our previous commit.

```bash
git reset --hard HEAD
```

Let don't freak out, **HEAD** holds the reference to our latest commit.

If we want to reset to other commit, we replace the HEAD with the commit SHA key.

### Branches

When we first initize a Git repo in our project, Git automatically creates a new branch for our project, this is usually called master (open sourceres don't like this though, main is preferred).

Branches are like folders and are movable

Our website is in production on the master branch, but we want to experiment with adding cool animations to our landing page.

Instead of modifying our master branch directly, we create a new branch.

```bash
git branch animation
```

We just created a new branch called `animation`.

We can view the branches in our repo by running:

```bash
git branch
```

### Checkout

To switch between branches we use:

```bash
git checkout BRANCH-NAME
```

in our case we are to switch to the animation branch we've just created.

```bash
git checkout animation
```

We can also checkout to commits not just branches.

```bash
git checkout COMMIT-SHA-KEY
```

### Merge

Whoa, the animation are looking great so far. After lots of commit to our new branch, perfect time to merge with our master branch 😍.

- First we checkout to our master branch.

```bash
git checkout master
```

- Then we merge in the animation branch.

```bash
git merge animation
```

Maybe we are done with the animation branch, we can delete with:

```bash
git branch -d animation
```

### Blame

Just want to leave this cool one here, if you want to find the guy that push the changes that broke production:

```bash
git blame
```

![](https://miro.medium.com/v2/resize:fit:640/format:webp/0*SAC52XAcLA0TNsvI.jpg)

## Conclusion

Git is a tool every developer should learn, it saves tons of time and makes managing your codebase easier (would'nt help you write better code though 😅).

Although collaboration with Git is mostly tied to a home like GitHub, which we didn't cover in our short journey.

> if you get stuck, remember there is always Google to pick you up 😅.

Anyways take care and stay subtle.

### Bye 👋
