import './MainComponentStyle.css';
import NoteComponent from './NoteComponent/NoteComponent.jsx';
import {InitData} from './Context/InitContextData.jsx';
import TimerComponent from './TimerComponent/TimerComponent.jsx';
import PowerConsumptionComponent from './PowerConsumptionComponent/PowerConsumptionComponent.jsx';
import ThermometerComponent from './ThermometerComponent/ThermometerComponent.jsx';
import NPKComponent from './NPKComponent/NPKComponent.jsx';

function MainComponent() {
  return (

    <InitData.Provider value={{
      noteJSON: {},
      runTimeJSON: { day: "01", month: "01", year: "2025", hh: "00", mm: "00", ss: "00" },

      labelPerProbeJSON: [
        "01.01.2025", "02.01.2025", "03.01.2025", "04.01.2025", "05.01.2025",
        "06.01.2025", "07.01.2025", "08.01.2025", "09.01.2025", "10.01.2025",
        "11.01.2025", "12.01.2025", "13.01.2025", "14.01.2025", "15.01.2025",
        "16.01.2025", "17.01.2025", "18.01.2025", "19.01.2025", "20.01.2025",
        "21.01.2025", "22.01.2025", "23.01.2025", "24.01.2025", "25.01.2025",
        "26.01.2025", "27.01.2025", "28.01.2025", "29.01.2025", "30.01.2025"
      ],

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
          28.82, 18.98, 34.49, 20.75, 34.1, 19.4, 29.31, 24.33, 27.99, 31.43,
          38.67, 35.82, 29.24, 29.46, 22.02, 31.67, 21.1, 35.46, 34.35, 21.36,
          18.86, 32.8, 29.6, 19.94, 43.48, 25.71, 39.26, 34.37, 26.26, 35.91
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

        pricePerkWh: 1.30,
      
      },

      ThermometerJSON: 
      {
        last30TempProbe: [
          28.82, 18.98, 34.49, 20.75, 34.1, 19.4, 29.31, 24.33, 27.99, 31.43,
          38.67, 35.82, 29.24, 29.46, 22.02, 31.67, 21.1, 35.46, 34.35, 21.36,
          18.86, 32.8, 29.6, 19.94, 43.48, 25.71, 39.26, 34.37, 26.26, 35.91

        ],
      },

      "NPKJSON":
      {
        "totalPerCycle": [
          {"timeLabel": "2025-01-01T12:45:23",
            "value":{
              "n": 134,
              "p": 221,
              "k": 845
            }
          },
          {"timeLabel": "2025-01-02T13:21:15",
            "value":{
              "n": 53,
              "p": 15,
              "k": 67
            }
          },
          {"timeLabel": "2025-01-03T15:35:46",
            "value":{
              "n": 134,
              "p": 221,
              "k": 545
            }
          },
          {"timeLabel": "2025-01-01T12:45:23",
            "value":{
              "n": 334,
              "p": 995,
              "k": 475
            }
          },
          {"timeLabel": "2025-01-01T12:45:23",
            "value":{
              "n": 125,
              "p": 421,
              "k": 512
            }
          },
          {"timeLabel": "2025-01-01T12:45:23",
            "value":{
              "n": 334,
              "p": 124,
              "k": 475
            }
          },
          {"timeLabel": "2025-01-01T12:45:23",
            "value":{
              "n": 384,
              "p": 291,
              "k": 475
            }
          },

        ]
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
            <NPKComponent/>
          </div>

          <div className="content2b">
           <ThermometerComponent/>
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
