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
        <div className="mb-3" id="event-map">
          Turkey is delicious
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
