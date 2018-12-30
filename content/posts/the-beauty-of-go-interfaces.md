---
title: "The Beauty of Go Interfaces"
date: 2018-12-19T22:05:17-05:00
draft: true
tags:
    - go
    - code
description: Go interfaces are beautiful, but I didn't appreciate that at first.
---

When I first started writing Go code, I didn't understand the purpose of interfaces. I thought I understood what they were for, but I never bothered writing them in my own code. In fact, the only time I ran into them was in this sort of pattern:

```go

func someSuch(val interface{}) {
    // Going to handle a bunch of different input types...
}
```

I will come back to this example later on, but it demonstrates an abuse (in my opinion) of interfaces rather than a good coding pattern.

## Basics: What is an interface?

An interface can be understood by comparing it to a struct (and they do go hand in hand -- more on that later). A struct, as you know, is a collection of data. It can actually hold the data you are working with. An interface, on the other hand, does not hold any data, but describes ways of getting some data. It doesn't matter _how_ that data is retrieved, generated, or manipulated (this is important), just that the method returns whatever it is defined to return.

## A practical example

Suppose you are writing a program that queries a database for some data. You already have an idea of what database you are going to use, so you get to work writing out your methods. In the first pass, you might create a struct with the database instance as a field so it can be accessed by all of your methods, like this:

```go
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// Bloggy does the bloggy things
type Bloggy struct {
	sqlcon *sql.DB
}

// GetPost returns the body of a blog post by id
func (b *Bloggy) GetPost(id int) (string, error) {
    stmt, err := b.sqlcon.Prepare("SELECT body FROM blog WHERE id=?")
    defer stmt.Close()
	if err != nil {
		return "", err
	}
	var body string
	err = stmt.QueryRow(id).Scan(&body)
	return body, err
}

func main() {
	con, err := sql.Open("sqlite3", "./blog.db")
	defer con.Close()
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		return
	}

	b := Bloggy{sqlcon: con}

	body, err := b.GetPost(1)
	if err != nil {
		fmt.Printf("Couldn't get body: %v\n", err)
		return
	}
	fmt.Println(body)
}
```

For example sake, this is all crammed in the `main.go` file, but it works. We have a slight problem, though. This code is tightly coupled to Sqlite. What if we outgrow Sqlite? In this example, we would simply replace a few bits of code, but what if we had fully developed this application? There would be many, many places that would touch the database, and replacing them all at once could end up being an arduous task. There is another problem: how do we write tests for this code? This is where an interface can make a difference.

## Defining the Interface

First, I am going to create an interface that describes the methods that will be working with my data.

```go

type BlogManipulator interface {
    GetPost(int) (string, error)
    CreatePost(string) (int, error)
    SavePost(int, string) error
}
```

Notice that there are no references to the actual data here, only methods that will be working with my data.

## Replacing the Current Methods

Now, I will update my application definition to use the interface instead of the actual database connection.

```go
type Bloggy struct {
	blogData BlogManipulator // <- This is not a pointer!
}
```