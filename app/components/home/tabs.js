import React from 'react';
import Tab from './tab';

const Tabs = () => (
  <div className="event-tabs">
    <ul className="nav nav-tabs justify-content-around">
      <Tab name="Ongoing" />
      <Tab name="Upcoming" />
      <Tab name="Past" />
    </ul>
  </div>
);

export default Tabs;
