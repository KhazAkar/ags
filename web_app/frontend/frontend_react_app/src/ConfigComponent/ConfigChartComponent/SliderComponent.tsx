import React from 'react';
import { useState, useRef, useContext } from 'react';
import { ProfileContext } from '../ConfigContextComponent';
import ButtonComp from '../../ButtonComponent/ButtonComp';
import ManageSliderComponents from './ManageSliderComponents';
import TooltipSlider from './TooltipSlider';
import 'rc-slider/assets/index.css';
import './SliderComponent.css';

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

import { ReactComponent as Trash } from '../../resources/svg/trash-red.svg'
import { ReactComponent as Pencil } from '../../resources/svg/pencil-white.svg'
import Add from '../../resources/svg/add-white.svg'

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

interface SliderComponentProps {
  children?: React.ReactNode,
  minY?: number,
  maxY?: number,
  startTime?: number,
  endTime?: number,
  chartLabel?: string,
}

interface SliderItem {
  time: number;   // or string or Date? Depends on your data
  val: number;
  label: string;
};

export default function SliderComponent({ children, minY, maxY, startTime, endTime, chartLabel }: SliderComponentProps) {

  let { sliderData, dispatchChart } = useContext<any>(ProfileContext);
  let [update, setUpdate] = useState<string>("0"); //refresh the component
  let [editIndex, setEditIndex] = useState<number | null>(null);

  function findIndexOfPanel() { //look for a index for Specified component in the sliderData array
    let index = 0
    while (chartLabel !== sliderData.controlPanelData[sliderData.currentIndex].dataset[index].sliderNames) {
      index++;
    }
    return index;
  }

  let indexOfPanel = useRef(findIndexOfPanel()) //it find out the name of the panel for example TEMETARUTE etc

  function getInitSlidersFromContext() {
    let newOne = [];
    let currentIndexSlider = sliderData.controlPanelData[sliderData.currentIndex].dataset[indexOfPanel.current];

    for (let i = 0; i < currentIndexSlider.val.length; i++) {
      newOne.push({
        time: currentIndexSlider.time[i],
        val: currentIndexSlider.val[i],
        label: currentIndexSlider.label[i]
      });
    }

    return newOne;
  }

  let sliderArray = useRef<SliderItem[]>([...getInitSlidersFromContext()]); //it return a array
  let isCreatingNewSlider = useRef<boolean>(false);
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // New state for hovered index

  function editSlider(timeLabel: any, titleLabel: any, index: any) {
    
    sliderArray.current[index].time = timeLabel;
    sliderArray.current[index].label = titleLabel;

    //sort so that all sliders are on its own places
    sliderArray.current.sort((a: any, b: any) => { return a.time - b.time });

    closeEditFun();
    setEditIndex(() => null)
  }

  //it is additional array to help with creating a copy beacause of error:  React Hook "useRef" is called in function "addSlider"
  //that is neither a React function component nor a custom React Hook function.
  // React component names must start with an uppercase letter.
  // React Hook names must start with the word "use"  react-hooks/rules-of-hooks
  let newArray = useRef<any>([]);

  function addSlider(timeLabel: any, titleLabel: any) //add sliders bettwen startTime and endTime sliders in specified
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

  function updateSlider(slider: any, val: any) {
    slider.val = val;
    setUpdate(() => update + 1);
  }

  function closeCreatorFun() {
    isCreatingNewSlider.current = false;
    setUpdate(() => 'CloseCraationOfSlider')
  }

  function closeEditFun() {
    setEditIndex(() => null)
  }

  function addNewSlider(changeStatus: any) {
    return <ManageSliderComponents role='add' roleFunction={addSlider} objArray={[...sliderArray.current]} closeCreatorFun={closeCreatorFun} />;
  }

  //--------------------------------------------------Chart JS Configuration part--------------------------------------------------
  var data = {
    labels: [...sliderArray.current.map((x: any) => x.label)],
    datasets: [{
      label: chartLabel,
      borderColor: "rgba(75, 192, 192, 1)",
      data: [...sliderArray.current.map((x: any) => x.val)],
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

  function delSlider(index: any) {
    sliderArray.current = sliderArray.current.filter((x: any, i: any) => i !== index)
    setUpdate(() => update + 1);
  }


  function optionButton(fun: any, SVG: any) {
    return (
      <div className='clicableDiv' onClick={() => fun()}>
        <SVG className='sizeSVG' />
      </div>
    )
  }

  function returnSlider() {
    return sliderArray.current.map((slider: any, index: number) => (
      <div
        key = {index+index}
        className='containerSlider'
        onMouseLeave={() => { setHoveredIndex(null); }} // Clear hover on leave
        onMouseEnter={() => { setHoveredIndex(index); }} // Set hovered index on enter
      >
        <div className='valStyleAboveSliderContainer'>
          <div className='valStyleAboveSlider'>
            {slider.val}
          </div>
        </div>

        <div className='sliderPresentation'>
          <div className="sliderPresentation_label">
            {slider.label}
          </div>

          <TooltipSlider
            min={minY}
            max={maxY}
            value={slider.val}
            onChange={(val) => updateSlider(slider, val)} //when user move the circle then the new value is asigned to slider
          />

          {hoveredIndex === index && ( // Check if current index is hovered and if yes then print buttons with option and if index is > 0 and < n then also allow to delete
            <div className='optionPresentation'>
              {optionButton(() => setEditIndex(() => index), Pencil)}

              {(index > 0 && index < sliderArray.current.length - 1)
                ?
                optionButton(() => delSlider(index), Trash)
                :
                <></>}
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

  function saveConfig() {
    dispatchChart({
      type: "SAVE_CONFIG",
      load: {
        label: sliderArray.current.map((obj: any) => obj.label),
        val: sliderArray.current.map((obj: any) => obj.val),
        time: sliderArray.current.map((obj: any) => obj.time)
      }
      ,
      panelIndex: indexOfPanel.current
    })

  }

  function importJSON(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = (event: any) => {
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

  function addFun() {
    isCreatingNewSlider.current = true; setUpdate(() => 'yes');
  }

  return (

    <div key={sliderArray.current.length} style={{ height: sliderArray.current.length * 70 + 580 }} className='ChartJS'>
      <div className='importExportButtons'>
        <ButtonComp style={{ "width": "100px", "margin": "0px 10px 0px 10px" }} onClickFun={() => { saveConfig() }} text={"Save Config"} />
        <ButtonComp style={{ "width": "100px", "textDecoration": "line-through" }}
          upperCol={"rgb(119, 119, 119)"}
          underCol={"rgb(75, 75, 75)"}
          onClickFun={() => {}}
          //onClickFun={(event: any) => importJSON(event)}
          text={"Import Config"}
        />
      </div>

      <Line data={data} options={options} />

      <div>
        {returnSlider()}
      </div>

      <div className='addContainer'>
        {isCreatingNewSlider.current ?
          addNewSlider(isCreatingNewSlider)
          :
          <ButtonComp svgPath={Add}
            style={{ "maxWidth": "36px", "maxHeight": "36px", "margin": "0px 10px 0px 10px", "padding": "8px" }}
            onClickFun={() => addFun()}
          />
        }
      </div>
    </div>
  );
}