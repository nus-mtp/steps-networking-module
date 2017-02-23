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
			<div className="container form-control" id="chat-self">
				{text}
			</div>
		);
	}

	Chat_postOther (text) {
		return (
			<div className="container-fluid form-control" id="chat-other">
				{text}
			</div>
		);
	}

	handleSubmit (event) {
		var str = this.refs.chatinput.value;
		var str_strip = str.trim();
		if (str_strip.length>0) {
			var new_div = this.Chat_postSelf(this.refs.chatinput.value);
			this.addMessages(new_div);
			this.refs.chatinput.value = '';
		} else {
			this.refs.chatinput.value = str.slice(0, str.length-1);
		}
	}
	
	handleChange (event) {
		var str = this.refs.chatinput.value;
		if (str[str.length-1]=="\n") {
			this.handleSubmit.bind(this).call(event);
		}
	}
	
	scrollToBottom() {
		//window.scrollTo(1, 1)
		document.body.scrollTop = document.body.scrollHeight;
	}
	
	componentDidUpdate () {
		this.scrollToBottom();
	}
	
	render() {
		return (
			<div className="container" id="chat-body">
				<div className="container-fluid" id="chat-content-container">
					{this.state.messages}
				</div>
				<div className="fixed-bottom" id="chat-form-container">
					<textarea
						className="form-control"  
						ref="chatinput"
						id="chat-input"
						placeholder={this.placeholder}
						onChange={this.handleChange.bind(this)}
					/><button type="button" id="chat-submit-button" className="btn btn-default" 
						onClick={this.handleSubmit.bind(this)}><img id="chat-submit-image" src="../../resources/images/ic_send_24dp.png" />
					</button>
				</div>
			</div>
		);
	}
}//*/
