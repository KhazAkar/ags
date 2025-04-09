import React from "react";
import deviceStyle from './DevicesListStyle.module.css'

export default function DevicesListComp()
{
    return (
        <div className={deviceStyle.container}>
            <div className={deviceStyle.gridWrapper}>
                <div className={deviceStyle.temp}>
                
                </div>
                <div className={deviceStyle.temp}>
                
                </div>
            </div>
        </div>
    )
}