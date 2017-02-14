import React, { Component } from 'react';

export default class ChatView extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			messages: [
				this.Chat_postSelf('Turkey'),
				this.Chat_postOther('Bacon'),
				this.Chat_postSelf('Test')
			]
		};
		
		this.placeholder = 'Type a message...';
	}
	
	setMessages(text) {
		var messages = this.state.messages.slice();
		messages.push(text);
		this.setState({messages: messages});
	}
	
	Chat_postSelf (text) {
		return (
			<div className="row justify-content-end">
				<div className="col-9 form-control" id="chat-self">
					{text}
				</div>
			</div>
		);
	}

	Chat_postOther (text) {
		return (
			<div className="row">
				<div className="col-9 form-control" id="chat-other">
					{text}
				</div>
			</div>
		);
	}

	handleSubmit (event) {
		event.preventDefault();
		this.setMessages(
			this.Chat_postSelf(
				this.refs.chatinput.value
			)
		);
		this.refs.chatinput.value = '';
	}
	
	render() {
		return (
			<div className="container" id="chat-body">
				<div className="container-fluid">
					{this.state.messages}
				</div>
				<div className="fixed-bottom" id="chat-form-container">
					<div className="col-12">
						<form 
							onSubmit={this.handleSubmit.bind(this)}>
							<input
								className="form-control"  
								ref="chatinput"
								placeholder={this.placeholder}
							/>
						</form>
					</div>
				</div>
			</div>
		);
	}
}//*/
