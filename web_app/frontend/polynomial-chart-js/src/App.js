import './App.css';
import SliderComponent from './SliderComponent.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'temperature'}/>
      </header>
    </div>
  );
}

export default App;
