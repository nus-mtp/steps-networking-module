import React from 'react';
import { Link } from 'react-router'

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return(
			<div>
				<nav className="navbar navbar-light bg-faded">
					<form className="form-inline">
						<Link to="/"><img src="resources/images/home.svg" width="30px" height="30px" alt="Home" id="brand-logo" /> </Link>
						<Link to="chat(/:userId)"> Chat </Link>
					</form>
				</nav>
				<div id="app-body">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default App;

/* // Old version
			<div>
				<nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top">
					<Link to="/"><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>
					<Link to="chat">Chat</Link>
				</nav>
				<div id="app-body">
					{this.props.children}
				</div>
			</div>
//*/