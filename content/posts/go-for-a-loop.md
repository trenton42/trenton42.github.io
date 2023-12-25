---
title: "Go For a Loop"
date: 2019-01-15T21:48:16-05:00
draft: false
categories:
    - code
tags:
    - go
    - code
description: Visualizing for loops in go
---

Go, like many languages, has a `for` loop. The snippet below can help to understand the versatility of these loops. This mechanism goes well beyond simply counting integers, but can be used to implement any number of looping patterns. The important thing to remember is that the second expression in the for loop definition controls the loop, and can be used with any function or method that returns a `bool`, or any expression that evaluates to a `bool`. Also remember that the three expressions are all optional[^1].

```go
package main

import (
	"fmt"
)

// The Looper holds our state while looping in the for loop
type Looper struct {
	cnt int
}

func (l *Looper) Initializer() {
	fmt.Println("The loop has started!")
	l.cnt = 1
}

func (l *Looper) Checker() bool {
	fmt.Printf("Checking if cnt is greater than 5 (it's %d)\n", l.cnt)
	return l.cnt <= 5
}

func (l *Looper) Incrementer() {
	fmt.Printf("Incrementing cnt from %d to %d...\n", l.cnt, l.cnt+1)
	l.cnt++
}

func main() {
	t := Looper{}
	for t.Initializer(); t.Checker(); t.Incrementer() {
		fmt.Println("This is in the loop")
	}
	fmt.Println("Done Looping")
}

```

Running this produces the output:

```txt
The loop has started!
Checking if cnt is greater than 5 (it's 1)
This is in the loop
Incrementing cnt from 1 to 2...
Checking if cnt is greater than 5 (it's 2)
This is in the loop
Incrementing cnt from 2 to 3...
Checking if cnt is greater than 5 (it's 3)
This is in the loop
Incrementing cnt from 3 to 4...
Checking if cnt is greater than 5 (it's 4)
This is in the loop
Incrementing cnt from 4 to 5...
Checking if cnt is greater than 5 (it's 5)
This is in the loop
Incrementing cnt from 5 to 6...
Checking if cnt is greater than 5 (it's 6)
Done Looping
```

You can run this locally, or view it on [The Go Playground](https://play.golang.org/p/a0WdDAADH2h)

[^1]: https://golang.org/ref/spec#For_statements