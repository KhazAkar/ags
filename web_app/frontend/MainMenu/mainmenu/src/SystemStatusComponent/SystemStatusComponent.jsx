import React from 'react';
import '../CommonComponentStyle.css';

/**
 * SystemStatus Component
 * Displays the current status of the gardening system
 */
const SystemStatusComponent = () => {
  return (
    <div className="component-container">
      <div className="placeholder-content">
        <h3>System Status</h3>
        <p>All systems operational</p>
        <p>Last update: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SystemStatusComponent;
