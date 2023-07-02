---
title: 10+ AWS services explained!
description: post description
date: '2023-6-14'
categories:
  - svelte
  - sveltekit
  - frontend

published: true
---

## Introduction

Amazon Web Services(AWS) is a cloud computing platform with over 150+ featured services that provide businesses, customers, startups and developers with access to cloud infrastructures and software. AWS includes the mixture of Infrascture-as-a-services(IAAS), Platform-as-a-services(IAAS), and Software-as-a-services(SAAS).

AWS offers many different solutions and tools that enable their customers to become more agile and innovate faster.

1. EC2

2. Load Balancer

3. Cloud watch

4. ECS

5. Lambda

6. DynamoDB

7. Cognito

8. Notifications

9. CloudFormation

10. Amplify

11. S3

## Elastic Cloud Compute (EC2)

Elastic Compute Cloud allows you to create a virtual computer in the cloud. It very flexible and allows you to choose the operating system, storage, memory and other resources. With a pay-as-you-go plan, you only pay for EC2 servers (instances) running.

EC2's best use case is for hosting applications and can be configured to autoscale in or out to fit demand.

## Elastic Load Balancing (ELB)

As your app grows and the amount of traffic increases, you probably need to add more servers to keep up with demand.

A load balancer acts as a single point of contact for all incoming web traffic to your group of servers. These requests route to the load balancer first, Then are spread across multiple instances.

Elastic Load Balancing is a service that automatically distributes incoming application traffic across multiple resources.

## Cloud Watch

CloudWatch takes the stress out of maintaining your cloud/on-premises environment by constantly collecting logs, metrics and event data. It gives you real-time insights into the health and performance of your applications.

But CloudWatch doesn't stop at monitoring, It also gives you the ability to set alarms and configure automated actions to be fired when certain conditions are met. A common use case is autoscaling based on the amount of traffic in your application.

## ECS

Elastic Containerized Service (ECS) is a fully managed containerized orchestration service, that helps you manage containerized applications more efficiently and effortlessly.

ECS is like a powerhouse manager for your containerized applications, effortlessly orchestrating and scaling containers to meet your needs, without breaking a sweat. It provides you with a flexible and scalable platform where you can easily package your applications into containers enabling you to build, deploy and run them with utmost simplicity.

## Lambda

Lambda is a serverless cloud compute service that allows to run code without the need to provision or manage servers. It is like having an invisible helper who can execute your code on demand, relieving you from the burden of infrastructure management.

With Lambda, you can focus on writing the code for your application, while AWS takes care of infrastructure management, scaling, and availability.

### DynamoDB

Amazon DynamoDB is a database service provided by Amazon Web Services (AWS). It is designed for applications that require low latency and seamless scalability.

With DynamoDB, you can bid farewell to the traditional hassles of setting up and managing databases. It's a fully managed NoSQL database service provided by Amazon Web Services (AWS) that takes care of all the heavy lifting for you.

DynamoDB is a highly flexible and scalable database, which makes it fit for a wide range of use cases. Whether you are building a high-traffic website or maybe a data-intensive analytic platform.

## Cognito

If you have ever tried to set up user authentication from scratch, you know it can be quite a complex and time-consuming task. But fear not! AWS Cognito comes to the rescue like a trusty guide, offering you a smooth and hassle-free experience.

Cognito is a fully managed service that empowers you with the ability to setup user authentication. It provides pre-built authentication workflows, supporting popular identity providers like Google, Facebook, and Amazon, as well as the option to create your own user directories.

## Notifications

AWS offers a notification service called Amazon Simple Notification Service (SNS). SNS is a fully managed messaging service that enables you to send messages to distributed systems and services, including mobile devices, email, and other AWS services. It provides a scalable, flexible, and reliable approach to send notifications and messages.

AWS SNS can publish messages to many different endpoints, such as Amazon SQS queues, AWS Lambda functions, HTTP/S endpoints, email addresses, SMS messages, and mobile push notification services like Apple Push Notification Service (APNS) and others.

## Simple Storage Service

Amazon Simple Storage Service (S3) is a scalable and reliable object storage service. It allows you to store and retrieve any amount of data from anywhere on the web. S3 is designed to provide high availability, durability, and performance for a wide range of use cases.

Common use cases for S3 include, backup and restore, data archiving, content storage and distribution, log and data analytics, data lakes, and static website hosting.

## Amplify

AWS Amplify is a development platform that simplifies the process of building full-stack applications for both web and mobile platforms. Amplify offers a combination of tools, packages and services that accelerate your development process.

Amplify simplifies the development process by providing a set of abstractions and pre-configured services that handle the backend infrastructure, authentication, data storage, and deployment aspects of your application. This allows developers to focus more on building features and user experiences, reducing the time and effort required to build robust and scalable applications.

## CloudFormation

AWS CloudFormation is a powerful service that allows you to provision and manage your AWS resources using infrastructure as code. With CloudFormation, you can define your desired infrastructure in a declarative template, which is a text file written in JSON or YAML. This template describes the resources, their configurations, and any dependencies between them. Once you've created your template, CloudFormation takes care of all the heavy lifting, provisioning and managing your resources consistently and reliably.

### Conclusion

Amazon Web Services (AWS) offers a wide range of cloud services for scalable and secure application development. With services spanning compute, storage, databases, and more, AWS provides the essential building blocks for innovation and digital transformation. Its global infrastructure ensures low latency and high performance, while the pay-as-you-go pricing model enables cost-effective scaling.

AWS prioritizes security and compliance, providing encryption, access controls, and certifications to protect data and meet regulatory requirements. Its flexibility, scalability, and reliability have made it popular across startups, enterprises, and government organizations. Whether you need to host a website, develop machine learning models, or build a global infrastructure, AWS has the tools and services to meet your needs. With a strong ecosystem and a commitment to continuous innovation, AWS remains a leading choice in cloud computing.
