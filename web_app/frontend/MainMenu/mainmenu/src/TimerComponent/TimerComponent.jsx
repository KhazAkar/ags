import React, { useEffect } from "react";
import { useContext, useRef, useState } from "react";
import {InitData} from '../Context/InitContextData.jsx';
import './TimerComponentStyle.css';

export default function TimerComponent({children})
{
    let initContextData = useContext(InitData);
    let initDate = {...initContextData.runTimeJSON}
    let timeout = useRef(null);

    let currentDateOBJ = useRef(new Date());

    let [howLong, setHowLong] = useState({
        year : String(currentDateOBJ.current.getFullYear() - initDate.year).padStart(4,'0'), // Year
        month : String(currentDateOBJ.current.getMonth() + 1 - initDate.month).padStart(2,'0'), // Month (0-indexed, so add 1)
        day : String(currentDateOBJ.current.getDate() - initDate.day).padStart(2,'0'), // Day of the month
        hours : String(currentDateOBJ.current.getHours() - initDate.hh).padStart(2,'0') , // Hours
        minutes : String(currentDateOBJ.current.getMinutes() - initDate.mm).padStart(2,'0') , // Minutes
        seconds : String(currentDateOBJ.current.getSeconds() - initDate.ss).padStart(2,'0') , // Seconds
        })


    useEffect(()=>
    {
        timeout.current = setTimeout(()=>
        {
                currentDateOBJ.current = new Date();
                
                setHowLong(()=>{ return{
                    year : String(currentDateOBJ.current.getFullYear() - initDate.year).padStart(4,'0'), // Year
                    month : String(currentDateOBJ.current.getMonth() + 1 - initDate.month).padStart(2,'0'), // Month (0-indexed, so add 1)
                    day : String(currentDateOBJ.current.getDate() - initDate.day).padStart(2,'0'), // Day of the month
                    hours : String(currentDateOBJ.current.getHours() - initDate.hh).padStart(2,'0') , // Hours
                    minutes : String(currentDateOBJ.current.getMinutes() - initDate.mm).padStart(2,'0') , // Minutes
                    seconds : String(currentDateOBJ.current.getSeconds() - initDate.ss).padStart(2,'0') , // Seconds
                    }})

        }, 1000 )
        
        return(()=> clearTimeout(timeout.current));

    }, [howLong] )

    return(
        <div className={"timerComponentContainer"}>
           <div className={"timerDisplay"}>
            <div className="upperText">
                {howLong.year} : {howLong.month} : {howLong.day} : {howLong.hours} : {howLong.minutes} : {howLong.seconds}
            </div>
            <div className="underText">
                ELAPSED
            </div>
           </div>

            <div className={"timerDisplay"}>
            <div className="upperText">
                {initDate.year} : {initDate.month} : {initDate.day} : {initDate.hh} : {initDate.mm} : {initDate.ss}
            </div>
            <div className="underText">
                CONFIG DATE
            </div>
            </div>
           
           
        </div>
    )
}