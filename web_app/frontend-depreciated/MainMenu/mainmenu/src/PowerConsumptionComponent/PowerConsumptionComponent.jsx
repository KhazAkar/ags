import './PowerConsumptionComponentStyle.css';
import React, {useRef, useContext} from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import {InitData} from '../Context/InitContextData.jsx';

// Register chart.js components
ChartJS.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

export default function PowerConsumptionComponent({ children }){

    const {powerConsumption} = useContext(InitData);
    const {labelPerProbe, totalPerProbe, maxPerProbe, minPerProbe, pricePerkWh} = powerConsumption;

    const configRef = useRef({
        data: {
            labels: labelPerProbe,
            datasets: [
                {
                    label: "",
                    backgroundColor: "rgb(112, 255, 136)", // "#83BCEC",
                    borderColor: "rgb(112, 255, 136)", //"rgb(91, 134, 255)", //"rgb(255, 99, 132)",
                    data: totalPerProbe,
                },
            ]
        },

        options: {
            scales: {
                x: {
                    min: Math.max(0, labelPerProbe.length - 14), // Start from the last 14 columns
                    max: labelPerProbe.length, // End at the last column
                },
                y: {
                    min: 0.00, // Ensure the y-axis starts at or close to 0
                    max: Math.max(...totalPerProbe)
                },
            },

            plugins: {
                legend: {
                    display: false,
                },

                title: {
                    text: 'Power Consumption Per Day',
                    display: true, // Display the chart title
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

                tooltip: {
                    displayColors: false,
                    callbacks: {
                        labelColor: function (context) { return undefined },
                        label: function (context) {
                            let index = labelPerProbe.findIndex((val) => val == context.label);
                            return [`total: ${totalPerProbe[index]} kWh`,
                                //`max: ${maxPerProbe[index]}`,
                                //`min: ${minPerProbe[index]}`
                            ];
                        },
                    },
                },
            },
        }
    });


    return (
        <div className='powerConsumptionContainer'>
            <div>
                <Bar data={configRef.current.data} options={configRef.current.options} />
            </div>
            <div className='powerConsumptionValues'>

                <div className={'totalConsumed'}>
                    <div className={'childTotalConsumed1'}>
                        Total Consumed Power
                    </div>

                    <div className={'childTotalConsumed2'}>
                        {totalPerProbe.reduce((accumulator, current) => accumulator + current).toFixed(2)} kWh
                    </div>
                </div>

                <div className={'totalConsumed'}>
                    <div className={'childTotalConsumed1'}>
                        Predictional Electricity Bill
                    </div>

                    <div className={'childTotalConsumed2'}>
                        {(totalPerProbe.reduce((accumulator, current) => accumulator + current).toFixed(2) * pricePerkWh).toFixed(2)}
                    </div>
                </div>

                <div className={'totalConsumed'}>
                    <div className={'childTotalConsumed1'}>
                        Current Consumption
                    </div>

                    <div className={'childTotalConsumed2'}>
                        0.00 kWh
                    </div>
                </div>
            </div>
        </div>
    );
}