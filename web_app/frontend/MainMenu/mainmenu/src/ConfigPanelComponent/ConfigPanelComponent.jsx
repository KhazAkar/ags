import React from "react";
import './ConfigPanelComponentStyle.css';
import SliderComponent from "../ConfigChartComponent/SliderComponent.jsx";
import ConfigBarComponent from "./ConfigBarComponent.jsx";
import ConfigContextComponent from './ConfigContextComponent.jsx'
export default function ConfigPanelComponent()
{
    return(
        <div className="ConfigPanelComponentCCC">
              <ConfigContextComponent >
                 <ConfigBarComponent/>
                <div className="outerGridCCC">
                  <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'TEMPERATURE'}/>
                  <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'AIR HUMIDITY'}/>
                  <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'SOIL HUMIDITY'}/>
                  <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'N'}/>
                  <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'P'}/>
                  <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'K'}/>
                </div>
              </ConfigContextComponent>
             
              </div>
           
    )
}