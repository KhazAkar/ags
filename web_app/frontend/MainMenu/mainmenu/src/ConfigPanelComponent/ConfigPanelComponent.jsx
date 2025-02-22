import React, {useState} from "react";
import './ConfigPanelComponentStyle.css';
import SliderComponent from "../ConfigChartComponent/SliderComponent.jsx";
import ConfigBarComponent from "./ConfigBarComponent.jsx";
import ConfigContextComponent from './ConfigContextComponent.jsx'

export default function ConfigPanelComponent()
{
  let [state, reloadConfigPage] = useState(0)
    return(
        <div className="ConfigPanelComponentCCC">
              <ConfigContextComponent reloader={reloadConfigPage}>
                 <ConfigBarComponent/>
                  <div className="outerGridCCC">
                    {/* "key" props have such a strange values because it is used to hard reset of component in case of changing the setting profile*/}
                    <SliderComponent key={state+10} minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'TEMPERATURE'}/>
                    <SliderComponent key={state+21} minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'AIR HUMIDITY'}/>
                    <SliderComponent key={state+32} minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'SOIL HUMIDITY'}/>
                    <SliderComponent key={state+43} minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'N'}/>
                    <SliderComponent key={state+54} minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'P'}/>
                    <SliderComponent key={state+65} minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'K'}/>
                  </div>
              </ConfigContextComponent>
             
              </div>
           
    )
}