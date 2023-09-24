---
title: Customizing Your Git Log Output
description: By customizing your git log output, you can make your Git logs look exactly the way you want which could make your life easier.
author: Or Kazaz
authorImage: https://avatars.githubusercontent.com/u/83350680?v=4
coverImage: https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1540&q=50
date: "2023-09-24"
tags: ["General", "git"]
---

While Git provides a suite of powerful tools out of the box, the true strength of this version control system lies in its flexibility and adaptability. In this blog post, we will dive into a specific aspect of Git that often goes underappreciated: customizing the git log command. By customizing your git log output, you can enable yourself to make your Git logs look exactly the way you want.

Before we get into it, let's understand the default behavior of `git log` command. By default, git log shows the commit hash, author, date, and commit message. While this is helpful, you can modify it to show more specific and visually appealing details. How?

You can do this by setting aliases in the The `.gitconfig` config file. This is where you can define global configurations and aliases.

So in order to show case some of the stuff can be done as aliases, i'll share some of my aliases the resides in my gitconfig file:

__git lg__

```bash
[alias]
    lg = log --color --graph --pretty=format:'%C(yellow)%h%Creset -%C(red)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```
This alias provides a colorful, abbreviated commit log with a graph on the side.

![git-lg](/images/git-lg.png)

__git lol__

```bash
[alias]
    lol = log --graph --decorate --pretty=oneline --abbrev-commit --format=format:'%C(yellow)%h%C(reset)%C(red)%d%C(reset) %C(white)%s%C(reset) %C(green)(%ar)%C(reset) %C(bold blue)<%an>%C(reset)'
```

Building on the previous alias, this one presents an even more compact one-liner version of the log.

__git lola__

```bash
[alias]
    lola = !git lol --all
```
Extends the lol alias by displaying logs from all branches.

__git lgc__

```bash
[alias]
    lgc = !git lg | sed '$a\\' | grep '* ' | tac | cat -n | sed 's/^[ \t]//' | sed 's/[\t][\\*]//' | tac | less -XR
```
This is a more advanced alias that manipulates the output using sed and less to display the log entries in a structured manner with an accompanying index.

----
Looking at the lg and lol aliases, there are several formatting options used:

___--graph:___ Displays an ASCII graph of the branch and merge history.

___--pretty=format:'...':___ This option allows us to specify the format of the log output. Within the format string, we can use placeholders like %h (abbreviated commit hash), %an (author name), and %s (commit subject).

___--abbrev-commit:___ This shortens the commit hash to a smaller, more readable length.

___Color Formatting:___ Using %C(color_name) before a placeholder will change its color in the log. For instance, %C(yellow)%h%Creset will display the commit hash in yellow.

To conclude this short one, customizing Git logs is more than just a visual preference. It can drastically enhance your Git experience, helping you quickly grasp your repository's history and the relationships between commits and branches. By using the `.gitconfig` to its full potential, you can mold Git's behavior to suit your unique workflow and aesthetic preferences.
