import React from 'react';

class App extends React.Component {
  render() {
    return(
    <div>
      <div id="app-body">
        {this.props.children}
      </div>
    </div>
    );
  }
}

export default App;
