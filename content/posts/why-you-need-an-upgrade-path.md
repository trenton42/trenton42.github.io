---
title: "Why You Need a Kubernetes Upgrade Path"
date: 2018-12-15T09:07:10-05:00
draft: false
tags:
    - kubernetes
---

The recent Kubernetes vulnerability [CVE-2018-1002105](https://github.com/kubernetes/kubernetes/issues/71411) should be a wake up call to any organization that is running Kubernetes, but does not have a regular update strategy in place. I won't go into detail about the vulnerability as that is well documented in many places, but what I want to focus on is the challenge of keeping your cluster up to date.

Keeping up with Kubernetes releases can certainly be challenging as it is a fairly fast moving project, and it is also somewhat complex to deploy especially on bare metal. It is critical, however, to treat your Kubernetes infrastructure in nearly the same way as you do your own code that you are deploying regularly. The problem with falling too far behind with a project like Kubernetes is that the farther behind you get, the more difficult it becomes to upgrade once a critical vulnerability is found. Depending on what version you are running, you may not be able to simply upgrade to a patched version without stepping through intermediate versions, and your tooling may need to be updated to work with the newer version.

The best way to avoid getting into this situation (i.e. falling far behind -- do not neglect taking other measures to secure your cluster) is to have an upgrade plan and process in place when installing a new cluster, or get that process going now if you are already running a cluster. Automate what you can, if only to receive notifications on new releases, and understand how cluster upgrades affect your cluster workload (you may find that many times a cluster upgrade will only affect the control plane, and will not disrupt any running pods). This rhythm can reduce the stress of dealing with updates, and greatly reduce the length of time your cluster may be exposed to vulnerabilities.