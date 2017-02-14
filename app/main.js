import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './components/app'
import Home from './components/home/homeView';
import Exhibition from './components/exhibition/exhibitionView';
import Chat from './components/chat/chatView';
import Event from './components/event/eventView';
import Project from './components/project/projectView';
import Profile from './components/profile/profileView';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="exhibition(/:userId)" component={Exhibition} />
			<Route path="chat(/:userId)" component={Chat} />
			<Route path="event(/:eventId)" component={Event} />
			<Route path="project(/:projectId)" component={Project} />
			<Route path="profile(/:userId)" component={Profile} />
		</Route>
	</Router>, document.getElementById('root')
);
