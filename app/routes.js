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


const routes = {
  // base component (wrapper for the whole application).
  component: App,
  childRoutes: [
    {
      path: '/',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, Dashboard);
        } else {
          callback(null, Home);
        }
      }
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/signup',
      component: Signup,
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    },
    {
      path: '/project',
      component: Project,
    },
    {
      path: '/chat',
      component: Chat,
    },
    {
      path: '/event',
      component: Event,
    },
    {
      path: '/profile',
      component: Profile,
    },
  ]
};

export default routes;
