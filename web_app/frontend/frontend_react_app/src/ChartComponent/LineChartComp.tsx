import React, { useRef, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import style from './ChartCompStyle.module.css';

ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

interface lineChartArgs {
    children?: any,
    labelsArr: any[],
    dataSetArr: any[],
    dataSetLabelArr?: any,
    borderColorArr?: any,
    backGroundColorArr?: any,
    minY: any,
    maxY: any,
    howMany?: any
}

export function LineChartComp({children, labelsArr, dataSetArr, dataSetLabelArr, borderColorArr, backGroundColorArr, minY, maxY, howMany}:lineChartArgs) {

    const chartOptions = {
        responsive: true,
        color: 'rgb(230, 230, 230)',
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgb(85, 89, 100)',
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x' as const, // ✅ Fixed for TypeScript
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x' as const, // ✅ Fixed for TypeScript
            },
          },
        },
        scales: {
          x: {
            min: dataSetArr[0].data.length-howMany, // or an index of label
            max: dataSetArr[0].data.length,
            ticks: {
              color: 'rgb(153, 153, 153)',
            },
            grid: {
              color: 'rgba(109, 109, 109, 0.25)',
            },
          },
          y: {
            min: minY,
            max: maxY,
            ticks: {
              color: 'rgb(153, 153, 153)',
            },
            grid: {
              color: 'rgba(109, 109, 109, 0.25)',
            },
          },
        },
      };

      
    const data = {
        labels: labelsArr.map( (label) => {return label}),
        datasets: dataSetArr.map((dataset) => {return dataset})
    };

    return (
        <div className={style.chartContainer}>
            <Chart className={style.chartWindow} type="line" data={data} options={chartOptions} />
        </div>
    );
}

export function MinimalistLineChartComp({children, labelsArr, dataSetArr, dataSetLabelArr, borderColorArr, backGroundColorArr, minY, maxY, howMany}:lineChartArgs) {

    const chartOptions = {
        responsive: true,
        color: 'rgb(230, 230, 230)',
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgb(85, 89, 100)',
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x' as const, // ✅ Fixed for TypeScript
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'x' as const, // ✅ Fixed for TypeScript
            },
          },
        },
        scales: {
          x: {
            min: dataSetArr[0].data.length-howMany, // or an index of label
            max: dataSetArr[0].data.length,
            ticks: {
              color: 'rgb(153, 153, 153)',
            },
            grid: {
              color: 'rgba(109, 109, 109, 0.25)',
            },
          },
          y: {
            min: minY,
            max: maxY,
            ticks: {
              color: 'rgb(153, 153, 153)',
            },
            grid: {
              color: 'rgba(109, 109, 109, 0.25)',
            },
          },
        },
      };

      
    const data = {
        labels: labelsArr.map( (label) => {return label}),
        datasets: dataSetArr.map((dataset) => {return dataset})
    };



    return (
        <div className={style.chartContainer}>
            <Chart className={`${style.chartWindow} ${style.minimalistChartWindow} `} type="line" data={data} options={chartOptions} />
        </div>
    );
}
