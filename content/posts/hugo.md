---
title: And now, Hugo!
date: 2018-01-12T21:41:07-05:00
draft: false
tags:
    - code
    - go
    - hugo
description: So I've written more blog migrations than blog posts...
---

After forgetting about this for, hmm, three years, I figured it was time to start writing again. And of course, I can't just write. I also have to start over with everything. So this time around I am using [Hugo][0] for my static site engine.

I enjoy using Hugo as it has some nice tricks up its sleeve while being quite easy to get running.

Recently, I have also been using [VSCode][1], and to make it a little easier to generate posts I use the following `launch.json`:

```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "New Content",
            "type": "shell",
            "command": "read -p 'set_color green; echo -n \"Enter path for file \"; set_color normal; echo \"> \"' pth; and hugo new \"$pth\" --editor code",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": true,
                "panel": "shared"
            },
            "problemMatcher": []
        }
    ]
}
```

This adds a launch task to create a new page, prompting for the name of the file.

There is also the [Hugofy][2] extension for VSCode, however this is more than I need at this point.

[0]: https://gohugo.io/
[1]: https://code.visualstudio.com/
[2]: https://marketplace.visualstudio.com/items?itemName=akmittal.hugofy