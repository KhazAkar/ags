import React from 'react';
import Button from '../ButtonComponent/Button.jsx';
import './ConfigBarComponentStyle.css';
import svgDownload from '../resources/download.svg';
import svgUpload from '../resources/upload.svg';
import svgReload from '../resources/reload.svg';
import DropDownComponent from './DropDownComponent.jsx'
import svgAdd from '../resources/add.svg'
import svgTrash from '../resources/trash.svg';


export default function ConfigBarComponent()
{
    return (
        <div className='barComponentContainer'>
            <div className='nameHolder'>
                <DropDownComponent/>
                <Button text={"Edit name"} svgPath={svgAdd} />
            </div>
            
            <div>
            </div>

            <DropDownComponent/>
            <Button text={"Add New"} svgPath={svgAdd} />
            <Button text={"Delete Current"} svgPath={svgTrash}   upperCol={"rgb(241, 25, 61)"} underCol={"rgb(177, 23, 48)"}/>
            <Button text={"Upload"} svgPath={svgDownload}   upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
            <Button text={"Download"} svgPath={svgUpload}   upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
            <Button text={"Reload"} svgPath={svgReload}   upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
        </div>
    )
}

/*
if add button is presed down it add new position to dropdown and in left corner always is shown curenty name which can be edited with one icon with pencil and then two cancle and save
*/