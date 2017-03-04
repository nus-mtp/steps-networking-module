import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    var numOfEvents = 8; // Change according to num of events
    this.initial = [];
    for (var i = 0; i < numOfEvents; i++) {
      this.initial.push(false);
    }

    this.state = {
      open: this.initial,
      numOfEvents: numOfEvents,
      events: [
        {
          name: 'New Year Wild Party',
          date: '01-01-2018',
          venue: 'Adam\'s House',
          description: 'Party all night at Pasir Ris!',
        },
        {
          name: 'Geek Meet',
          date: '11-01-2017',
          venue: 'Tanjung Pagar',
          description: 'Anime, Manga fans and that-weirdo-in-the-corner meeting.',
        },
        {
          name: 'Food Trail',
          date: '04-01-2017',
          venue: 'Bedok',
          description: 'Eat till you drop!',
        },
        {
          name: 'IT Fair',
          date: '01-01-2017',
          venue: 'Geylang',
        },
        {
          name: 'STePS',
          date: '21-12-2017',
          venue: 'NUS',
        },
        {
          name: 'Ku Klux Klan Bonfire',
          date: '01-06-2017',
          venue: 'NUS',
        },
        {
          name: 'test7',
        },
        {
          name: 'test8',
        },
        {
          name: 'test9',
        },
        {
          name: 'test10',
        },
        {
          name: 'test11',
        },
      ]
    };
    this.openCollapsable = this.openCollapsable.bind(this);
  }
  
  openCollapsable(serial) {
    var new_status = this.initial.slice(); // ignore previous state and change all to false
    new_status[serial] = !this.state.open[serial];
    this.setState({ open: new_status });
  }
  
  render() {
    const containerWidth = 300;
    return (
      <div className="home-body">
        <Tabs />
        <div id="event-list" className="d-flex justify-content-center justify-content-md-start"> {
          this.state.events.map((file, i) =>
            <div id="event-container" key={i}>
              <Event
                serial={i}
                open={this.state.open}
                openCollapsable={this.openCollapsable}
                file={file}
              />
              <Collapsable 
                serial={i} 
                open={this.state.open} 
                openCollapsable={this.openCollapsable}
                width={containerWidth}
                file={file}
              />
            </div>
          )} 
        </div>
      </div>
    );
  }
}

export default HomeView;
