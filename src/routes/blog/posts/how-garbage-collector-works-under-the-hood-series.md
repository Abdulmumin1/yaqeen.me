---
title: 'How Garbage Collector works - Under The Hood series'

description: 'A garbage collector is a program that automatically free up memory space allocated to objects that are no longer needed to further the execution of the program.'

date: '2024-05-18'

lastmod: '2024-05-21'

categories:
  - systems

  - garbage collector

  - under the hood series

label: 'under the hood series'

series: 'uth'

episode: 3

layout: series

published: true
---

in this week _under the hood series_, I want to look into something I've heard over and over again from systems engineers and seniors, - **Garbage Collector**. You've probably also heard the buzz as well - some say they love garbage collected languages, other say the are fine with It and some trash on It.

And of course, frequency of the buzz among superiors makes you curious just like myself, you also want to understand and relate to these conversations.

In this article, I will try my best to explain In simple terms, what It Is and does, why It exists and most Importantly, how It works.

> Catch the previous episode here:
> [How SSH Works - Under The Hood](https://www.yaqeen.me/blog/how-ssh-works-under-the-hood)

## What is Garbage Collection

A garbage collector is a program that automatically free up memory space allocated to objects that are no longer needed to further the execution of the program.

In essence, Garbage collector helps manage allocation and release of memory, ensuring the application never exceeds it memory quota.

### Why?

If you've never written code in languages that are not garbage collected, you might have never come across the scenario of manual memory management. I would assume you've never, and i'm already sure the thought of it is already scaring you away.

There is no gainsaying the fact that quite a lot of human errors will be involved in manual memory management, which increase bugs and decrease your application security in various ways.

Some of which are:

- **Double free**:
  Double free occur when you're are trying to free up memory space that has “_already been freed_”. Double frees are particularly dangerous because they can corrupt the memory allocator's internal data structures, potentially leading to more severe issues like heap corruption.
- **Dangling pointer**:
  A dangling pointer is a pointer that references a memory space that has been freed (deallocated) and is not set to **NULL** afterwards. This makes our program buggy and might crash unpredictably.
- Other kinds of human errors are inevitable in such scenario. such as failing to free up memory, which becomes unreachable, **memory leak** is sure the right term.

These reasons might not exactly be the why Garbage Collector was first created. Either way, it first appeared around 1959, by the same guy that coined the word "Artificial Intelligence (AI)" - [John McCarthy](<https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)>) to simplify the memory management in [Lisp](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>), the language he designed. John McCarthy is often refered to has the father of "Artificial Intelligence".

