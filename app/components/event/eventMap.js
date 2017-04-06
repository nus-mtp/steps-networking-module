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
        {(this.props.showEventMap) ?
          <div id="event-map" style={{backgroundImage: 'url(http://www.comp.nus.edu.sg/images/resources/content/mapsvenues/COM1_L1.jpg)'}}>
            {/*
            {EventMap.addNode('#0', 'SearchParty VR', '75%', '29%')} 
            {EventMap.addNode('#1', <div>Reality<br/>Escape<br/>Room</div>, '13%', '68%',
                            { backgroundColor: 'blue', color: 'white', } )}
            */}
          </div>
          : <div />
        }
        {/*
        <button className="btn btn-info" data-toggle="modal" data-target="#sitemap">Sitemap</button>
        <div className="modal fade" id="sitemap" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Event Name</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <img className="img-fluid" src="../resources/images/dummy-floorplan.jpg"/>
              </div>
            </div>
          </div>
        </div>*/}
      </div>
    );
  }
}

Event.propTypes = {
  showEventMap: React.PropTypes.bool.isRequired,
};

export default EventMap;
