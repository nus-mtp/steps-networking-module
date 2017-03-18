import React from 'react';

class EventMap extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  // Adds a clickable button to the map that jumps to a project with 'id'
  static addNode(id = '#0', name = (<div />), left = '0%', top = '0px', divStyle = {}) {
    divStyle.fontSize = '2vw';
    return (
      <a href={id} style={{position: 'absolute', left, top,}}>
        <button className="btn btn-secondary" id="event-map-pointers" style={divStyle}>
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
        <div id="event-map">
          {/*<img src='../../resources/images/sitemap.png' style={{width: '100%'}}/> */}
          {EventMap.addNode('#0', 'MonaLisa', '79%', '29%')} 
          {EventMap.addNode('#1', <div>Alan<br/>Turing's<br/>Apple</div>, '13%', '68%',
                           { backgroundColor: 'blue', color: 'white', })}
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
