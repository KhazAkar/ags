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
import './HumidityComponentStyle.css';

export default function HumidityComponent({children})
{
    let {groundHumidity} = useContext(InitData);
    let tensionRef = useRef(0.0);

    let lenghtOfArray = groundHumidity.totalPerCycle.length;

    let chartConfig= {
        options: { 
            scales: {
                x: {
                    label: "Humidity",
                    min: Math.max(0, lenghtOfArray - 12), // Start from the last 12 columns
                    max: lenghtOfArray, // End at the last column
                    ticks: {
                        display: false, // Hides the x-axis labels
                    }
                },
                y: {
                    
                    min: 0,// Ensure the y-axis starts at or close to 0
                    max: (Math.max( groundHumidity.totalPerCycle.map((obj) => {
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
                text: 'Soil Humidity',
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
        
            labels: groundHumidity.totalPerCycle.map(element => element.timeLabel),
            datasets: [
              {
                data:  groundHumidity.totalPerCycle.map(element => element.value),
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
                        <div>CURRENT % OF WATER IN SOIL</div>
                        <div>{groundHumidity.totalPerCycle[lenghtOfArray-1].value}</div>
                    </div>
                </div>
            </div>
        </div>
        );

}