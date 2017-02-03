# STePS Networking Module
SoC term Project Showcase (STePS) System has event workflow management, registration, check-in and voting modules. As the event is getting bigger, a system with a networking module to enable attendees to network meaningfully and effectively before, during and after events is necessary. The module classifies/groups users based on their interest and purpose of attending STePS, allow users to post/comment in forums of each STePS run, have personal chat with other attendees.

## Setup

### Prerequisite
* Node v6.3.0 and above

### First Installation
1. Clone the repository
2. In the root directory, install the dependencies with: `npm install`
3. In the same directory, run the web server with `gulp`
4. Paste the address shown in your terminal into your browser

## Development

### Github Workflow
1. Branch from `develop` and name the branch with the issue name
2. Perform all work only on your branch
3. All commits should have <=50 characters and should be concise and accurate of your work
4. Push the main branch (the one with the issue name) to the origin after all work has been completed
5. Wait for clearance from the team (i.e. next meeting) before merging your branch into `develop`
6. Merge `develop` into `master` upon release

### Coding Standards
Lint according to `https://github.com/airbnb/javascript`
