import App from './components/app'
import Home from './components/home/homeView';
import Dashboard from './components/home/dashboardView';
import Exhibition from './components/exhibition/exhibitionView';
import Chat from './components/chat/chatView';
import Event from './components/event/eventView';
import Project from './components/project/projectView';
import Profile from './components/profile/profileView';
import Login from './components/auth/loginView';
import Signup from './components/auth/signupView';
import Auth from './database/auth';
import Paths from './paths';

const routes = {
  // base component (wrapper for the whole application).
  component: App,
  childRoutes: [
    {
      path: Paths.home,
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, Dashboard);
        } else {
          callback(null, Home);
        }
      }
    },
    {
      path: Paths.login,
      component: Login,
    },
    {
      path: Paths.signup,
      component: Signup,
    },
    {
      path: Paths.logout,
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    },
    {
      path: Paths.project,
      component: Project,
    },
    {
      path: Paths.chat,
      component: Chat,
    },
    {
      path: Paths.event,
      component: Event,
    },
    {
      path: Paths.profile,
      component: Profile,
    },
  ]
};

export default routes;
