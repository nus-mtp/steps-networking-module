import React from 'react';

const Dashboard = ({ secretData }) => (
  <div>
    Hello World! {secretData}
  </div>
);

Dashboard.propTypes = {
  secretData: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]).isRequired,
};

export default Dashboard;
