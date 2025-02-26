import React from 'react';
import '../CommonComponentStyle.css';

/**
 * CameraFeed Component
 * Displays the camera feed from the gardening system
 */
const CameraFeedComponent = () => {
  return (
    <div className="component-container">
      <div className="placeholder-content">
        <h3>Camera Feed</h3>
        <p>Live feed not available</p>
        <button onClick={() => console.log("Connect camera clicked")}>
          Connect Camera
        </button>
      </div>
    </div>
  );
};

export default CameraFeedComponent;
