import {React, useState, useContext} from 'react';
import Button from '../ButtonComponent/Button.jsx';
import './ConfigBarComponentStyle.css';
import svgDownload from '../resources/download.svg';
import svgUpload from '../resources/upload.svg';
import svgReload from '../resources/reload.svg';
import DropDownComponent from './DropDownComponent.jsx'
import svgAdd from '../resources/add.svg'
import svgTrash from '../resources/trash.svg';
import {ProfileContext} from './ConfigContextComponent.jsx';
import DisplayEditComponent from './DisplayEditComponent.jsx';

export default function ConfigBarComponent()
{
    let { sliderData, dispatchChart, reloader } = useContext(ProfileContext);

    function addNew()
    {
        dispatchChart({type: "ADD_NEW_PROFILE", load:{}})
    }

    function deleteOne()
    {
        dispatchChart({type: "DELETE_PROFILE", load:{}})
        reloader(new Date())
    }

    function uploadConfigDevice()
    {
        
    }

    function downloadConfigDevice()
    {
        
    }

    function refreshConnection()
    {

    }

    return (
        <div className='barComponentContainer'>
            <DisplayEditComponent/>
            <div>
            </div>
            <DropDownComponent reloader={reloader}/>
            <Button text={"Add New"} svgPath={svgAdd} onClickFun={addNew}/>
            <Button text={"Delete Current"} svgPath={svgTrash}   onClickFun={deleteOne} upperCol={"rgb(241, 25, 61)"} underCol={"rgb(177, 23, 48)"}/>
            <Button text={"Upload"} svgPath={svgDownload}   onClickFun={downloadConfigDevice} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
            <Button text={"Download"} svgPath={svgUpload}   onClickFun={uploadConfigDevice} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
            <Button text={"Reload"} svgPath={svgReload}   onClickFun={refreshConnection} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"}/>
        </div>
    )
}

/*
if add button is presed down it add new position to dropdown and in left corner always is shown curenty name which can be edited with one icon with pencil and then two cancle and save
*/