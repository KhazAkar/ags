import React from 'react';
import { useState, useRef, useContext } from 'react';
import {ProfileContext} from '../ConfigPanelComponent/ConfigContextComponent.jsx'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ManageSliderComponents from './ManageSliderComponents.jsx';

import TooltipSlider from './TooltipSlider.tsx';
import 'rc-slider/assets/index.css';
import './SliderComponent.css';

import { ReactComponent as Trash } from './trash-red.svg'
import { ReactComponent as Pencil } from './pencil-white.svg'
import { ReactComponent as Add } from './add-white.svg'

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SliderComponent({ children, minY, maxY, startTime, endTime, chartLabel, entryAddress, contextProfileIndex = undefined }) {

  let { sliderData, dispatchChart } = useContext(ProfileContext);
  let [update, setUpdate] = useState(0);
  let [editIndex, setEditIndex] = useState(null);

  // 
  let iii = useRef(0) //it find out the name of the panel for example TEMETARUTE etc
  while(chartLabel != sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].sliderNames )
  {
    iii.current++;
  }
  
  let minYq = sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].minY
  let maxYq = sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].maxY

  function getFromContext() {
    let newOne = [];

    for (let i = 0; i < sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].val.length; i++) {
      newOne.push({
        time: sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].time[i],
        val: sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].val[i],
        label: sliderData.controlPanelData[sliderData.currentIndex].dataset[iii.current].label[i]

      });
    }

    return newOne;
  }

  let xArray = getFromContext();
  let sliderArray = useRef( [...xArray] );
  let isCreatingNewSlider = useRef(false);
  let [hoveredIndex, setHoveredIndex] = useState(null); // New state for hovered index
  //let mathFunArray = useRef([]); //{startT:0, endT:0, formula:""}
  let downloadRef = useRef(0);


  //it is additional array to help with creating a copy beacause of error:  React Hook "useRef" is called in function "addSlider"
  //that is neither a React function component nor a custom React Hook function.
  // React component names must start with an uppercase letter.
  // React Hook names must start with the word "use"  react-hooks/rules-of-hooks
  let newArray = useRef([]);

  function generateLinearFunctionArray() {
    let coeficient = 0;
    let interceptsOfLine = 0;
    //mathFunArray.current = [];

    for (let i = 1; i < sliderArray.current.length; i++) {
      coeficient = ((sliderArray.current[i].val - sliderArray.current[i - 1].val) / (sliderArray.current[i].time - sliderArray.current[i - 1].time));
      interceptsOfLine = sliderArray.current[i - 1].val - (coeficient * sliderArray.current[i - 1].time);
      //mathFunArray.current.push({ coeficient: coeficient, interceptsOfLine: interceptsOfLine, formula: `${coeficient}x + ${interceptsOfLine}` })
    }
  }

  function editSlider(timeLabel, titleLabel, index) {
    sliderArray.current[index].time = timeLabel;
    sliderArray.current[index].label = titleLabel;

    //sort so that all sliders are on its own places
    sliderArray.current.sort((a, b) => { return a.time - b.time });

    closeEditFun();
    setEditIndex(() => null)
  }

  function addSlider(timeLabel, titleLabel) //add sliders bettwen startTime and endTime sliders in specified
  {
    newArray.current = []; //clear newArray for new shit
    let isAdded = false;

    for (let index = 0; index < sliderArray.current.length; index++) {
      if (timeLabel > sliderArray.current[index].time || isAdded) {
        newArray.current.push(sliderArray.current[index]);
      }
      else {
        newArray.current.push({ time: timeLabel, val: minY, label: titleLabel });
        isAdded = true;
        index--;
      }
    }
    sliderArray.current = [...newArray.current];
    closeCreatorFun();
    setUpdate(() => "update" + sliderArray.current.length);
  }

  function updateSlider(x, val) {

    x.val = val;
    setUpdate(() => update + 1);
  }

  function closeCreatorFun() {
    isCreatingNewSlider.current = false;
    setUpdate(() => 'CloseCraationOfSlider')
  }

  function closeEditFun() {
    setEditIndex(() => null)
  }

  function addNewSlider(changeStatus) {
    return <ManageSliderComponents role='add' roleFunction={addSlider} objArray={[...sliderArray.current]} closeCreatorFun={closeCreatorFun} />;
  }

  //--------------------------------------------------Chart JS Configuration part--------------------------------------------------
  var data = {
    labels: [...sliderArray.current.map(x => x.label)],
    datasets: [{
      label: chartLabel,
      /*formulaFun: (x) => {return 2*x*x - 10;},*/
      borderColor: "rgba(75, 192, 192, 1)",
      data: [...sliderArray.current.map(x => x.val)],
      fill: false,
      pointRadius: 5
    }]
  };

  const options = {
    datasets: {
      line: { pointRadius: 5 } // Applies to all line datasets
    },
    y: {
      min: minY,
      max: maxY
    }
  };

  function delSlider(index) {
    sliderArray.current = sliderArray.current.filter((x, i) => i !== index)
    setUpdate(() => update + 1);
  }

  function returnSlider() {
    return sliderArray.current.map((x, index) => (
      <div
        className='containerSlider'
        onMouseLeave={() => { setHoveredIndex(null); }} // Clear hover on leave
        onMouseEnter={() => { setHoveredIndex(index); }} // Set hovered index on enter
      >
        <div class='valStyleAboveSliderContainer'>
          <div class='valStyleAboveSlider'>{x.val}</div>
        </div>

        <div className='sliderPresentation'>
          <div style={{ whiteSpace: "pre-line" }} >{x.label}</div>
          <TooltipSlider

            min={minY}
            max={maxY}
            value={x.val}
            onChange={(val) => updateSlider(x, val)}
          />
          {hoveredIndex === index && ( // Check if current index is hovered
            <div className='optionPresentation'>

              <div className='clicableDiv' onClick={() => setEditIndex(() => index)}>
                <Pencil className='sizeSVG' />
              </div>

              {(index !== 0 && index !== sliderArray.current.length - 1)
                ?
                <div className='clicableDiv' onClick={() => delSlider(index)}>
                  <Trash className='sizeSVG' />
                </div>
                :
                <div>
                </div>
              }
            </div>
          )}

        </div>
        {editIndex === index ? <ManageSliderComponents role='edit' roleFunction={editSlider} objArray={[...sliderArray.current]} closeEditFun={closeEditFun} index={index} /> : <></>}
      </div>
    ));
  }

  /*
    function exportJSON() {
    generateLinearFunctionArray();
    let jsonContext = JSON.stringify({ sliders: [...sliderArray.current], }); // linearFunctions: [...mathFunArray.current] 
    let jsonBlob = new Blob([jsonContext], { type: 'application/json' }); 
    let urlData = URL.createObjectURL(jsonBlob);
    let fileName = chartLabel + "-Chart.json";

    downloadRef.current.href = urlData;
    downloadRef.current.download = fileName;
    downloadRef.current.click();
    URL.revokeObjectURL(urlData);
  }
  */

  function saveConfig()
  {
    dispatchChart({
      type:"SAVE_CONFIG",
      load: {
        label : sliderArray.current.map( obj => obj.label),
        val : sliderArray.current.map( obj => obj.val),
        time : sliderArray.current.map( obj => obj.time)
      }
      ,
      panelIndex:  iii.current
    })

  }

  function importJSON(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = (event) => {
      try {
        let recoveryObjs = JSON.parse(event.target.result);
        sliderArray.current = [...recoveryObjs.sliders];
        setUpdate(() => { return 'new file has been imported' + update })
      }
      catch (e) {
        console.log("JSON file is corrupted")
        return false;
      }
    }

    reader.readAsText(file);
  }

  return (
    <div key={sliderArray.current.length} style={{height: sliderArray.current.length*72 + 505}}className='ChartJS'>
      <div className='importExportButtons'>

        <div className='buttonClassKurwa'>
          {/*<a href={'dummyPlug.json'} ref={downloadRef}>*/}
            <button className='exportFile' onClick={() => { saveConfig() }}>
            {/*<button className='exportFile' onClick={() => { exportJSON() }}> */}
              Save Config
            </button>
          {/*</a>*/}
        </div>


        <div className='buttonClassKurwa'>
          <label className="importlabel">
            Get Config
            <input
              className="importFile"
              type="file"
              onChange={(event) => importJSON(event)}
            />
          </label>
        </div>
      </div>

      <Line data={data} options={options} />
      <div>
        {
          returnSlider()
        }
      </div>
      <div className='addContainer'>
        {isCreatingNewSlider.current
          ? addNewSlider(isCreatingNewSlider)
          :
          <div className='addButtonDiv' onClick={() => { isCreatingNewSlider.current = true; setUpdate(() => 'yes'); return 0; }}>
            <Add className='sizeSVG addButtonSVG' />
          </div>
        }
      </div>
    </div>
  );
}