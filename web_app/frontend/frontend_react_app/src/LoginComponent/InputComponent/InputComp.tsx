import React from "react";
import './inputStyle.css';
import { forwardRef } from 'react';

const InputComp = forwardRef(function Input(props : any, ref: any) //props which are avaiable to pass: 'text' 
{
    let {children , text, isError, isHide = false} : {children :React.ReactNode, text : string, isError:boolean, isHide?:boolean} = props;

    return (
        <div className="inputContainer">
            <div className={`form__group field${isError == true ? " error" : ""}`} >
                <input type={ (isHide == true) ? "password" : "input"} className="form__field" placeholder="Slider name" id={`${text}+Name`} ref={ref}/>

                <label htmlFor={`${text}+Name`} className="form__label">{text}</label>
            </div>
        </div>
    );
});

export default InputComp;