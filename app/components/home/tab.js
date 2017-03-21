import React from 'react';

const Tab = ({ name }) => (
  <div className="event-tab">
    <li className="nav-item">
      <div className="nav-link">{name}</div>
    </li>
  </div>
);

Tab.propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default Tab;
