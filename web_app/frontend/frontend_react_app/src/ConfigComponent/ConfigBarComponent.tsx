import React, {useContext } from 'react';
import ButtonComp from '../ButtonComponent/ButtonComp';
import barStyle from './ConfigBarStyle.module.css';
import svgDownload from '../resources/svg/download.svg';
import svgUpload from '../resources/svg/upload.svg';
import svgReload from '../resources/svg/reload.svg';
import DropDownComponent from './DropDownComponent'
import svgAdd from '../resources/svg/add.svg'
import svgTrash from '../resources/svg/trash.svg';
import { ProfileContext } from './ConfigContextComponent';
import DisplayEditComponent from './DisplayEditComponent';

export default function ConfigBarComponent() {
    
    let { sliderData: _ , dispatchChart, reloader } = useContext<any>(ProfileContext);

    function addNew() {
        dispatchChart({ type: "ADD_NEW_PROFILE", load: {} })
    }

    function deleteOne() {
        dispatchChart({ type: "DELETE_PROFILE", load: {} })
        reloader(new Date())
    }

    function uploadConfigDevice() {

    }

    function downloadConfigDevice() {

    }

    function refreshConnection() {

    }

    return (
        <div className={barStyle.barComponentContainer}>
            <DisplayEditComponent />
            <div className='blankdiv'>
            </div>
            <DropDownComponent reloader={reloader} />
            <ButtonComp svgPath={svgAdd} onClickFun={addNew} />
            <ButtonComp svgPath={svgTrash} onClickFun={deleteOne} upperCol={"rgb(241, 25, 61)"} underCol={"rgb(177, 23, 48)"} />
            <ButtonComp svgPath={svgDownload} onClickFun={downloadConfigDevice} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"} />
            <ButtonComp svgPath={svgUpload} onClickFun={uploadConfigDevice} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"} />
            <ButtonComp svgPath={svgReload} onClickFun={refreshConnection} upperCol={"rgb(15, 207, 255)"} underCol={"rgb(46, 110, 247)"} />
        </div>
    )
}

/*
if add button is presed down it add new position to dropdown and in left corner always is shown curenty name which can be edited with one icon with pencil and then two cancle and save
*/