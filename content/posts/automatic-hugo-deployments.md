---
title: Automatic Hugo Site Deployments With CircleCI
date: 2018-12-30T17:58:01-05:00
draft: false
tags:
    - code
description: Make publishing your Hugo site completely automatic!
---

Generating static sites with Hugo is easy enough, but I wanted something a little more automated. I also wanted to deploy my site to Github Pages from another computer (or even my phone) without needing to run the hugo command locally and pushing the generated code back to Github. If you are unfamiliar with Github Pages, check out the [introduction](https://pages.github.com/).

## Prep Work -- Getting Things Set Up

[CircleCI](https://circleci.com/) uses Docker containers to run CI jobs, so I knew that I would need a Hugo image to build my site. There are quite a few listed on Docker Hub, but for completeness, I went ahead and set up my own. This step can be skipped, just specify which ever image you wish to use in your CircleCI configuration file.

```dockerfile
FROM debian:stretch
RUN apt-get update && apt-get install -y git ssh curl
ARG HUGO_VERSION="0.53"
RUN curl -L -o hugo.deb "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.deb" && dpkg -i hugo.deb
WORKDIR /site
CMD [hugo]
```

This [git repo](https://github.com/trenton42/hugo-extended-docker) is built automatically by Docker Hub, and results in the image [trenton/hugo-extended](https://hub.docker.com/r/trenton/hugo-extended).

## Building the Pipeline

### What the Pipeline Will Do

The process that this pipeline will follow should be something like this:

1. Checkout the new changes from Github
2. Checkout the output branch (`master` in my case) to another directory
3. Run Hugo to render the site sending the output to the directory containing my output branch
4. If we are going to publish, commit any changes to the output branch, and push them back to Github

### Pipeline Goals

I had a couple of goals for my pipeline deployments:

1. I want to test that any branch generates without errors.
2. I only want my main branch (which is called content) to actually publish my site.
3. I don't want rendered content to trigger CI builds.
4. I don't want the pipeline to attempt to deploy if nothing has actually changed.

### The Pipeline

My final pipeline is rather lengthy, so I will not copy it in its entirety here. You can view it on this site's [Github Repo](https://github.com/trenton42/trenton42.github.io/blob/content/.circleci/config.yml). I will point out a few key areas that relate to my goals, though.

The `workflows` section controls what jobs are actually run and when:

```yaml
workflows:
  version: 2
  build_and_deploy:
    jobs:
      - build # This job will run on any branch and fulfils goal ⓵
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: content # The deploy job will only run on the main branch for goal ⓶
```

In order to prevent the pipeline to attempt to run on my generated branch, I add the text `[ci skip]` to the commit message on my generated branch (goal ⓷).

```shell
git add . && git commit -m "Automatic deployment [ci skip]" && git push
```

Finally, to check if anything has changed (goal ⓸), I wrapped the entire command in an if statement:

```shell
if [[ -n $(git status --porcelain) ]]; then
```

### Side Notes

You might have noticed that I add an ssh key in one of the steps:

```yaml
- add_ssh_keys:
    fingerprints:
        - "cc:c9:30:35:0a:9e:22:50:67:2f:e4:61:74:6e:9b:4c"
```

This is because CircleCI will create a read only key to checkout and test your code, but I need to make a commit and push back to Github. To get around this, I created another [deploy key](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) with write permissions to this repository. If you follow these steps, you will need to change the fingerprint to match your own deploy key.

You also will see that there is a `save_cache` step and a `restore_cache` step in the two jobs. This is because each job runs in an isolated container, and has no persistent state that is preserved between the jobs. Using the cache allows me to avoid building the site twice (once in each step).

## Finished!

That's it! Now I can write a post or update templates directly on Github without needing to checkout the changes and run Hugo manually. Feel free to use and adapt this pipeline to suit your needs.