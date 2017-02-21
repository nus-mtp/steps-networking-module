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
	
	addMessages(text) {
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
		var new_div = this.Chat_postSelf(this.refs.chatinput.value);
		this.addMessages(new_div);
		this.refs.chatinput.value = '';
		this.scrollToBottom();
	}
	
	handleChange (event) {
		var str = this.refs.chatinput.value;
		var str_strip = str.trim();
		if (str[str.length-1]=="\n") {
			if (str_strip.length>0) {
				this.handleSubmit.bind(this).call(event);
			} else {
				this.refs.chatinput.value = str.slice(0, str.length-1);
			}			
		}
	}
	
	scrollToBottom() {
		document.body.scrollTop = document.body.scrollHeight;
	}
	
	render() {
		return (
			<div className="container" id="chat-body">
				<div className="container-fluid">
					{this.state.messages}
				</div>
				<div className="fixed-bottom" id="chat-form-container">
					<textarea
						className="form-control"  
						ref="chatinput"
						id="chat-input"
						placeholder={this.placeholder}
						onSubmit={this.handleSubmit.bind(this)}
						onChange={this.handleChange.bind(this)}
					/>
				</div>
			</div>
		);
	}
}//*/