![John mcCarthy at work in his artificial intelligence laboratory at Stanford](https://static.independent.co.uk/s3fs-public/thumbnails/image/2011/10/31/20/48-John-McCarthy-AP.jpg?quality=75&width=1250&crop=3%3A2%2Csmart&auto=webp)

Other languages soon follow suite, baking garbage collectors into the language's runtime or compiler.

### Why not?

Garbage collection typically runs alongside your program, eating up a portion of CPU time and potentially impacting performance. Though the modern implementation have become quite efficient, making the performance impact minimal.

## How Garbage Collection works (Tracing Algorithm)

Each implementation of garbage collection has it own distinct tweaks, but are similar in the underlying algorithm.

We will be explaining the **tracing** algorithm in particular, which is the go to algorithm for most garbage collection implementation.

### 1. Picks the best time for collection.

The program first and foremost action is to determine when to collect the garbage, it does not happen in real time, hence depends on memory allocations or intervals.
Though when a program is about to exhaust it allocated memory and new object are to be created, a priority collection is performed to free up space for the new object.

### 2. Checks Heap

The garbage collector then find objects that are no longer being used by examining the application's roots. An application's roots include static fields, local variables on a thread's stack, CPU registers, GC handles, and the finalize queue. Each root either refers to an object on the managed heap or is set to null.

![a graph showing objects relationship in the managed heap](https://paper-attachments.dropboxusercontent.com/s_0D93CE3324AFDB62F49B8CA5CBF3FAB80B10D6353DD4EC6DB71D6B0C521057D5_1719161794886_Screenshot+2024-06-23+at+17-00-32+Online+FlowChart++Diagrams+Editor+-+Mermaid+Live+Editor.png)

The garbage collector then uses this list to create a graph that contains all the objects that are reachable from the roots.

![a graph showing reachable objects in a grapth](https://paper-attachments.dropboxusercontent.com/s_0D93CE3324AFDB62F49B8CA5CBF3FAB80B10D6353DD4EC6DB71D6B0C521057D5_1719161813666_Screenshot+2024-06-23+at+17-06-18+Online+FlowChart++Diagrams+Editor+-+Mermaid+Live+Editor.png)

### 3. Collects & Compact

All unreachable objects at this point are considered garbage. The collector scans the heap, looking for the addresses of the memory space they occupy, and eliminates them.
Then, it uses a momery-copying function to compact the reachable objects in memory.

**Note**

Memory compaction is a process where the garbage collector moves all the reachable (live) objects to one contiguous area of memory, eliminating the gaps left by unreachable (dead) objects. This process has two main benefits:

1. It frees up larger blocks of continuous memory, making it easier to allocate new objects.

2. It improves memory access efficiency by keeping related objects closer together.

   ..

   ![memory compacting in garbage collection](https://paper-attachments.dropboxusercontent.com/s_0D93CE3324AFDB62F49B8CA5CBF3FAB80B10D6353DD4EC6DB71D6B0C521057D5_1719161885811_Screenshot+2024-06-23+at+17-57-49+Online+FlowChart++Diagrams+Editor+-+Mermaid+Live+Editor.png)

### 4. Updates Pointers.

The final process of the collection is to correct all pointers so it points to the new locations of the reachable objects.

The heap pointer is also adjusted, positioned after the last reachable object.

**Note**

The heap pointer, also known as the "free space pointer" or "allocation pointer," indicates where the next object will be allocated in the managed heap. After compaction, this pointer is moved to the end of the last reachable object. This ensures that new allocations will occur in the contiguous free space, promoting efficient memory usage.

In summary, the garbage collector does:

![Garbage Collector in summary](https://paper-attachments.dropboxusercontent.com/s_0D93CE3324AFDB62F49B8CA5CBF3FAB80B10D6353DD4EC6DB71D6B0C521057D5_1719162037291_Screenshot+2024-06-23+at+18-00-28+Online+FlowChart++Diagrams+Editor+-+Mermaid+Live+Editor.png)

## Generations

That not the whole story though, in other to maximize efficiency and reduce performance overhead, modern algorithms includes generations.

Typically, the GC Algorithm makes several assumptions, one of which is "Newer objects have shorter lifetimes, and older objects have longer lifetimes". Hence, three (3) generations are available 1, 2, and 3.

- Larger Objects occupy Generation 3, collection rounds does not come around often.
- Generation 2 contains objects that survives the Generation 0 collection round, hence promoted. When Collection round comes by this generation, it includes those in 3 as well.
- Generation 1 is where all newly created objects are considered. most object here don't survive the collection round, and are promoted to Generation 2 if they did.

[Illustration]

![Garbage collection generation hierarchy](https://paper-attachments.dropboxusercontent.com/s_0D93CE3324AFDB62F49B8CA5CBF3FAB80B10D6353DD4EC6DB71D6B0C521057D5_1719162048707_Screenshot+2024-06-23+at+17-48-34+Online+FlowChart++Diagrams+Editor+-+Mermaid+Live+Editor.png)

A lot of thing do happen during garbage collection, It was such an Interesting topic for me personally to read about, Super hoped you learn something new as I did. Stay tuned for more awesome topics coming to the [UTH series](https://www.yaqeen.me/blog/series/uth).

#### Resources

[Fundamentals of garbage collection - .NET | Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals)

[What is garbage collection (GC) in programming?](https://www.techtarget.com/searchstorage/definition/garbage-collection)

[Garbage collection (computer science) - Wikipedia](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>)

**Stay super awesome 🫶🏾.**
