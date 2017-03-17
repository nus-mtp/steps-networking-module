import React from 'react';

class EventMap extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  // Adds a clickable button to the map that jumps to a project with 'id'
  static addNode(id = '#0', name = 'None', left = '0%', top = '0px') { 
    return (
      <a href={id} style={{ position: 'relative', left, top, }}>
        <button className="btn btn-secondary">
          {name}
        </button>
      </a>
    );
  }
  
  render() {
    return (
      <div>
      {
        (this.props.showEventMap) ?
        <div className="mb-3" id="event-map">
          {EventMap.addNode('#0', 'MonaLisa', '78%', '99px')}
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
