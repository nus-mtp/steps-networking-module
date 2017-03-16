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
          <a href="#0" style={{ position: 'relative', left: '78%', top: '99px', }}>
            <button className="btn btn-secondary">
              MonaLisa
            </button>
          </a>
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
