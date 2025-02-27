import React, {useRef, useContext} from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend } from "chart.js";

import zoomPlugin from 'chartjs-plugin-zoom';
import {InitData} from '../Context/InitContextData.jsx';
import './ThermometerComponentStyle.css';


function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );
  
export default function ThermometerComponent({children, ...props})
{
    let {Thermometer, labelPerProbe} = useContext(InitData);
    let {last30TempProbe} = Thermometer;

    const configRef = useRef({
        options: { 
    
            scales: {
                x: {
                    min: Math.max(0, labelPerProbe.length - 12), // Start from the last 14 columns
                    max: labelPerProbe.length, // End at the last column
                    ticks: {
                        display: false, // Hides the x-axis labels
                    }
                },
                y: {
                    
                    min: Math.min(...last30TempProbe) < 0.00 ? Math.min(...last30TempProbe) - 10 :  0.00,// Ensure the y-axis starts at or close to 0
                    max: (Math.max(...last30TempProbe) + 20)
                },
            },
        
            responsive: true,
            
            plugins: {
                legend: {
                    position: 'top',
                    display: true,

                  },
              title: {
                display: true,
                text: 'Temperature',
              },

              zoom: {
                pan: {
                    enabled: true, // Enable panning
                    mode: 'x', // Restrict to x-axis
                },
                zoom: {
                    wheel: {
                        enabled: true, // Enable zooming via the mouse wheel
                    },
                    pinch: {
                        enabled: true, // Enable pinch-to-zoom on touch devices
                    },
                    mode: 'x', // Restrict zooming to x-axis
                },
            },
            }
            ,
          },
    
          data: {
        
            labels: labelPerProbe,
            datasets: [
              {
                label: 'RequestedTemp',
                data: last30TempProbe,
                borderColor: 'rgb(158, 158, 158)',
                backgroundColor: 'rgba(83, 83, 83, 0.5)',
                datalabels: {
                    display: false
                  }
              },
              {
                label: 'CurrentTemp',
                data: labelPerProbe.map(() => getRandomInt(Math.max(...last30TempProbe))),
                borderColor: 'rgb(53, 235, 144)',
                backgroundColor: 'rgba(53, 235, 62, 0.5)',
                fill: false,
                datalabels: {
                    display: false
                  }
              },
            ],
          }
      })
    
    return (
    <div className='ThermometerContainer'>
        <div className='ThermometerGrid'>
            <div>
                <Line options={configRef.current.options} data={configRef.current.data}/>
            </div>
        
            <div className='tempDisplay'>
                <div></div>
                <div className='textValueABC'>
                    {"Current Temperature"}
                </div>
                <div className='tempValue'>
                    {last30TempProbe[29]}{"°"}
                </div>
                <div></div>
            </div>
        </div>
        
    </div>
    );

}