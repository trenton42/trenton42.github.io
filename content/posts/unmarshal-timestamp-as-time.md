---
title: Unmarshalling a Unix timestamp to time.Time from JSON in go
date: 2020-10-17T02:34:22Z
draft: false
tags:
    - go
    - code
description: Sometimes you don't have control over how the json is formatted, but you still want native types.
---

Sometimes when working with remote APIs, you will come across dates formatted as Unix timestamps (an integer number of seconds since the epoch[^1]). Go has a very nice native type for dealing with times, though, and it would be nice to be able to directly unmarshal[^2] to that type without doing the type conversions later. Fortunately, we can do easily do this by overriding the `UnmarshalJSON` method.

To do this, we will create a custom type that embeds `time.Time`:

```go
// UnixTime is our magic type
type UnixTime struct {
	time.Time
}
```

So far, this creates our own type that can be used just like a `time.Time` instance -- all methods that you can use on `time.Time` are also available on our `UnixTime` struct.

To make our `UnixTime` time work with timestamps, we will need our `UnmarshalJSON` method:

```go
// UnmarshalJSON is the method that satisfies the Unmarshaller interface
// Note that it uses a pointer receiver. It needs this because it will be modifying the embedded time.Time instance
func (u *UnixTime) UnmarshalJSON(b []byte) error {
	var timestamp int64
	err := json.Unmarshal(b, &timestamp)
	if err != nil {
		return err
	}
	u.Time = time.Unix(timestamp, 0)
	return nil
}
```

This takes the `[]byte` representation of the integer that was provided (e.g. `638941154`), and letting the `json` package unmarshal it into a temporary variable. We then take that and set our embedded `time.Time` instance to the value returned from `time.Unix`[^3].

To reverse the process, we override the `MarshalJSON` method:

```go
// MarshalJSON turns our time.Time back into an int
func (u UnixTime) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf("%d", (u.Time.Unix()))), nil
}
```

Now you can use `UnixTime` as a field in your struct in place of `time.Time`:

```go
type DataRecord struct {
    Name     string
    Birthday UnixTime
}
```

Complete example:

```go
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

// DataRecord is our base struct
type DataRecord struct {
	Name     string
	Birthday UnixTime
}

// UnixTime is our magic type
type UnixTime struct {
	time.Time
}

// UnmarshalJSON is the method that satisfies the Unmarshaller interface
func (u *UnixTime) UnmarshalJSON(b []byte) error {
	var timestamp int64
	err := json.Unmarshal(b, &timestamp)
	if err != nil {
		return err
	}
	u.Time = time.Unix(timestamp, 0)
	return nil
}

// MarshalJSON turns our time.Time back into an int
func (u UnixTime) MarshalJSON() ([]byte, error) {
	return []byte(fmt.Sprintf("%d", (u.Time.Unix()))), nil
}

var data string = `{"name": "Bob", "birthday": 638941154}`

func main() {
	var ourData DataRecord
	json.Unmarshal([]byte(data), &ourData)
	fmt.Printf("Name:\t\t%s\nBirthday:\t%s\n\n", ourData.Name, ourData.Birthday.Format("January 02, 2006")) // Note that we can still use the Format method from time.Time
	b, _ := json.Marshal(ourData)
	fmt.Printf("And turning our struct back to json:\n\n%s\n", string(b))
}
```

Output:

```
Name:           Bob
Birthday:       March 31, 1990

And turning our struct back to json:

{"Name":"Bob","Birthday":638941154}
```

Try it out on the [golang playground](https://play.golang.org/p/ajU4j5vlTtv).

[^1]: See [The Open Group Base Specifications](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16)
[^2]: Note that `time.Time` does have an `UnmarshalJSON` method, but it expects the field to be a string in [RFC 3339 format](https://golang.org/pkg/time/#Time.UnmarshalJSON).
[^3]: Documentation for [time.Unix](https://golang.org/pkg/time/#Unix)