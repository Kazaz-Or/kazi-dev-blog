---
title: Linux Process Prioritization with Niceness
description: Get to know the Linux process priority and Niceness.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: /images/niceness-linux.webp
date: "2023-12-01"
tags: ["General", "Linux"]
---

I'll start with a disclaimer - I'm far from a Linux expert. But Linux fascinates me, and i'm using a Linux based OS on a daily basis. That's why i'm not writing this blog post from an expert point of view, but rather from a curious one.

I first encountered the Nice term in Linux in my previous work place where we worked on Embedded devices running on ARM architecture with Buildroot as a distribution. We had a bug where one of the processes failed to load on time and we eventually fixed it by tweaking its niceness value (that's in a very high level, but you get the idea).

To understand what is niceness, we need to understand what is process priority and the Linux scheduler first.

Every operating system has a scheduler. The job of the scheduler is to allocate processor time to the various processes that are running in parallel. The scheduler must make decisions about which process to run next and for how long, especially when there are multiple processes requesting CPU time at the same time.

This is where priorities come into play. In Linux, every process is assigned a priority number. The lower this number, the higher the priority. The scheduler uses these numbers to decide which process to run next.

So How is nice related to priority?

Niceness is an indirect representation of priority. Instead of dealing with priorities directly, Linux uses the concept of niceness to allow users to influence the scheduler's decisions in a more user-friendly manner.

Niceness values range from -20 (highest priority) to 19 (lowest priority).
The actual priority value (often referred to as the "nice value") ranges from 1 (lowest priority) to 40 (highest priority).
When a process has a niceness value of 0, its actual priority is 20. A niceness value of -20 would adjust the priority to 0, while a niceness value of 19 would adjust it to 39.

A process with a high niceness value (close to 19) is "nicer" to other processes, implying it's less demanding of CPU time. Conversely, a process with a low niceness value (close to -20) is less "nice," indicating it's more demanding.

![niceness-scale](/images/niceness-scale.png)

For example, let’s say with run a command like `ls`, in most cases it’ll get the 0 niceness priority (default) as all other process unless it was defined differently.
You could, for the sake of the example, run `nice ls` and it’ll result with a niceness level of 10.

Now Let’s say you don’t want to use defaults, you could run `nice -n 15 ls` and it’ll will run with a niceness level of 15.

```bash
$ ps -l
F S   UID   PID  PPID  C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD
0 S  1000 15044 15035  0  80   0 -  7453 wait   pts/29   00:00:00 bash
0 S  1000 15052 15044  0  60   15 -  3976 hrtime pts/29   00:00:00 ls
0 R  1000 15080 15044  0  80   0 -  4680 -      pts/29   00:00:00 ps
```

The whole point of niceness is to not allow normal users to set high priorities for their process. Lets say for example I want to run with high priority `nice -n -20 ls`, you’ll usually get an output like this:

```bash
nice: cannot set niceness: Permission denied
```
And the command will run with default niceness level (in most common cases).
This is because such operation is reserved for root users so normal users won't break their systems.


In practical terms, when we should use which niceness level? Here are some examples:

- A CPU-intensive task that you don't need to finish immediately (like a background data processing job) might be assigned a high niceness value to ensure it doesn't starve other processes of CPU time.
- A real-time task that needs to execute immediately (like audio or video processing) might be given a low niceness value to ensure it gets as much CPU time as it needs.

__Adjusting Niceness__

Suppose you're running a large compilation job, a backup, or any task that can potentially hog all the CPU like dealing with large files. You might want to run it with a high niceness value to prevent it from slowing down other processes.

```bash
nice -n 19 tar -czf backup.tar.gz /home/user
```

For tasks that require immediate processing, like audio/video encoding or real-time simulations, you might want to decrease their niceness value.

```bash
sudo nice -n -10 ffmpeg -i input.mp4 output.mp3
```

Let's say you started a process without modifying its niceness but later realized it's consuming too much CPU. You can dynamically adjust its niceness using `renice` and the process PID (which you can get with a simple `ps -l` command).

```bash
renice -n 15 -p [PID]
```

In the Linux ecosystem, understanding process scheduling, priority, and niceness is invaluable. By tweaking these parameters, software developers can optimize applications for performance, responsiveness, and resource usage. Whether it's ensuring smooth multimedia playback, prioritizing time-sensitive tasks, or preventing resource-intensive processes from overwhelming the system, the power of niceness offers developers a robust tool in system optimization.
