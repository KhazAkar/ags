import React, { useState } from "react";
import configPanelStyle from './ConfigStyle.module.css';
import SliderComponent from "./ConfigChartComponent/SliderComponent";
import ConfigBarComponent from "./ConfigBarComponent";
import ConfigContextComponent from './ConfigContextComponent'

export default function ConfigComp() {
    let [state, reloadConfigPage] = useState<any>(0);
    return (
        <div className={configPanelStyle.container}>

            <div className={configPanelStyle.gridWrapper}>
                <ConfigContextComponent reloader={reloadConfigPage}>
                    <ConfigBarComponent />
                    <div className={configPanelStyle.outerGridCCC}>
                        {/* "key" props have such a strange values because it is used to hard reset of component in case of changing the setting profile*/}
                        <SliderComponent key={state + 10} minY={0} maxY={100} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'TEMPERATURE'} />
                        <SliderComponent key={state + 21} minY={0} maxY={100} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'AIR HUMIDITY'} />
                        <SliderComponent key={state + 32} minY={0} maxY={100} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'SOIL HUMIDITY'} />
                        <SliderComponent key={state + 43} minY={0} maxY={1000} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'N'} />
                        <SliderComponent key={state + 54} minY={0} maxY={1000} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'P'} />
                        <SliderComponent key={state + 65} minY={0} maxY={1000} startTime={0} endTime={60 * 60 * 24 - 1} chartLabel={'K'} />
                    </div>
                </ConfigContextComponent>

            </div>
        </div>
    )
}