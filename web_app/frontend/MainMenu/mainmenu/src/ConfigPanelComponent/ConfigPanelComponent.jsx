import React from "react";
import './ConfigPanelComponentStyle.css';
import SliderComponent from "../ConfigChartComponent/SliderComponent.jsx";

export default function ConfigPanelComponent()
{
    return(
        <div className="ConfigPanelComponent">
              {/* 3 columns one row */}
              <div className="outerGridC"> 
                <SliderComponent minY={0} maxY={100} startTime={0} endTime={60*60*24-1} chartLabel={'temperature'}/>
              </div>
            </div>
    )
}