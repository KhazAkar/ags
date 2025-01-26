import React from 'react';
import { useContext, useRef } from 'react';
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
import './AirHumidityComponentStyle.css';

export default function AirHumidityComponent({children})
{
    let {airHumidityJSON} = useContext(InitData);
    let tensionRef = useRef(0.0);

    let lenghtOfArray = airHumidityJSON.totalPerCycle.length;

    let chartConfig= {
        options: { 
            scales: {
                x: {
                    min: Math.max(0, lenghtOfArray - 12), // Start from the last 12 columns
                    max: lenghtOfArray, // End at the last column
                    ticks: {
                        display: false, // Hides the x-axis labels
                    }
                },
                y: {
                    
                    min: 0,// Ensure the y-axis starts at or close to 0
                    max: (Math.max( airHumidityJSON.totalPerCycle.map((obj) => {
                        return Math.max(obj.value.n, obj.value.p, obj.value.k)
                    }
                    ))
                )
                },
            },
        
            responsive: true,
            
            plugins: {
                legend: {
                    position: 'top',
                    display: false,

                  },
              title: {
                display: true,
                text: 'Air Humidity',
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
        
            labels: airHumidityJSON.totalPerCycle.map(element => element.timeLabel),
            datasets: [
              {
                data:  airHumidityJSON.totalPerCycle.map(element => element.value),
                borderColor: 'rgb(15, 207, 255)',
                backgroundColor: 'rgb(33, 82, 187)',
                tension: tensionRef.current,
                datalabels: {
                    display: false
                  }
              },
              
            ],
          }
      };


      return (
        <div className='HumidityContainer'>
            <div className='HumidityGrid'>
                <div>
                    <Line options={chartConfig.options} data={chartConfig.data}/>
                </div>
                
                <div className='SecondContainerGrid'>
                    <div className='Humidityisplay'>
                        <div>CURRENT %RH OF WATER IN AIR</div>
                        <div>{airHumidityJSON.totalPerCycle[lenghtOfArray-1].value}</div>
                    </div>
                </div>
            </div>
        </div>
        );

}