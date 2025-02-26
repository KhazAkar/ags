import React from 'react';
import './MainComponentStyle.css';
import './CommonComponentStyle.css';
import {InitData} from './Context/InitContextData.jsx';
import SidebarMenuComponent from './SidebarMenuComponent/SidebarMenuComponent.jsx';
import MainDashboardComponent from './MainDashboardComponent/MainDashboardComponent.jsx';
import RightSidebarComponent from './RightSidebarComponent/RightSidebarComponent.jsx';

/**
 * Main Component
 * The root component that organizes the layout of the application
 */
function MainComponent() {
  return (
    <InitData.Provider value={InitData._currentValue}>
      <div className="MainComponent">
        <div className="outerGrid">
          <SidebarMenuComponent />
          <MainDashboardComponent />
          <RightSidebarComponent />
        </div>
      </div>
    </InitData.Provider>
  );
}

export default MainComponent;
