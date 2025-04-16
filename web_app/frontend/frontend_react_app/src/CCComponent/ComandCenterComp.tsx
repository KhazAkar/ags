import React from "react";
import CCStyle from './ComandCenterStyle.module.css';
import TimerComp from '../TimerComponent/TimerComp';
import NoteModule from '../NoteComponent/NoteModule';
import { LineChartComp, MinimalistLineChartComp } from '../ChartComponent/LineChartComp';

let labelsArr = ['05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13', '05.04T13.12.13']

let dataSetArr = [{
    label: 'Aloha',
    data: [10, 20, 30, 10, 20, 30, 10, 20, 30, 40, 60, 50],
    borderColor: 'rgb(0, 250, 0)',
    fill: false,
    stepped: true
}]

let doubleDataSetArr = [{
    label: 'Ay Karamba',
    data: [10, 20, 30, 10, 20, 30, 10, 20, 30, 40, 60, 50],
    borderColor: 'rgba(75,192,192,1)',
    fill: false
},
{
    label: 'Siemaneczko',
    data: [50, 10, 30, 40, 0, 60, 40, 20, 30, 10, 60, 20],
    borderColor: 'rgb(58, 190, 46)',
    fill: false
}]

function BasicDiv({ children }: { children: React.ReactNode }) {
    return (
        <div className={CCStyle.basicStyle}>
            {children}
        </div>
    )
}

function SpanModDiv({ children }: { children: React.ReactNode }) {
    return (
        <div className={` ${CCStyle.basicStyle} ${CCStyle.content2}`}>
            {children}
        </div>
    )
}

export default function ComandCenterComp() {








    return (
        <div className={CCStyle.CCContainer}>
            <div className={CCStyle.gridWrapper}>

                {/* 3columns  4rows */}
                <div className={CCStyle.centerGrid}>

                    <BasicDiv> <LineChartComp /*TEMP*/ minY={0} maxY={60} labelsArr={labelsArr} dataSetArr={dataSetArr} howMany={5}/>  </BasicDiv> 

                    <BasicDiv> <LineChartComp /*SOIL HUMI/AIR HUMID*/ minY={0} maxY={100} labelsArr={labelsArr} dataSetArr={dataSetArr} howMany={5}/> </BasicDiv>

                    <BasicDiv> <LineChartComp /*NPK*/ minY={0} maxY={1000} labelsArr={labelsArr} dataSetArr={doubleDataSetArr} howMany={5}/>  </BasicDiv>

                    <SpanModDiv> <MinimalistLineChartComp /*WATER LVL*/minY={0} maxY={50} labelsArr={labelsArr} dataSetArr={dataSetArr} howMany={5}/> </SpanModDiv>

                    <SpanModDiv> <MinimalistLineChartComp /*AIR FLOW*/minY={0} maxY={100} labelsArr={labelsArr} dataSetArr={dataSetArr} howMany={5}/>  </SpanModDiv>

                    <SpanModDiv>  <MinimalistLineChartComp /*POWER CONSUMPTION*/ minY={0} maxY={50} labelsArr={labelsArr} dataSetArr={dataSetArr} howMany={5}/>  </SpanModDiv>

                    <div className={` ${CCStyle.basicStyle} ${CCStyle.contentCam}`}>

                    </div>

                </div>

                {/* 1column  2rows */}
                <div className={CCStyle.rightGrid}>

                    <BasicDiv> <TimerComp /> </BasicDiv>

                    <BasicDiv> <NoteModule /> </BasicDiv>

                </div>
            </div>
        </div>
    )
}