---
title: 'What is a subnet? | How subnetting works'

description: 'Subnets are used to group networks into smaller chunks in other to make addressing and traffic flow easier and smoother. These groups are defined either by logic or location. '

date: '2024-09-20'

lastmod: '2024-09-20'

categories:
  - cyber security

  - networking

  - under the hood series

label: 'under the hood series'

series: 'uth'

episode: 6

layout: series

published: true
---

## What is a subnet?

A subnet or a subnetwork just as the name suggests is - a tiny network inside of a larger network. But to be more technically accurate with the definition, we can say that “a subnet is a logical partition of an Internet Protocol (IP)”. Logical because it not a physical component, but rather a virtual.

Subnets are used to group networks into smaller chunks in other to make addressing and traffic flow easier and smoother. These groups are defined either by logic or location.

Think of this way, Imagine a town with 256 houses, numbered 0 to 255. Without organization, a delivery person might need to check every house to find the right one.

Now, let's divide this town into four subnets of 64 houses each: 0-63, 64-127, 128-191, and 192-255. If a package needs to go to house 227, the delivery person knows immediately to go to the fourth subnet (192-255) and only needs to search within those 64 houses, instead of searching the entire town, reducing the time each delivery person spends on the road (traffic).

IP addresses are like the house numbers, and subnets help routers quickly determine which part of the network to send data to, reducing traffic and improving efficiency.

## How Subnets Works

The IP address as you know is a 32-bit number that uniquely identifies a network interface on a machine. An IP address is typically written in decimal digits, formatted as four 8-bit fields (octet) separated by periods. Each octet represents a byte of the IP address. This form of representing the bytes of an IP address is often referred to as the **dotted-decimal format**.

The bytes of the IP address are further classified into two parts:

- Network part
- Host part

![Graphic](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726639998403_8.png)

**Network part**

This part specifies the unique number assigned to your network. It also identifies the class of network assigned. In the above figure, the network part takes up two bytes of the IP address.

**Host part**

This is the part of the IP address that you assign to each host. It uniquely identifies this machine on your network. **Note** that for each host on your network, the network part of the address will be the same, but the host part must obviously be different.

What separates the Network Prefix and the Host ID depends on whether the address is a Class A, B or C address.

![a table showing the network classes from A-E](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640005221_9.png)

**Class A Network Numbers**

A class A network number uses the first eight bits of the IP address as its "network part/id." The remaining 24 bits comprise the host part of the IP address.

![Byte Assignment in a Class A AddressGraphic](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640012111_10.png)

The values assigned to the first byte of class A network numbers fall within the range 0-127. Consider the IP address 75.4.10.4. The value 75 in the first byte indicates that the host is on a class A network. The remaining bytes, 4.10.4, establish the host address.

**Class B Network Numbers**

A class B network number uses 16 bits for the network number and 16 bits for host numbers. The first byte of a class B network number is in the range 128-191. In the number 129.144.50.56, the first two bytes, 129.144, are assigned by the InterNIC, and comprise the network address. The last two bytes, 50.56, make up the host address.

![GraByte Assignment in a Class B Addressphic](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640021713_11.png)

Class B is typically assigned to organizations with many hosts on their networks.

**Class C Network Numbers**

Class C network numbers use 24 bits for the network number and 8 bits for host numbers. Class C network numbers are appropriate for networks with few hosts--the maximum being 254. A class C network number occupies the first three bytes of an IP address. Only the fourth byte is reserved for hosts.

![Byte Assignment in a Class C AddressGraphic](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640049942_12.png)

The first byte of a class C network number covers the range 192-223. The second and third each cover the range 1- 255. A typical class C address might be 192.5.2.5. The first three bytes, 192.5.2, form the network number. The final byte in this example, 5, is the host number.

![Division of IP Address Space / Network classes](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640058654_9.png)

