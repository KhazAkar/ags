import React from "react";
import './ConfigPanelComponentStyle.css';
import SliderComponent from "../ConfigChartComponent/SliderComponent.jsx";

export default function ConfigPanelComponent()
{
    return(
        <div className="ConfigPanelComponentCCC">
              {/* 3 columns one row */}
              <div className="outerGridCCC">
                <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'TEMPERATURE'}/>
                <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'AIR HUMIDITY'}/>
                <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'SOIL HUMIDITY'}/>
                <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'N'}/>
                <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'P'}/>
                <SliderComponent minY={0} maxY={1000} startTime={0} endTime={60*60*24-1} chartLabel={'K'}/>
              </div>
            </div>
    )
}