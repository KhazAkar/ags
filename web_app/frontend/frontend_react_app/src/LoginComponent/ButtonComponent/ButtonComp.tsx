import React from 'react';
import './buttonStyle.css';

export default function ButtonComp({ text, onClickFun} : {text : string, onClickFun : Function})
{
    return(
        <div className='buttonContainer'>
            <div className='UnderButtonStyle'>
            </div>

            <div className='UpperButtonStyle' onClick={()=>{onClickFun()}}>
                {text}
            </div>
        </div>
    )
}