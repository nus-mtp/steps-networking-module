import React from 'react';

class EventMap extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
      {
        (this.props.showEventMap) ?
        <div>
          Stuff happens here.
        </div>
        : <div />
      }
      </div>
    );
  }
}

Event.propTypes = {
  showEventMap: React.PropTypes.bool.isRequired,
};

export default EventMap;
