## Changelog as of 7 April 2017

### v6.1
* Fix z-index suggestion bug
* Enable user to add links onto their profile

### v6.0
* Bug fixes
* Revamp landing page
* Functional matching
* Improve security for posting data
* Update styling to match general color

### v5.1
* Major bug fix in routing
* Fix edit profile
* Enable chat in Firefox
* Display attendees on event page
* Add link for sign up
* Enable pdf images to be displayed

### v5.0
* Fully functional chat with route: `chat/:email`
* Attendance updates are save in database
* Comments are saved and read from database
* Search is operational
* Refactor database routes
* Debug path redirection issue

### v4.0
* Server-side routing completed
* Client displays data from current database
* Client-side routing supports the following routes: `exhibition/:eventName/:exhibitionName, `event/:eventName`, `profile/:email`
* Chat includes conversation tabs with other users
* User profile is editable and changes are saved in the database
* Links between events and exhibitions are established

### v3.1
* Thumbnail images are smaller
* Projects is read from the correct file

### v3.0
* Reads events from steps database
* Enable commenting and tagging
* Enable match preview and responsive layout for matches
* Refactor database code
* Lint client side code
* Enable server side routing

### v2.0.1
* Authentication bypasses module handler due to bug

### v2.0
* Database is testable
* Object Classes for each component are created and tested
* Events layout is updated
* Matching layout is created
* Attendance and reasons for attending event is enabled

### v1.1
* Restyle navbar
* Refactor code
* Revise database components and schema
* Event Page template is ready to read data
* Chat Page template is completed
* Profile Page has enabled edit & save

### v1.0
* Users are able to register and login after registration
* Users are able to logout
* Users are able to access various pages via url. Routing is done with react-router via hash history
* Dummy profile and project page is up. Accessible via `/profile` and `/project`
