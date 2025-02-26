import React from 'react';
import TimerComponent from '../TimerComponent/TimerComponent.jsx';
import NoteComponent from '../NoteComponent/NoteComponent.jsx';
import '../CommonComponentStyle.css';

/**
 * RightSidebar Component
 * Displays the right sidebar with timer and notes
 */
const RightSidebarComponent = () => {
  return (
    <div className="rightGrid">
      <div className="content4">
        <TimerComponent />
      </div>
      <div className="content5">
        <NoteComponent />
      </div>
    </div>
  );
};

export default RightSidebarComponent;
