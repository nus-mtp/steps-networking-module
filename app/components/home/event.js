import React from 'react';

class Event extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(event) {
    this.props.openCollapsable(this.props.serial);
  }
  
  render() {
    let style = (this.props.open[this.props.serial]) ? { borderBottom: 'none' } : {};
    
    return (
      <div id="event-info">
        <div onClick={this.handleClick} style={style} className="event-picture card" href={"#collapseExample"+this.props.serial}
           aria-expanded={this.props.open[this.props.serial]} aria-controls={"collapseExample"+this.props.serial}>
          <img id="event-poster" className="img-fluid text-center event-poster card-img-top" src="../../resources/images/dummy-poster.png" alt="Event picture" />
          <div className="card-block">
            <div className="card-title event-title">{this.props.file.name}</div>
            <div className="event-info">{this.props.file.date}</div>
            <div className="event-info">{this.props.file.venue}</div>
          </div>
        </div>
    </div>
    );
  }
}

Event.propTypes = {
  serial: React.PropTypes.number.isRequired,
  open: React.PropTypes.array.isRequired,
  openCollapsable: React.PropTypes.func.isRequired,
  file: React.PropTypes.object,
};

export default Event;
