import React from 'react';
import {useState, useRef} from 'react';
import './ManageSliderComponents.css';
import './inputStye.css';
import Cancel from '../../resources/svg/cancel.svg';
import Done from '../../resources/svg/yes.svg';
import Button from '../../ButtonComponent/ButtonComp'


interface ManageSliderProp {
    children ?: React.ReactNode , roleFunction?: any,
         objArray ?: any ,
         closeCreatorFun?: any,
         closeEditFun?: any,
         index?: any,
         role?: any}


//it is in 95% AddNewSliderComponent with small differences
export default function ManageSliderComponents({children, roleFunction=undefined, objArray=undefined, closeCreatorFun=undefined, closeEditFun=undefined, index=undefined, role=undefined} : ManageSliderProp) //role can be 'edit' 'add'
{
    console.log("2");
    let [errorMessage,  setErrorMessage] = useState('');
    let label = useRef<any>(false);
    let hours = useRef<any>(0);
    let minutes = useRef<any>(0);
    let seconds = useRef<any>(0);

    let addHours = useRef<any>(0);
    let addMins = useRef<any>(0);

    
    let oldTime = {oldSeconds:0, oldHours: 0, oldMinutes: 0};

    if(role === 'edit') {
        oldTime.oldSeconds  = parseInt(objArray[index].time) % 60;
        oldTime.oldHours = parseInt(objArray[index].time) /3600;
        oldTime.oldMinutes = parseInt(objArray[index].time) - oldTime.oldHours*3600 - oldTime.oldSeconds/60;
    }

    function checkIfExist(timeInSec: any) {
        return objArray.some((x : any) => {return ((x.time === timeInSec) || (x.label === label.current.value) || (x.label === `${hours.current.value}:${minutes.current.value}:${seconds.current.value}`) )});
    }

    function isNumber(value : any) 
    {
        return ((typeof value === 'number') && (!isNaN(value)));
    }
    
    function checkIfExceedFrame(value: any)
    {
        let startT = objArray[0].time;
        let endT = objArray[objArray.length-1].time;

        if( (value <= startT) || (value >=  endT))
        {
            return false;
        }
        return true;
    }

    function checkIfCorrectFormat(strToCheck: any) {
        if(isNumber(parseInt(strToCheck)) )
        {
            return true;
        }
        return false;
    }

    function funAddAdditionaZero(num: any)
    {
        if(num < 10 && num >=0)
        {
            return '0' + num.toString();
        }
        else
        {
            return num.toString();
        }
    }

    function maketimeCorrectFormat()
    {
        
        if(seconds.current.value >= 60)
        {
            addMins.current = Math.floor(parseInt(seconds.current.value) / 60);
            seconds.current.value = parseInt(seconds.current.value) % 60;         
        }

        if(addMins.current >= 60)
        {
            addHours.current =  Math.floor(addMins.current/ 60);
            addMins.current = addMins.current % 60;
        }

        minutes.current.value = addMins.current + parseInt(minutes.current.value) ;

        if(minutes.current.value >= 60)
        {
            addHours.current = addHours.current + Math.floor(parseInt(minutes.current.value) / 60);
            minutes.current.value = parseInt(minutes.current.value) % 60;   
        }

        hours.current.value = parseInt(hours.current.value) + addHours.current;
    }

    function invokeFun()
    {
        let timeInSec = parseInt(hours.current.value,10) * 3600 + parseInt(minutes.current.value,10) * 60 + parseInt(seconds.current.value,10); //time from input's Ref
        setErrorMessage('');

        if(checkIfCorrectFormat(hours.current.value)) {
            if(checkIfCorrectFormat(minutes.current.value)) {
                if(checkIfCorrectFormat(seconds.current.value)) {
                    if(checkIfExceedFrame(timeInSec)) {
                        //fullfil string with 0 if some values is lower than 10
                        maketimeCorrectFormat();
                        let tempTimeLabel = funAddAdditionaZero(hours.current.value)+":"+funAddAdditionaZero(minutes.current.value)+":"+funAddAdditionaZero(seconds.current.value);

                        if(checkIfExist(timeInSec)) {
                                setErrorMessage(`Cant Resolve that request :( Label name or Time stamp already exist! `);
                            }
                            else {
                                label.current.defaultValue="def fill with time stamp"; //before it was in <input> element but due to changed in style it must be here to not cause a error
                                switch(role)
                                {
                                    case 'edit':
                                        label.current.value === "def fill with time stamp" ?  roleFunction(timeInSec, tempTimeLabel,index) : roleFunction(timeInSec,  `${label.current.value}\n(${tempTimeLabel})`, index);   
                                    break;

                                    case 'add':
                                        label.current.value === "def fill with time stamp"?  roleFunction(timeInSec, tempTimeLabel) : roleFunction(timeInSec, `${label.current.value}\n(${tempTimeLabel})`); 
                                    break;
                                } 
                            }
                    }
                    else {
                        setErrorMessage(`Can't resolve that request :( Timestamp is out of bounds!`)
                    }
                }
            }
        }
        else {
            setErrorMessage(`Can't resolve that request :( Data Format is crazy!`);
        }
    }   

    return (
        <>
        <div className='AddNewSlider'>

            <div className='inputContainer'>
                <div className='inputSliderData'>
                    <div className="form__group field">
                        <input type="input" className="form__field" placeholder="Slider name" id='SliderName' ref={label} />
                        <label htmlFor="SliderName" className="form__label">Slider name</label>
                    </div>
                {
                    role === 'add' ?
                    <>
                            <div className="form__group field">
                                <input type="input" className="form__field" placeholder="Slider name" id='Hours' ref={hours} name='HH'/>
                                <label htmlFor="Hours" className="form__label">Hours</label>
                            </div>

                            <div className="form__group field">
                                <input type="input" className="form__field" placeholder="Slider name" id='Minutes' ref={minutes} name='MM' />
                                <label htmlFor="Minutes" className="form__label">Minutes</label>
                            </div>

                            <div className="form__group field">
                                <input type="input" className="form__field" placeholder="Slider name" id='Seconds' ref={seconds} name='SS' />
                                <label htmlFor="Seconds" className="form__label">Seconds</label>
                            </div>
                    </>
                    :
                    <>
                            <div className="form__group field">
                                <input defaultValue={oldTime.oldHours} type="input" className="form__field" placeholder="Slider name" id='Hours' ref={hours} name='HH'/>
                                <label htmlFor="Hours" className="form__label">Hours</label>
                            </div>

                            <div className="form__group field">
                                <input defaultValue={oldTime.oldMinutes} type="input" className="form__field" placeholder="Slider name" id='Minutes' ref={minutes} name='MM' />
                                <label htmlFor="Minutes" className="form__label">Minutes</label>
                            </div>

                            <div className="form__group field">
                                <input defaultValue={oldTime.oldSeconds} type="input" className="form__field" placeholder="Slider name" id='Seconds' ref={seconds} name='SS' />
                                <label htmlFor="Seconds" className="form__label">Seconds</label>
                            </div>

                    </>
                }
                </div>
                
                <Button style={{"max-width": "45px", "max-height": "40px", "padding":"3px"}} svgPath={Done} onClickFun={() => invokeFun() }/>
                <Button style={{"max-width": "45px", "max-height": "40px", "padding":"3px"}} upperCol={"rgb(241, 25, 61)"} underCol={"rgb(177, 23, 48)"} svgPath={Cancel} onClickFun={ role === 'add' ? () => closeCreatorFun() : () => closeEditFun()}/>
            </div>

            <div className='ErrorWindow'>
                    <p>{errorMessage}</p>
            </div>
        </div>
        </>
    );
}