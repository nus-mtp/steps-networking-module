# Installing STePS Networking Module and Development
Runs on Windows 10 and above

### Prerequisite
* Node v6.3.0 and above (https://nodejs.org/en/)
* MongoDB (https://www.mongodb.com/)
* NPM file manager (usually comes with node)

### First Installation
1. Clone the repository from Github (git@github.com:nus-mtp/steps-networking-module.git)
2. Run `npm install` at the root of the repository
3. Run `gulp` from the command line
4. Access the web application with the port displayed on the command line e.g. localhost:3000 when the port displayed is Port 3000.

### Development
Ensure that you have set path environment for ease of running MongoDB (https://superuser.com/questions/949560/how-do-i-set-system-environment-variables-in-windows-10)
1. Run MongoDB with `mongod` in the console
2. Run Mongo Client with `mongo` in the console
3. Run `gulp` from the root directory in the command line

### Building
* `gulp buildClient` to build client side code
* `gulp buildServer` to build server side code
* `gulp` builds both client and server code
* `gulp full-convert` to populate database with all STePS past data
* `gulp active-convert` to populate database with all STePS active data
