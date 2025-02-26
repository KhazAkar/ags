import { render, screen } from '@testing-library/react';
import MainComponent from './MainComponent';
import SidebarMenuComponent from './SidebarMenuComponent/SidebarMenuComponent';
import RightSidebarComponent from './RightSidebarComponent/RightSidebarComponent';

// Mock chart.js to avoid canvas errors
jest.mock('chart.js');
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mocked-chart">Mocked Chart</div>,
  Bar: () => <div data-testid="mocked-chart">Mocked Chart</div>,
  Pie: () => <div data-testid="mocked-chart">Mocked Chart</div>,
  Doughnut: () => <div data-testid="mocked-chart">Mocked Chart</div>,
}));

// Mock the components that use charts
jest.mock('./AirHumidityComponent/AirHumidityComponent', () => () => <div>Mocked AirHumidity</div>);
jest.mock('./PowerConsumptionComponent/PowerConsumptionComponent', () => () => <div>Mocked PowerConsumption</div>);
jest.mock('./HumidityComponent/HumidityComponent', () => () => <div>Mocked Humidity</div>);
jest.mock('./NPKComponent/NPKComponent', () => () => <div>Mocked NPK</div>);
jest.mock('./ThermometerComponent/ThermometerComponent', () => () => <div>Mocked Thermometer</div>);
jest.mock('./SystemStatusComponent/SystemStatusComponent', () => () => <div>Mocked SystemStatus</div>);
jest.mock('./CameraFeedComponent/CameraFeedComponent', () => () => <div>Mocked CameraFeed</div>);
jest.mock('./MainDashboardComponent/MainDashboardComponent', () => () => <div className="centerGrid">Mocked Dashboard</div>);

describe('MainComponent Tests', () => {
  test('renders main component container', () => {
    render(<MainComponent />);
    const mainElement = document.querySelector('.MainComponent');
    expect(mainElement).toBeInTheDocument();
  });

  test('renders outer grid layout', () => {
    render(<MainComponent />);
    const outerGridElement = document.querySelector('.outerGrid');
    expect(outerGridElement).toBeInTheDocument();
  });

  test('renders SidebarMenuComponent', () => {
    render(<SidebarMenuComponent />);
    const menuGridElement = document.querySelector('.menuGrid');
    expect(menuGridElement).toBeInTheDocument();
  });

  test('renders mocked MainDashboardComponent', () => {
    render(<MainComponent />);
    expect(document.querySelector('.centerGrid')).toBeInTheDocument();
  });

  test('renders RightSidebarComponent', () => {
    render(<RightSidebarComponent />);
    const rightGridElement = document.querySelector('.rightGrid');
    expect(rightGridElement).toBeInTheDocument();
  });
});
