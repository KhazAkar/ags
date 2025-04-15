import React, {useState, useEffect, useRef} from 'react';
import style from './TimerStyle.module.css';

export default function TimerComp()
{
    //temp value until contex design will not be accepted
    let [lastRestart, _]= useState<Date>(new Date("2025-04-12T12:00:00"));
    let [currentDate, getCurrentDate] = useState<Date>(new Date());
    let timmer = useRef<any>(null);
    let millisecondsInDay = useRef<number>(24 * 60 * 60 * 1000);

    useEffect( () => { //update the date every seconds
        timmer.current = setTimeout(() => {
            getCurrentDate(new Date())
        }, 1000)

        return () => {clearTimeout(timmer.current)}
    }
    , [currentDate])
    
    let subData:Date = new Date(currentDate.getTime() - lastRestart.getTime());

    function divHHMMSS()
    {
        let hh = subData.getUTCHours()
        let mm = subData.getUTCMinutes()
        let ss = subData.getUTCSeconds()
        return(
            <div className={style.time}>
                <div className={style.timeElement} > {`${hh < 10 ? ("0"+hh) : hh} Hours`} </div>
                <div className={style.timeElement} > {` ${mm < 10 ? ("0"+mm) : mm} Minutes`}</div>
                <div className={style.timeElement} > {`${ss < 10 ? ("0"+ss) : ss} Seconds`}</div>
            </div>
        )
    }

    function divYYYYMMDD()
    {   
        let howManyDays:number = Math.floor(subData.getTime()/ millisecondsInDay.current)
        return(
            <div>
                {`${howManyDays} Days`}
            </div>
        )
    }

    return (<div className={style.container}>
        WORKING TIME
        <div className={style.stylishString}>
            {divHHMMSS()}
            {divYYYYMMDD()}
        </div>

    </div>)
}