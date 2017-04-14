/*
   eslint-disable no-param-reassign,
*/

import React from 'react';

class EventMap extends React.Component {
  // Adds a clickable button to the map that jumps to a project with 'id' (NOT IN USE YET)
  static addNode(id = '#0', name = (<div />), left = '0%', top = '0px', divStyle = {}) {
    divStyle.fontSize = '2vw';
    return (
      <a href={id} style={{ position: 'absolute', left, top }}>
        <button className="btn btn-secondary" id="event-map-pointers" style={divStyle}>
          {name}
        </button>
      </a>
    );
  }

  render() {
    return (
      <div>
        {(this.props.showEventMap) ?
          <div id="event-map" style={{ backgroundImage: 'url(http://www.comp.nus.edu.sg/images/resources/content/mapsvenues/COM1_L1.jpg)' }} />
          : <div />
        }
      </div>
    );
  }
}

EventMap.propTypes = {
  showEventMap: React.PropTypes.bool.isRequired,
};

export default EventMap;
