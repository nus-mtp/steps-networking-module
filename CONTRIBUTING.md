# Contributing to STePS Networking Module (SNM)

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to SNM, which is hosted in the [here](https://github.com/nus-mtp/steps-networking-module) on GitHub.
These are just guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Code of Conduct](#code-of-conduct)
  * [SNM](#snm)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)
  
[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)

## What should I know before I get started?

### Code of Conduct

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.
Please report unacceptable behavior to [adam@u.nus.edu](mailto:adam@u.nus.edu).

### SNM

SoC term Project Showcase (STePS) System has event workflow management, registration, check-in and voting modules. As the event is getting bigger, a system with a networking module to enable attendees to network meaningfully and effectively before, during and after events is necessary. The module classifies/groups users based on their interest and purpose of attending STePS, allow users to post/comment in forums of each STePS run, have personal chat with other attendees.

## How Can I Contribute?

### Reporting Bugs

We agree that our project is not tip top perfect. As such, you may experience some unwanted result. This is how the guide will come in handy to tackle the problem. In the event that you have experienced any sort of bug while using the website, please check out [this list](#how-do-i-submit-a-bug-report).

#### How Do I Submit A Bug Report

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you are sure that the bug is reproducable, please check our [current issues](https://github.com/nus-mtp/steps-networking-module/issues) here to see if someone else had noticed the bug before you. If the bug you experience had already been documented by someone else, please do not create another issue. What you can do is to include a comment in that issue. Be sure to read the [code of conduct](CODE_OF_CONDUCT.md) before posting.

If there is no issue documented pertaining to the bug you experienced, you can follow the set of guidelines below to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you open SNM website with which browser. When listing steps, **don't just say what you did, but explain how you did it**.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Of course it may sometimes be impossible to provide all the details as it would take very long. So try your best to keep it short and sweet. TL;DR style is appreciated.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SNM, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:. Please check out [this guide](#how-do-i-submit-an-enhancement-suggestion) to know how to submit an enhancement suggestion.

#### How Do I Submit An Enhancement Suggestion

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). Please ensure that the suggestion is not brought up before by checking our [current issues](https://github.com/nus-mtp/steps-networking-module/issues) here. What you can do is to include a comment in that issue. Be sure to read the [code of conduct](CODE_OF_CONDUCT.md) before posting.

If there is no issue documented pertaining to the bug you experienced, you can follow the set of guidelines below to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of SNM which the suggestion is related to. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be beneficial** to most if not all of the users. Enhancement would only be called that if it benefits the community.
* **List some other text editors or applications where this enhancement exists.**

### Your First Code Contribution

Unsure where to begin contributing to Atom? You can start by looking through these `beginner` and `help-wanted` issues:

* Beginner issues - issues which should only require a few lines of code, and a test or two.
* Help wanted issues - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

To be added later

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings
    
### Javascript Styleguide

All JavaScript must adhere to [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript). We will follow ECMAScript 6+ styles.

#### Examples
```javascript
// Old way
[1, 2, 3].map(function (x) {
   const y = x + 1;
   return x * y;
});

// New way (arrow function)
[1, 2, 3].map((x) => {
   const y = x + 1;
   return x * y;
});
```
```javascript
// Bad
var count = 1;
if (true) {
  count += 1;
}

// Good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```
