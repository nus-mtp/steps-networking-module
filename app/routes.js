import App from './components/app'
import Home from './components/home/homeView';
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
      getComponent: (nextState, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, Home);
        } else {
          callback(null, Login);
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
      getComponent: (nextState, callback) => {
        Auth.deauthenticateUser();
        callback(null, Login);
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
      component: Home,
    },
    {
      path: Paths.profile,
      component: Profile,
    },
  ]
};

export default routes;
