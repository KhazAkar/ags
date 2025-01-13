import React from 'react';
import './buttonStyle.css';

export default function Button({children, text, onClickFun, style=undefined, upperCol = undefined, underCol = undefined})
{

    // Conditional styling for UnderButtonStyle
    const underStyle = underCol === undefined ? {backgroundColor: "#00db80", ...style} : {backgroundColor: underCol, ...style};

    // Conditional styling for UpperButtonStyle
    const upperStyle = upperCol === undefined ? {backgroundColor: "#00b167", ...style} : {backgroundColor: upperCol,  ...style};

        
    return(
        <div style={style} className={'buttonContainer'} >
            <div className={'UnderButtonStyle'} style={underStyle}>
            </div>

            <div className={'UpperButtonStyle'} onClick={onClickFun} style={upperStyle}>
                {text}
            </div>
        </div>
    )
}