**Learn more about network class:**
[What is a Network Class?](https://www.cbtnuggets.com/blog/technology/networking/introduction-to-subnetting-what-is-a-network-class)
[Network Classes - Oracle](https://docs.oracle.com/cd/E19504-01/802-5753/6i9g71m2o/index.html#planning3-78185)

**Subnet Number**

Apart from the network and host ID, a third player can comes in, and that is the **subnet**. If you choose to divide your network into subnets, you need to assign a **subnet number** for the subnet. You can maximize the efficiency of the IP address space by using some of the bits from the host number part of the IP address as another network identifier for the subnet.

![](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726640465842_Add+a+subheading.png)

A **subnet mask** is used to identify the part of the address that is available for use a the **Subnet ID** (essentially used to calculate the network and host portion of an IP address)

## Subnet Mask

A subnet mask is a 32-bit number used in conjunction with an IP address that identifies the network and host portions of a network component. Let’s say you have an IP address of 192.68.75.0/24. The subnet mask would be 255.255.255.0, or in binary, 111111.111111.111111.000000. This notation provides an easy way for a network to determine which portions of an IP address can be allocated to a host, hence borrows from it to create a subnet ID.

A class A network would have a subnet mask of 255.0.0.0, B would have 255.255.0.0 and C would have 255.255.255.0.

### Calculate Subnet Mask

If a subnet mask 255.255.255.0 is applied to the IP address 129.144.41.101, the result is the IP address of 129.144.41.0.

129.144.41.101 & 255.255.255.0 = 129.144.41.0 (our network ID)

In binary form, the operation is:
10000001.10010000.00101001.01100101 (IP address)
ANDed with
11111111.11111111.11111111.00000000 (subnet mask)

![Deriving network address from ip address and subnet mask](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726749804129_Add+a+subheading1.png)

> Note: A subnet mask would always be a stream of 1’s then 0, it can’t be interrupted. say for example `11111111.101110111.1111111.00000` is not a valid subnet mask.

As a bonus, I found this [tool](https://www.solarwinds.com/free-tools/advanced-subnet-calculator) that can help you play around with calculating subnet masks:

![Subnet Mask Calculator  - Solar Winds](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726750152786_image.png)

**Article resource on calculating subnet masks**

[How to calculate a subnet mask from hosts and subnet - TechTarget](https://www.techtarget.com/searchnetworking/tip/IP-addressing-and-subnetting-Calculate-a-subnet-mask-using-the-hosts-formula)

To calculate the number of hosts that can be acheived on a subnet mask:

- Convert the subnet mask to binary notation
- Count the number of 0’s.
- Raise 2 to the power of that number.

Take for Example the subnet mask:

> Dotted-Decimal form: 255.255.248.0
>
> Dotted-Binary form: 11111111.11111111.11111000.00000000
>
> Counting, we find we have 11 zeros.
>
> So the number of host we can have on this subnet is **2^11 = 2048.**
>
> but remember we have to subtract the network identifier and the broadcast address, which gives us **2046** usable hosts.

> So the formula is `2^(number of zeros) - 2`

### CIDR Notation

Another way to write a subnet is using the CIDR (Classless Inter-Domain Routing) notation. The CIDR notation basically just states the number of bits the network is occupying.

CIDR notation is used to identify Network Prefix and Mask, where the subnet mask is a number that indicates the number of ones in the Mask (e.g., 172.16.2.0/24). This is also known as Variable-Length Subnet Masking and CIDR.

**For example.**

192.14.32.0`/24` - this tells us that the first three 8-bit groups (octet) is the network ID.

A `/24` subnet means that the first 24 bits are `1`s, and the rest are `0`s. The binary for a `/24` subnet mask would be.

    11111111.11111111.11111111.00000000

> Thus if we’re to calculate the number of host using this CIDR notation. it would be:
>
> **2^(32-24) - 2 = 254.**
>
> “-2” because we have to remove our network id and broadcast, remember?

![](https://paper-attachments.dropboxusercontent.com/s_72A924DAA00497F468555CC6BFB00A4C149A6D95BBB8CD0D5266A292F697A67E_1726751443329_Add+a+subheading2.png)

### So what happen to packets when they pass through a subnetwork?

When you’re sending a packet to a host in a subnet, It goes through the normal networking procedure, but with some extra layers. The process happens as follows:

- The packet is first checked to see if it is intended for a device within the **same subnet** as the sender.
- The **subnet mask** of the source IP address is used to determine which part of the IP address represents the network and which part represents the host.
- If the destination IP address belongs to the same subnet, the packet is delivered directly to the target device within the local network.
- If the destination IP address belongs to a different subnet, the packet needs to be routed through a **gateway** or **router**.

In essence, when a packet passes through a subnet, it undergoes **routing** if it's destined for a different subnet, and **direct delivery** if it's destined for the same subnet. During routing, each router examines the packet and forwards it closer to its destination based on the subnet structure and routing protocols.

### Final Thoughts

Subnet major benefit is in Improved Network Performance, because, when a device broadcasts a packet, it’ll reach all the network devices, burdening the network. Without proper context, broadcast packets can also spam devices within the network. This can lead to degraded network performance. By creating subnets, it limits the scope of intra-network broadcast messages to a specific subnet. This also enables efficient communication between devices in a subnet and sends a packet for routing outside the subnet if a destination address isn’t part of the subnet, leading to minimum network congestion.

#### Resources

- [Parts of the IP Address - Oracle](https://docs.oracle.com/cd/E19504-01/802-5753/6i9g71m2o/index.html#planning3-fig-2)
- [Network Classes - Oracle](https://docs.oracle.com/cd/E19504-01/802-5753/6i9g71m2o/index.html#planning3-78185)
- [What is a network class - cbtnuggets](https://www.cbtnuggets.com/blog/technology/networking/introduction-to-subnetting-what-is-a-network-class)
- [The CIDR Notation - Cbtnuggets](https://www.cbtnuggets.com/blog/technology/networking/proper-cidr)
- [What is a subnet - Cloudflare](https://www.cloudflare.com/learning/network-layer/what-is-a-subnet/)
- [Subnet - Techtarget](https://www.techtarget.com/searchnetworking/definition/subnet)

**Stay Subtle**
