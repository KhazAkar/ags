import { createContext } from "react";

// Generate sample dates for the last 30 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('en-GB')); // Format as DD/MM/YYYY
    }
    
    return dates;
};

// Generate random data points
const generateRandomData = (min, max, count) => {
    return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
};

// Generate NPK data
const generateNPKData = (count) => {
    return Array.from({ length: count }, () => ({
        timeLabel: new Date().toISOString().split('T')[0] + 'T' + 
                   new Date().toTimeString().split(' ')[0].substring(0, 8),
        value: {
            n: Math.floor(Math.random() * 400) + 50,
            p: Math.floor(Math.random() * 400) + 50,
            k: Math.floor(Math.random() * 400) + 50
        }
    }));
};

// Generate humidity data
const generateHumidityData = (count) => {
    return Array.from({ length: count }, () => ({
        timeLabel: new Date().toISOString().split('T')[0] + 'T' + 
                   new Date().toTimeString().split(' ')[0].substring(0, 8),
        value: Math.floor(Math.random() * 70) + 20
    }));
};

// Default context data
const defaultContextData = {
    note: {},
    runTime: { day: "01", month: "01", year: "2025", hh: "00", mm: "00", ss: "00" },
    labelPerProbe: generateDates(),
    
    powerConsumption: {
        labelPerProbe: generateDates(),
        totalPerProbe: generateRandomData(15, 45, 30),
        maxPerProbe: Array(30).fill(0),
        minPerProbe: Array(30).fill(0),
        pricePerkWh: 1.30,
    },
    
    Thermometer: {
        last30TempProbe: generateRandomData(15, 45, 30),
    },
    
    groundHumidity: {
        totalPerCycle: generateHumidityData(7),
    },
    
    airHumidity: {
        totalPerCycle: generateHumidityData(7),
    },
    
    NPK: {
        totalPerCycle: generateNPKData(7),
    }
};

export const InitData = createContext(defaultContextData);