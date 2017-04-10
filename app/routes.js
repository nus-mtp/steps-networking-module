import App from './components/app';
import Home from './components/home/homeView';
import Chat from './components/chat/chatView';
import Event from './components/event/eventView';
import Exhibition from './components/exhibition/exhibitionView';
import Profile from './components/profile/profileView';
import Login from './components/auth/loginView';
import Signup from './components/auth/signupView';
import Match from './components/profile/match';
import Search from './components/search/searchView';
import NotFound from './components/home/notFound';
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
      },
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
      },
    },
    {
      path: Paths.exhibition,
      component: Exhibition,
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
    {
      path: Paths.match,
      component: Match,
    },
    {
      path: Paths.search,
      component: Search,
    },
    {
      path: Paths.all,
      getComponent: (nextState, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, NotFound);
        } else {
          callback(null, Login);
        }
      },
    },
  ],
};

export default routes;
