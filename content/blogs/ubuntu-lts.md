---
title: Why You Should Only Use LTS Version of Ubuntu
description: Using only LTS versions of Ubuntu - The benefits explained.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://res.cloudinary.com/practicaldev/image/fetch/s--Gx5KGHeG--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_800/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a6piejdhzf2nhsfixe09.png
date: "2023-09-14"
tags: ["Linux", "Ubuntu"]
---

I have decided to write what I know about this topic once I have encountered (and not for the first time) some machines that are running on non-LTS versions of Ubuntu at my current and past workplaces. It's true that it wasn't something production related, but it applies also for CI machines and/or dev machines (desktop or laptop).

But before we do a deep-dive into the topic, let's first understand what is LTS and what is non-LTS and what they mean.

### LTS vs Non-LTS

LTS stands for "Long-Term Support". It is a type of release in the software world and especially for operating systems, particularly in the open-source community, that promises extended support for a more extended period than standard releases. Usually this support involves driver updates, security updates, bug fixes and more.
 
For Ubuntu, an LTS version is released every two years and is supported for five years, whereas regular releases (Non-LTS) come out every six months and have a support lifespan of only nine months.

### Now that you have a grasp on what LTS stands for, let's explore the reasons to stick with LTS releases of Ubuntu:

__Stability Over Novelty:__ One of the primary objectives of LTS releases is to provide users with a stable environment. This means that the software, tools, and packages included in an LTS release have undergone thorough testing to ensure they are free from major bugs and issues. Some users will argue that this is actually a disadvantage, as you have to wait for new updates (such as driver or HW support) much longer than rolling releases.
In my point of view, for the use cases of every day development usage and especially in CI machines, i'd rather go with slower update process to reduce risks. I would also argue that for production environments, this is a must of course.

__Extended Support:__ With a five years of support, you don't have to worry about frequent upgrades. If you're running a mission-critical server, this extended support can be a blessing.

__Security Updates:__ During the five years of support, the Ubuntu team continues to provide security patches and updates, ensuring that your system remains protected from the latest known threats.

__Predictable Environment:__ Many businesses, educational institutions, and organizations prefer an OS environment that remains consistent over time. With LTS versions, there are fewer surprises, allowing IT departments and users to familiarize themselves deeply with the system.

__Reduced Overhead for System Administrators:__ Frequent system upgrades can be a drain on resources, especially in large-scale deployments. With LTS versions, system administrators have more time in between major upgrades, reducing the administrative overhead.

__Software Compatibility:__ Over the five years of an LTS release's lifespan, developers get to know the ins and outs of that specific release. This means they can fine-tune their applications for compatibility and performance, ensuring users have the best experience possible.

__Hardware Certifications:__ Manufacturers often target LTS releases when certifying their hardware for Ubuntu, ensuring optimal compatibility and performance.

__Ideal for Servers and Enterprise Use:__ Uptime, stability, and predictability are often paramount for servers and enterprise environments. Given the longevity and stability of LTS releases, they are a natural fit for these use cases.

__Official Support from other SW__: Usually, other important vendors (let's take Steam as an example) announcing that they are supporting LTS release. It doesn't mean things won't work on non-LTS, but it means that they are not testing it on non-LTS and they are not supporting it officially.

__Better Product:__ I know this one sounds a little bit weird, but most LTS releases are much better than non-LTS releases (and i'm saying this from experience). However, there are some exceptions to this rule (Looking at you Ubuntu Server 18.04), but in general, LTS releases are much more stable and reliable.

### Not convinced? Let's take a look at the other side of the coin and see why you might want to use non-LTS versions of Ubuntu:

__Shorter Support Lifecycle:__ Non-LTS versions receive support for only nine months. This means that if you're using a non-LTS version, you'll need to upgrade your system at least once a year to keep it supported. Failure to do so could leave your system vulnerable to unpatched security issues.

__Increased Maintenance:__ Frequent upgrades can be time-consuming, especially if you have customized your system or use software not included in the standard repositories. Each upgrade poses a potential risk of breaking configurations or compatibility with third-party software.

__Stability Concerns:__ Non-LTS releases might incorporate newer and less-tested software, which, although feature-rich, might not be as stable or reliable as those in LTS releases. This could lead to unexpected system behavior, crashes, or incompatibilities.

__Hardware Compatibility:__ If you're using older hardware, there's a chance that non-LTS versions might not support it as well. LTS releases, being more focused on stability, often ensure broader hardware compatibility.

__No "secure" method to upgrade to LTS release from Non-LTS:__ Usually, there is no suggested solution to this. If you're using Non-LTS version of Ubuntu, you'll have to reinstall the OS to get to the LTS version. This is not a big deal for desktops or laptops, but for servers, this is a big no-no.

![ubuntu-lts-vs-non-lts-releases-update](https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_720/https://ubuntu.com/wp-content/uploads/c26b/Screenshot-from-2021-09-21-16-45-52.png)


Choosing between LTS and non-LTS versions depends on individual needs and use cases. While non-LTS releases provide early access to the latest features and tools, they come with their set of challenges that in most cases won't fit any production environment or what the Linux community refers as your "daily driver" for desktops users. 

For those who prioritize stability, longevity, and reduced maintenance, LTS releases remain the top recommendation. However, for enthusiasts and those wanting to stay on the cutting edge, non-LTS versions might be appealing, provided they are prepared for the associated potential issues. If that's you, I would recommend using other Linux distributions such as Arch.
