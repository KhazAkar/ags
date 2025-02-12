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
import './NPKComponentStyle.css';

export default function NPKComponent({children, ...props})
{
    let {NPKJSON} = useContext(InitData);
    let {totalPerCycle} = NPKJSON;
    let tensionRef = useRef(0.35);

    const configRef = useRef({
            options: { 
        
                scales: {
                    x: {
                        min: Math.max(0, totalPerCycle.length - 12), // Start from the last 12 columns
                        max: totalPerCycle.length, // End at the last column
                        ticks: {
                            display: false, // Hides the x-axis labels
                        }
                    },
                    y: {
                        
                        min: 0,// Ensure the y-axis starts at or close to 0
                        max: (Math.max( totalPerCycle.map((obj) => {
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
                        display: true,
    
                      },
                  title: {
                    display: true,
                    text: 'NPK',
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
            
                labels: totalPerCycle.map( (element) => {return (element.timeLabel)}),
                datasets: [
                  {
                    label: 'N',
                    data:  totalPerCycle.map( (element) => {return (element.value.n)}),
                    borderColor: 'rgb(15, 207, 255)',
                    backgroundColor: 'rgb(33, 82, 187)',
                    tension: tensionRef.current,
                    datalabels: {
                        display: true
                      }
                  },
                  {
                    label: 'P',
                    data:  totalPerCycle.map( (element) => {return (element.value.p)}),
                    borderColor: 'rgb(56, 255, 82)',
                    backgroundColor: 'rgb(40, 172, 47)',
                    fill: false,
                    tension: tensionRef.current,
                    datalabels: {
                        display: true
                      }
                  },
                  {
                    label: 'K',
                    data:  totalPerCycle.map( (element) => {return (element.value.k)}),
                    borderColor: 'rgb(255, 184, 53)',
                    backgroundColor: 'rgb(224, 143, 21)',
                    fill: false,
                    tension: tensionRef.current,
                    datalabels: {
                        display: true
                      }
                  },
                ],
              }
          })
        

        /*
            Instead of N P K like string use SVG icons and some fine fonts
        */
        return (
        <div className='NPKContainer'>
            <div className='NPKGrid'>
                <div>
                    <Line options={configRef.current.options} data={configRef.current.data}/>
                </div>
                
                <div className='SecondContainerGrid'>
                    <div className='NPKDisplay'>
                        <div>CURRENT NPK</div>
                        <div>N</div>
                        <div>{totalPerCycle[totalPerCycle.length-1].value.n}</div>
                        <div>P</div>
                        <div>{totalPerCycle[totalPerCycle.length-1].value.p}</div>
                        <div>K</div>
                        <div>{totalPerCycle[totalPerCycle.length-1].value.k}</div>
                    </div>
                </div>
            </div>
        </div>
        );
}