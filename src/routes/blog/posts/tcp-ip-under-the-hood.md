---
title: 'TCP/IP - Under The Hood'

description: 'The model describes how data is transmitted over the network, ensuring the smoothest communication between networked devices. It describes how data should be broken into packets, routed, transmitted and received at the destination.'

date: '2024-06-14'

lastmod: '2024-06-14'

categories:
  - cyber security

  - networking

  - under the hood series

label: 'under the hood series'

series: 'uth'

episode: 4

layout: series

published: true
---

In this weeks under the hood series, i want to look into something pretty basic, something utilized at every tick of the clock. - TCP/IP.

Lots of us most have heard of the concept of TCP/IP, but this is under the hood series, where we will be looking at the technology a bit closer.

## What is TCP/IP

Transmission Control Protocol/Internet Protocol is a suite of communication protocols used to connect and communicate between devices on network.

The model describes how data is transmitted over the network, ensuring the smoothest communication between networked devices. It describes how data should be broken into packets, routed, transmitted and received at the destination.

> Quick Note: TCP is the specification, IP (Internet Protocol) is the addressing.

The routing and addressing part of the protocol is handled by IP (Internet Protocol). Each packets moving through the internet is bundled with an IP information, providing routers with the correct information of where the packets are to be sent or routed.

The Transmission Control Protocol (TCP) is a transport protocol, meaning it defines how data is sent and received.

TCP/IP model assigns tasks into 4 layers, simplifying the OSI model, each layers with it unique set of responsibility and contribution in ensuring a successful communication.

# 4 Layers of TCP

Each layer is standardized in the TCP/IP model.

## 1. Application layer

The topmost layer of the TCP model, it the starting point of data communication at the senders end, and the ending point at the receivers end. This is what the user typically interacts with, abstracting away the complexity of data communication.

It is responsible for providing high-level functions and protocols for applications to communicate over the network. Examples of protocols and services at this layer include HTTP, FTP, SMTP, DNS, Telnet, and DHCP.

## 2. Transport Layer - How the data is Transported.

Logically, it not practical to send the entire data in one go, the TCP protocol breaks down the data into chunks or packets, these are packets are then attached to a TCP header which contains several information for transmission and handling of data at the receiving end, these includes:

- **Source port**: The port number of the sender’s application.
- **Destination port**: the port number of the receiver’s application.
- **Sequence Number**: Each packet is assigned a number which helps to reassemble the data at the receiving end.
- **Checksum**: Used for error-checking of the header and data. It detects corruption during transmission.
- **Data Offset**: This field specifies the size of the TCP header in 32-bit words. It indicates where data begins. It is important for parsing variable-length options and ensuring that the TCP header is properly aligned.

- **Other** information includes Flags (ACK, SYN,URG, RST, …), Window size, Options, Padding among others.

