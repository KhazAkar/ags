import React from 'react';
import AirHumidityComponent from '../AirHumidityComponent/AirHumidityComponent.jsx';
import PowerConsumptionComponent from '../PowerConsumptionComponent/PowerConsumptionComponent.jsx';
import HumidityComponent from '../HumidityComponent/HumidityComponent.jsx';
import NPKComponent from '../NPKComponent/NPKComponent.jsx';
import ThermometerComponent from '../ThermometerComponent/ThermometerComponent.jsx';
import SystemStatusComponent from '../SystemStatusComponent/SystemStatusComponent.jsx';
import CameraFeedComponent from '../CameraFeedComponent/CameraFeedComponent.jsx';
import '../CommonComponentStyle.css';

/**
 * MainDashboard Component
 * Displays the main dashboard with all monitoring components
 */
const MainDashboardComponent = () => {
  return (
    <div className="centerGrid">
      <div className="content1">
        <AirHumidityComponent />
      </div>
      <div className="content1">
        <PowerConsumptionComponent />
      </div>
      <div className="content1">
        <HumidityComponent />
      </div>

      <div className="content2a">
        <NPKComponent />
      </div>

      <div className="content2b">
        <ThermometerComponent />
      </div>

      <div className="content2c">
        <SystemStatusComponent />
      </div>

      <div className="contentCam">
        <CameraFeedComponent />
      </div>
    </div>
  );
};

export default MainDashboardComponent;
