import React from 'react';

class Collapsable extends React.Component {
  render() {
    let showCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse';
    return (
      <div className={showCollapse} id={"collapseExample"+this.props.serial-1} aria-expanded={this.props.open[this.props.serial]}>
        <div className="card card-block">
          <div>
            <h6>Title {this.props.serial}</h6>
            <div id="event-title" />
            <h6>Description {this.props.serial}</h6>
            <div id="event-description" />
          </div>
        </div>
      </div>
    );
  }
}

export default Collapsable;