![Transport layer transmission handling illustration](https://paper-attachments.dropboxusercontent.com/s_447C8B6D4796B6FCF7D4694FFC3273E4396B1B5B368DF3D5BD1E0819476F0E8B_1720941694974_Add+a+subheading5.png)

TCP ensures that all packets arrive in order once transmission begins. Via TCP, the recipient will acknowledge receiving each packet that arrives. Missing packets will be sent again if receipt is not acknowledged.

![Disassembly and reassemble of packets transmitting over TCP](https://paper-attachments.dropboxusercontent.com/s_447C8B6D4796B6FCF7D4694FFC3273E4396B1B5B368DF3D5BD1E0819476F0E8B_1720939373268_3.png)

## 3. Internet Layer

The internet layer or network layer, the is where the IP (Internet Protocol) comes in, taking up the task of routing, addressing and to make sure the packet is send to the correct destination.

Packets coming from the transport layer, where the TCP headers are attached, also get another piece of header as they pass through the Internet Layer, which helps them get to the desired destination.

The headers includes:

**Version**: This indicates the version of used IP address protocol, whether IPv4 or IPv6.

**IP Addresses (Source and destination)**

Every device or domain that connects to the Internet is assigned an IP address, and as packets are directed to the IP address attached to them, data arrives where it is needed.

An IP address is a unique string of characters that identifies each computer using the Internet Protocol (IP) to communicate over a network.

**Header Length**: Length of the IP header

**Time to Live (TTL)**: Limits the lifespan of the packet in the network

**Protocol**: Indicates the next level protocol (e.g., TCP, UDP)

**Others** includes Flags, Offset, Options...

![IP header list, excluding ip addresses (source & destination) and options](https://paper-attachments.dropboxusercontent.com/s_447C8B6D4796B6FCF7D4694FFC3273E4396B1B5B368DF3D5BD1E0819476F0E8B_1720940553674_Add+a+subheading3.png)

The IP header is added to the packet containing the TCP header and data, forming the complete IP packet that will be transmitted at the network layer.

## 4. Data Link

This layer function on metal, i.e on a hardware level, it responsible for handling the physical part of sending/receiving data via hardware such as Ethernet, Network card, wireless network and so forth.

![Header information attached at every layer of the TCP/IP model excluding the data link layer](https://paper-attachments.dropboxusercontent.com/s_447C8B6D4796B6FCF7D4694FFC3273E4396B1B5B368DF3D5BD1E0819476F0E8B_1720939319218_4.png)

At the data link layer, the following processes occur:

##### 1. Framing:

The network layer packet is encapsulated into a frame. This frame includes:

- Preamble: A sequence of bits to synchronize the receiver's clock.
- Start Frame Delimiter: Marks the beginning of the frame.
- Destination MAC Address: Physical address of the destination device.
- Source MAC Address: Physical address of the source device.
- EtherType/Length: Indicates the protocol of the encapsulated data or frame length.
- Payload: The actual data from the network layer.

##### 2. Frame Check Sequence (FCS):

For error detection.

##### 3. Addressing:

The frame uses MAC (Media Access Control) addresses to identify the source and destination devices on the local network segment.

##### 4. Error Detection:

The FCS allows the receiver to check for errors that may have occurred during transmission.

##### 5. Flow Control:

Manages the rate of data transmission to prevent overwhelming the receiver.

##### 6. Access Control:

In shared media, like Ethernet, the data link layer manages how devices take turns using the medium (e.g., CSMA/CD - [Carrier Sense Multiple Access with Collision Detection](https://simple.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_detection)).

#### Transmission over hardware:

Once the frame is prepared, it's passed to the physical layer, which handles the actual transmission over the hardware:

- **Encoding**: The binary data is encoded into signals that can be transmitted over the physical medium.
- **Signaling**: The encoded data is converted into electrical, light, or radio signals depending on the medium.
- **Physical Medium**: The signals are sent over the physical connection, which could be: Ethernet cable (electrical signals), Fiber optic cable (light signals) or Wi-Fi (radio waves)
- **Reception**: The receiving device's physical layer picks up these signals, decodes them back into binary data, and passes them up to its data link layer.
- **Processing**: The receiving data link layer processes the frame, checks for errors, and if it's the intended recipient, passes the payload up to the network layer.

![process of encoding data into physical form.](https://paper-attachments.dropboxusercontent.com/s_447C8B6D4796B6FCF7D4694FFC3273E4396B1B5B368DF3D5BD1E0819476F0E8B_1720947840661_image.png)

**Resources:**

[What is TCP/IP and How Does it Work? - Avast Academy](https://www.avast.com/c-what-is-tcp-ip)

[TCP/IP Model - GeekforGeeks](https://www.geeksforgeeks.org/tcp-ip-model/)

[TCP/IP - TechTarget](https://www.techtarget.com/searchnetworking/definition/TCP-IP)

[What is Transmission Control Protocol TCP/IP? - fortinet](https://www.fortinet.com/resources/cyberglossary/tcp-ip)

[What is the Internet Protocol? - Cloudflare](https://www.cloudflare.com/learning/network-layer/internet-protocol/)

**Before you go:**

I'm building [commentrig](https://www.commentrig.com), a platform that allow you to integrate a robust comment system to your website. Offering a package for all your favorite frameworks.

Join the waitlist here: [commentrig.com/waitlist](https://commentrig.com/waitlist)

**Stay super awesome 🫶🏾.**
