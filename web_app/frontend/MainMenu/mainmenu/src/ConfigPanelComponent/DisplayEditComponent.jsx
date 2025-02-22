import { React, useState, useContext } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import { ProfileContext } from './ConfigContextComponent.jsx';
import svgEdit from '../resources/edit.svg';
import svgSave from '../resources/yes.svg';
import svgCancel from '../resources/cancel.svg';

import './DisplayEditComponentStyle.css';

export default function DisplayEditComponent() {
    let { sliderData, dispatchChart, reloader } = useContext(ProfileContext);
    let [isEdit, toggleState] = useState(false);
    let [newName, setNewName] = useState("");
    let [innerReload, setinnerReload] = useState("");
    return (
        <div className={"nameHolder"}>
            {
                isEdit == false ? (    
                
                
                <div className={"nameHolderForActivate"} >
                    <div className={"namePlaceHolder"}>{sliderData.controlPanelData[sliderData.currentIndex].profileName}</div>
                    <Button text={"Edit name"} onClickFun={()=>{ setNewName(sliderData.controlPanelData[sliderData.currentIndex].profileName); toggleState(true)}} svgPath={svgEdit} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"} />
                    
                    <Button onClickFun={
                        ()=>{
                            toggleState(false)
                            dispatchChart(
                                {
                                type: "CHANGE_ACTIVE_PROGRAM",
                                load: {}
                            })
                            setinnerReload(newName + "holder")
                        } }
                        text={ sliderData.currentIndex == sliderData.activeProfile ? "Current SetUp" : "Activate"}
                        upperCol = { sliderData.currentIndex == sliderData.activeProfile ? "rgb(100, 100, 100)" : "#00db80" }
                        underCol = { sliderData.currentIndex == sliderData.activeProfile ? "rgb(53, 53, 53)" : "#00b167"}
                        />

                </div>
                

            ) :
            (
                 
                <div className={"nameHolderFor3"} >
                    <input defaultValue={sliderData.controlPanelData[sliderData.currentIndex].profileName} onChange={(event)=>{ 
                        setNewName(event.target.value)
                    }} 
                    />
                    <Button text={"save name"} onClickFun={()=>{dispatchChart({
                            type: "SET_NEW_NAME",
                            load: {
                                newProfileName: newName
                            }
                            
                        });
                        toggleState(false);
                        reloader(newName);
                    }} 
                        svgPath={svgSave} />
                    <Button text={"Edit name"} onClickFun={()=>{toggleState(false)}} svgPath={svgCancel} upperCol={"rgb(241, 25, 61)"} underCol={"rgb(177, 23, 48)"} />
                </div>  

            )
        }
        </div>
    )
}