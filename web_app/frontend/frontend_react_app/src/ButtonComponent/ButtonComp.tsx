import React from 'react';
import styleModule from './ButtonStyle.module.css';

interface ButtonProps { 
    children?: React.ReactNode,
    text?: string,
    onClickFun?: any, //it was Function but idk what kind of type it is
    style?: Object,
    svgPath?: string,
    upperCol?: string,
    underCol?: string};

export default function Button({children, text, onClickFun, style={}, svgPath ='', upperCol ='', underCol =''}: ButtonProps)
{
    // Conditional styling for UnderButtonStyle
    const underStyle = underCol === '' ? {backgroundColor: "#00b167", ...style} : {backgroundColor: underCol, ...style};

    // Conditional styling for UpperButtonStyle
    const upperStyle = upperCol === '' ? {backgroundColor: "#00db80", ...style} : {backgroundColor: upperCol,  ...style};

    return(
        <div style={style} className={styleModule.buttonContainer} >
            
            <div className={`${styleModule.buttonBASE} ${styleModule.upperButtonStyle}`} onClick={onClickFun} style={upperStyle}>
                { svgPath !== '' ? <img className={"imgSvg"} src={svgPath} alt="icon" /> : text }
            </div>

            <div className={`${styleModule.buttonBASE} ${styleModule.underButtonStyle}`} style={underStyle}>
            </div>
        </div>
    )
}