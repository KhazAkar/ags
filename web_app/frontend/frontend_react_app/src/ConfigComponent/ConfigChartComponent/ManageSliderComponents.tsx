import React from 'react';
import { useState, useRef } from 'react';
import styleManage from './ManageSliderComponents.module.css';
import inputStyle from './inputStye.module.css';
import Cancel from '../../resources/svg/cancel.svg';
import Done from '../../resources/svg/yes.svg';
import ButtonComp from '../../ButtonComponent/ButtonComp'

interface ManageSliderProp {
    children?: React.ReactNode, roleFunction?: any,
    objArray?: any,
    closeCreatorFun?: any,
    closeEditFun?: any,
    index?: any,
    role?: any
}

//it is in 95% AddNewSliderComponent with small differences
export default function ManageSliderComponents({ children, roleFunction = undefined, objArray = undefined, closeCreatorFun = undefined, closeEditFun = undefined, index = undefined, role = undefined }: ManageSliderProp) //role can be 'edit' 'add'
{
    let [errorMessage, setErrorMessage] = useState('');
    let label = useRef<any>(false);
    let hours = useRef<any>(0);
    let minutes = useRef<any>(0);
    let seconds = useRef<any>(0);

    let oldTime = { oldSeconds: 0, oldHours: 0, oldMinutes: 0 };

    if (role === 'edit') {
        let time: number = parseInt(objArray[index].time);
        oldTime.oldSeconds = time % 60;
        oldTime.oldHours = Math.floor(time / 3600);
        oldTime.oldMinutes = Math.floor((time % 3600) / 60);
    }

    function checkIfExist(timeInSec: any) {
        return objArray.some((x: any) => { return ((x.time === timeInSec) || (x.label === label.current.value) || (x.label === `${hours.current.value}:${minutes.current.value}:${seconds.current.value}`)) });
    }

    function isNumber(value: any) {
        return ((typeof value === 'number') && (!isNaN(value)));
    }

    function checkIfExceedFrame(value: number ):boolean {
        let startT:number = objArray[0].time;
        let endT:number  = objArray[objArray.length - 1].time;

        if ((value <= startT) || (value >= endT)) {
            return false;
        }
        return true;
    }

    function checkIfCorrectFormat(strToCheck: string):boolean {
        if (isNumber(parseInt(strToCheck))) {
            return true;
        }
        return false;
    }

    function funAddAdditionalZero(num: number):string // if num is for example = 9 or 4 then after that function will be pronted as 09 or 04 etc
    {
        if (num < 10 && num >= 0) {
            return '0' + num.toString();
        }
        return num.toString();
    }

    //calculate from 12:453:12 to real time 19:33:12
    function maketimeCorrectFormat() {
        let sec:number = parseInt(seconds.current.value) || 0;
        let min:number  = parseInt(minutes.current.value) || 0;
        let hr:number  = parseInt(hours.current.value) || 0;
        
        let totalSec:number = hr * 3600 + min * 60 + sec;

        seconds.current.value = totalSec % 60;
        hours.current.value = Math.floor(totalSec / 3600);
        minutes.current.value = Math.floor((totalSec % 3600) / 60);
    }

    function createNewSlider() {
        let timeInSec =
            parseInt(hours.current.value, 10) * 3600 +
            parseInt(minutes.current.value, 10) * 60 +
            parseInt(seconds.current.value, 10); //time from input's Ref

        setErrorMessage('');

        if (checkIfCorrectFormat(hours.current.value) && checkIfCorrectFormat(minutes.current.value) && checkIfCorrectFormat(seconds.current.value)) {
            if (checkIfExceedFrame(timeInSec)) {
                //fullfil string with 0 if some values is lower than 10
                maketimeCorrectFormat();
                let tempTimeLabel = funAddAdditionalZero(hours.current.value) + ":"
                    + funAddAdditionalZero(minutes.current.value) + ":"
                    + funAddAdditionalZero(seconds.current.value);

                if (checkIfExist(timeInSec)) {
                    setErrorMessage(`Cant Resolve that request :( Label name or Time stamp already exist! `);
                }
                else {
                    label.current.defaultValue = "def fill with time stamp"; //before it was in <input> element but due to changed in style it must be here to not cause a error
                    switch (role) {
                        case 'edit':
                            label.current.value === "def fill with time stamp" ? roleFunction(timeInSec, tempTimeLabel, index) : roleFunction(timeInSec, `${label.current.value}\n(${tempTimeLabel})`, index);
                            break;

                        case 'add':
                            label.current.value === "def fill with time stamp" ? roleFunction(timeInSec, tempTimeLabel) : roleFunction(timeInSec, `${label.current.value}\n(${tempTimeLabel})`);
                            break;
                    }
                }
            }
            else {
                setErrorMessage(`Can't resolve that request :( Timestamp is out of bounds!`)
            }
        }
        else {
            setErrorMessage(`Can't resolve that request :( Data Format is crazy!`);
        }
    }

    function addInputSlider(id: string, name: string, reference: any) {
        return (
            <div className={`${inputStyle.form__group} ${inputStyle.field}`}>
                <input type="input" className={inputStyle.form__field} placeholder="Slider name" id={id} ref={reference} name={name} />
                <label htmlFor={id} className={inputStyle.form__label}>{id}</label>
            </div>
        )
    }

    function editionInputSlider(defVal: number, id: string, name: string, reference: any) {
        return (
            <div className={`${inputStyle.form__group} ${inputStyle.field}`}>
                <input defaultValue={defVal} type="input" className={inputStyle.form__field} placeholder="Slider name" id={id} ref={reference} name={name} />
                <label htmlFor={name} className={inputStyle.form__label}>{id}</label>
            </div>
        )
    }

    return (
        <div className={styleManage.AddNewSlider}>
            <div className={styleManage.inputContainer}>
                <div className={styleManage.inputSliderData}>
                    {addInputSlider("SliderName", 'NAME', label)}
                    {
                        role === 'add' ?
                            <>
                                {addInputSlider("Hours", 'HH', hours)}
                                {addInputSlider("Minutes", 'MM', minutes)}
                                {addInputSlider("Seconds", 'SS', seconds)}
                            </>
                            :
                            <>
                                {editionInputSlider(oldTime.oldHours, "Hours", 'HH', hours)}
                                {editionInputSlider(oldTime.oldMinutes, "Minutes", 'MM', minutes)}
                                {editionInputSlider(oldTime.oldSeconds, "Seconds", 'SS', seconds)}
                            </>
                    }
                </div>

                <ButtonComp style={{ "width": "45px", "max-height": "40px", "padding": "8px" }}
                    svgPath={Done}
                    onClickFun={() => createNewSlider()}
                />

                <ButtonComp style={{ "max-width": "45px", "max-height": "40px", "padding": "8px" }}
                    upperCol={"rgb(241, 25, 61)"}
                    underCol={"rgb(177, 23, 48)"}
                    svgPath={Cancel}
                    onClickFun={role === 'add' ? () => closeCreatorFun() : () => closeEditFun()}
                />
            </div>
            <div className={styleManage.ErrorWindow}>
                <p>{errorMessage}</p>
            </div>
        </div>
    );
}