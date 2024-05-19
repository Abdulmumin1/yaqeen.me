---
title: 'How SSH Works - Under The Hood'

description: 'To migrate your SvelteKit project from using Node.js to Bun, you can follow these steps, which align with the best practices and examples provided in the Bun and SvelteKit documentation.'

date: '2024-05-18'

lastmod: '2024-05-18'

categories:
  - under the hood series

  - devops

  - sysadmin

label: 'under the hood series'

series: 'uth'

episode: 2

layout: series

published: true
---

In this weeks under the hood episode, we will take look into something a lot of system admins and DevOps use almost daily and that is ‘SSH’ which stands for secure shell.

> In case you missed the previous UTH episode where we discussed the ‘Fisher Yates’ algorithm, you can catch that [here](https://www.yaqeen.me/blog/fisher-yates-how-the-popular-shuffling-algorithm-works-uth-series)

## What is SSH?

SSH as you may already know, is a network protocol used to establish a secure access to operate a remote machine, without being physically present. SSH first appearance was in the mid 1990’s, originally developed by [Tatu Ylonen](https://ylonen.org/index.html).

![Tatu Ylonen](https://paper-attachments.dropboxusercontent.com/s_ED4A03F1900B4A123CECA802B644C7BA40B660FB6A23CAA3446E5C1CFC04CDD5_1715889341000_file.webp)

Up until it appearance, other services like Telnet, rlogin or RSH, where used to achieve this purpose. Although, they got quite a problem, i.e they transmits all information including usernames and passwords in plaintext, so it is not recommended for security-sensitive applications.

Anyone sniffing the network, would easily read all information including sensitive ones crystal clear.

![DIAGRAM OF AN ATTACKER LISTENING ON A CONNECTION BETWEEN TWO COMPUTERS](https://paper-attachments.dropboxusercontent.com/s_ED4A03F1900B4A123CECA802B644C7BA40B660FB6A23CAA3446E5C1CFC04CDD5_1716005536884_admin.png)

This flaw, is what SSH aim to solve, a method to connect to a remote machine, where by all data going through the network is secured and encrypted.

We will look at all process involve in successfully establishing an SSH connection , and I will try my best to simplify what happens at each of these layers.

## Initialization:

When you initialize an SSH connection with a SSH server, A three way (SYN, SYN-ACK, ACK) handshake occurs between the client and server to establish a TCP connection on port **22**.

> Handshake, if you’re not familiar with it, is a process by which the client and server ensures that both are ready for communication. In case of the three-way handshake - the client sends SYN (synchronization) with a packet containing a number X, then the server acknowledges (ACK) that, by responding with an increment X+1 i.e and also it own synchronization (SYN) packet containing a number Y, by which the client acknowledges that by sending over Y+1.

**Then**, a version exchange occurs between the client and server, where they verify whether or not, they are able to communicate based on there version numbers, In case of any compatibility issues.

## Algorithm negotiation.

Following the version exchange, both the client and server exchange list of their supported cryptographic algorithms, and then they agree on the algorithms to use, typically the first mutually supported algorithm from each list.

## Key Exchange

In this step, both client and server securely generates a session key by using mostly Diffie Hellman algorithm.

The algorithm works very simple:

> Keep in mind that “value” is some mathematical thingy.

1. Initially both parties agree upon common value (mostly a large prime number), which is usually not needed to be secret, let say it the seed value.
2. Then, they generate a secret value, that they don’t exchange with each other. (a private key)
3. Both the seed value and the secret value are then combined together to generate a public key, and then exchanged over the network.

> This can be done because, it will be very difficult to break it up into the exact values that created it. hence a third party doesn't stand a chance.

4. Then upon the client and server receiving each others resulting combinations, they both uses their private key, public key and the seed value to compute a shared secret.

I think one of the most simplified explanation and visual, will be that of the color mixing analogy:

![](https://paper-attachments.dropboxusercontent.com/s_ED4A03F1900B4A123CECA802B644C7BA40B660FB6A23CAA3446E5C1CFC04CDD5_1716004397619_originally+form+wikipedia.png)

Further learning

https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange#Cryptographic_explanation

https://www.youtube.com/watch?v=NmM9HA2MQGI&

[https://youtu.be/NmM9HA2MQGI](https://youtu.be/NmM9HA2MQGI)

## Authentication

After both devices have successfully establish a secure communication, authenticating the client will be required in other to provide access.

In SSH, authentication can be done with:

- Passwords
- private/public key mechanism

While passwords are very straightforward to understand. let skip that and look at the private/public key mechanism method.

Typically what you do is:

Generate an SSH key and copy that over to your ssh server.

Then, whenever you request to connect, the SSH does something like:

- The server encrypt some kind of message with your public key and sends it over.
- Your SSH client uses your private key to decrypt the challenge from the server.
- If the decryption is successful, it proves you possess the corresponding private key.
- The server can then verify if it was indeed it original message and allow you to connect.

![](https://paper-attachments.dropboxusercontent.com/s_ED4A03F1900B4A123CECA802B644C7BA40B660FB6A23CAA3446E5C1CFC04CDD5_1716010293366_Add+a+subheading1.png)

## Transport

After a successful authentication, SSH open up a new channel for back and forth transportation, which allows for different functionality like multiplexing, tunneling, port forwarding and so forth.

Every packet going through is encrypted, also a little bit of padding is added in there just for a little more extra security.

![](https://paper-attachments.dropboxusercontent.com/s_ED4A03F1900B4A123CECA802B644C7BA40B660FB6A23CAA3446E5C1CFC04CDD5_1716011357412_Add+a+subheading2.png)

That’s it, an overview of SSH does under the wood to establish a connection between devices.

Super hoped you learned something new as I did.

#### What I’m currently working on:

[devcanvas.art](http://devcanvas.art) - an online frontend editor with super powers; fast preview, plugins and an amazing library of cool frontend creations for your inspiration and learning.

Try devcanvas @ [devcanvas.art/new](http://devcanvas.art/new)

#### Further reading:

[How Secure Shell Works (SSH) - Computerphile](https://www.youtube.com/watch?v=ORcvSkgdA58)

[What Is SSH: Understanding Encryption, Ports and Connection](https://www.hostinger.com/tutorials/ssh-tutorial-how-does-ssh-work)

[What is SSH? | Secure Shell (SSH) protocol](https://www.cloudflare.com/learning/access-management/what-is-ssh/)

[Understanding the SSH Encryption and Connection Process](https://www.digitalocean.com/community/tutorials/understanding-the-ssh-encryption-and-connection-process)

[What is SSH? How it Works? [Animated Video]](https://www.youtube.com/watch?v=hwKhJ74ydOw)
