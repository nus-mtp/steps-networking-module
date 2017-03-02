import React from 'react';

class Collapsable extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      numberOfEventPerRow: Math.floor((window.innerWidth - 35) / this.props.width),
      order: this.props.serial,
    };
  
    this.setLayout = this.setLayout.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.updateLayout, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout);
  }

  updateLayout() {
    this.setState({
      numberOfEventPerRow: Math.floor((window.innerWidth - 35) / this.props.width),
    });
  }
  
  setLayout() {
    let marginToDisplay = Math.abs(this.state.order % this.state.numberOfEventPerRow);
    
    return {
      width: `${this.state.numberOfEventPerRow}00%`,
      borderTop: 'none',
      marginLeft: `-${marginToDisplay}00%`,
      marginTop: '-1px',
    };
  }
  
  render() {
    let showCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse';
    
    return (
      <div style={this.setLayout()} className={showCollapse}>
        <div className="collapse-body card card-block">
          <div>
            <div id="event-title"><h6>{this.props.file.name}</h6></div>
            <div id="event-description" />
          </div>
        </div>
      </div>
    );
  }
}


Collapsable.propTypes = {
  serial: React.PropTypes.number.isRequired,
  open: React.PropTypes.array.isRequired,
  openCollapsable: React.PropTypes.func.isRequired,
  width: React.PropTypes.number.isRequired,
  file: React.PropTypes.object,
};

export default Collapsable;
