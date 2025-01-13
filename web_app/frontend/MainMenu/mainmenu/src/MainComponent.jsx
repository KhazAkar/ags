import './MainComponentStyle.css';
import NoteComponent from './NoteComponent/NoteComponent.jsx';
import {InitData} from './Context/InitContextData.jsx';
import TimerComponent from './TimerComponent/TimerComponent.jsx';
import PowerConsumptionComponent from './PowerConsumptionComponent/PowerConsumptionComponent.jsx';

function MainComponent() {
  return (

    <InitData.Provider value={{
      noteJSON: {},
      runTimeJSON: { day: "01", month: "01", year: "2025", hh: "00", mm: "00", ss: "00" },
      powerConsumptionJSON: {

        labelPerProbe: [
          "01.01.2025", "02.01.2025", "03.01.2025", "04.01.2025", "05.01.2025",
          "06.01.2025", "07.01.2025", "08.01.2025", "09.01.2025", "10.01.2025",
          "11.01.2025", "12.01.2025", "13.01.2025", "14.01.2025", "15.01.2025",
          "16.01.2025", "17.01.2025", "18.01.2025", "19.01.2025", "20.01.2025",
          "21.01.2025", "22.01.2025", "23.01.2025", "24.01.2025", "25.01.2025",
          "26.01.2025", "27.01.2025", "28.01.2025", "29.01.2025", "30.01.2025"
        ],

        totalPerProbe: [
          13.82, 6.98, 7.49, 2.75, 12.1, 8.4, 13.31, 4.33, 13.99, 6.43,
          8.67, 7.82, 8.24, 3.46, 9.02, 12.67, 4.1, 11.46, 5.35, 11.36,
          4.86, 9.8, 9.6, 7.94, 13.48, 10.71, 13.26, 12.37, 8.26, 10.91
        ],

        maxPerProbe: [
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00
        ],

        minPerProbe: [
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00,
          0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00
        ],

        pricePerkWh: 1.30

      }

    }}>

    <div className="MainComponent">
      {/* 3 columns one row */}
      <div className="outerGrid"> 

        {/* 1column x 1row */}
        <div className="menuGrid"> 
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>
          <div className="tempButton">

          </div>

          <div>

          </div>

          <div className="tempButton">

          </div>
        </div>

        {/* 3columns x 4rows */}
        <div className="centerGrid"> 

          <div className="content1">

          </div>
          <div className="content1">
            <PowerConsumptionComponent/>
          </div>
          <div className="content1">
            
          </div>

          <div className="content2a">
            
          </div>

          <div className="content2b">
            
          </div>

          <div className="content2c">
            
          </div>

          <div className="contentCam">
            
          </div>

        </div>

        {/* 1column x 2rows */}
        <div className="rightGrid"> 

            <div className="content4">
              <TimerComponent/>
            </div>
  
            <div className="content5">
              <NoteComponent/>
            </div>

        </div>
      </div>
    </div>
    </InitData.Provider>
  );
}

export default MainComponent;
