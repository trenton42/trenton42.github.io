---
title: "Migrating From Blogger"
date: 2018-12-05T21:44:57-05:00
draft: false
---

Yesterday, I suddenly remembered that I had written several posts on Blogger and forgotten all about them. I decided to migrate the content over to Hugo and take advantage of Google's [Takeout][0] program.

I wasn't really sure what I would get when exporting a blog, but I was not thrilled when I downloaded my content. Instead of a directory of HTML files, I received a single ATOM feed of all of my posts. After considering a couple of different ways I could slice up the data, I decided on a simple bash script and a tool called [XMLStarlet][1] (available in homebrew on MacOS).

Here is the script I used to convert the entries:

```bash
#!/bin/bash

# Load the entire feed into a variable
DATA=$(cat feed.atom)
# Figure out how many entries we have
COUNT=$(xml sel -t -v 'count(feed/entry)' feed.atom)

# Loop through all of the entires one by one, creating a file for each
# entry
for i in `seq 1 $COUNT`; do
    # Parse the file name. Blogger uses a format like 
    # /2013/03/my-super-post.html, but I only care about the filename,
    # not the rest of the path. I also want my file to end in .md.
    # The sed replacement at the end turns /2013/03/my-super-post.html
    # into my-super-post.md
    FILENAME=$(echo $DATA | xml sel -t -m "feed/entry[$i]" -v "blogger:filename" | sed "s|.*/||; s/\.html$/.md/")
    # Blogger also puts comments into the feed as entries (?!).
    # Let's just skip those.
    if [[ -z "$FILENAME" ]]; then continue; fi
    # This grabs an entry and builds the front-matter. Note that
    # certain things in the title will cause the yaml to fail to
    # parse, so we must wrap it in quotes. Hopefully you didn't have
    # quotes in your title (but it's not a big deal to fix if you do).
    # This also saves the front matter in a file in the current
    # directory.
    echo $DATA | xml sel -t -m "feed/entry[$i]" -o "---" -n -o 'title: "' -v title -o '"' -n -o "date: " -v published -n -o "draft: false" -n -o '---' -n -n > $FILENAME
    # Now we must take the content and un-html escape it. Fortunately,
    # xmlstarlet has an easy way to do that.
    echo $DATA | xml sel -t -m "feed/entry[$i]" -v content | xml unesc >> $FILENAME
    # tada!
done
```

Now there is just some light dusting to be done in the content (depending on how much markup was in each blog post). Also, don't forget that images will be hotlinked to Blogger, and those will probably not work if the blog is ever deleted. I went through and made sure that I had downloaded any images I used in my posts.

[0]: https://takeout.google.com/
[1]: http://xmlstar.sourceforge.net/overview.php