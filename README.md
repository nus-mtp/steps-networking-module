# STePS Networking Module
SoC term Project Showcase (STePS) System has event workflow management, registration, check-in and voting modules. As the event is getting bigger, a system with a networking module to enable attendees to network meaningfully and effectively before, during and after events is necessary. The module classifies/groups users based on their interest and purpose of attending STePS, allow users to post/comment in forums of each STePS run, have personal chat with other attendees.

* Live Application: https://steps-networking-module.herokuapp.com/#/
* Marketing Video: https://youtu.be/VcYoUWKSM5Q
* Feature Demo: https://youtu.be/dJWbNUfT8FA

## Setup
View [Installation Guidelines](./INSTALL.md) for more information.

### Pre-requisite
* Node v6.3.0 and above
* NPM file manager
* MongoDB

### Installation
1. Clone the repository
2. In the root directory, install the dependencies with: `npm install`
3. In the same directory, run the web server with `gulp`
4. Paste the address shown in your terminal into your browser

## Development
View [Contributing Guidelines](./CONTRIBUTING.md) to find out how to contribute to this project.

Also, check out our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Developer's Guide](./documentation/DevGuide.pdf)  before contributing.

### Vagrant Environment
A Vagrantfile has been added into the project root. Run ```vagrant up``` from a CLI to obtain a Vagrant Box that has:
* Node v6.9.5
* MongoDB - with some sample STePs data inside.
* Git

For full setup, refer to the setup.txt in the Desktop folder.

### Coding Standards
Lint according to https://github.com/airbnb/javascript

### Version Standards
Version numbering according to http://semver.org/

## Licenses
[MIT License](./LICENSE.md)
