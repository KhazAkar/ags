import React, { useState, useContext } from 'react';
import {ProfileContext} from './ConfigContextComponent.jsx';
import dropdownSVG from '../resources/dropdown.svg';

import './DropDownComponentStyle.css';  // Zawiera style CSS

export default function DropDownComponent( {reloader} )
{
    let { sliderData, dispatchChart } = useContext(ProfileContext);
    const [isOpen, setIsOpen] = useState(false); // Stan, czy lista jest otwarta

    function  toggleDropdown(){
        setIsOpen(!isOpen);  // Zmieniamy stan, otwierając/zamykając listę
    };

    return (
        <div className="DropDownContainer">
            <div className={"DropDownButton"} onClick={toggleDropdown}>
                <div>
                    {sliderData.controlPanelData[sliderData.currentIndex].profileName}
                </div>
                <div>
                    <img className={"dropdownIcon"} src={dropdownSVG} alt="icon" /> 
                </div>
            </div> 
            {
            isOpen == true ? 
                (
                   <div className='DropDownMenuList'> 
                   {
                        sliderData.controlPanelData.map( (obj,index) => 
                            {
                                return(
                                    <div key={index} className='DropDownElement' onClick={ ( ) => {
                                        dispatchChart({type: "CHOOSEN_INDEX",
                                                        newIndex: index
                                        });
                                        
                                        reloader(index);
                                        toggleDropdown();
                                     }
                                    } >
                                        {obj.profileName}
                                    </div>
                                )
                            
                        }
                        )
                   }
                   </div>
                    
                ):
                (
                    <div> </div>
                )
            }

           
        </div>
    );
};

/*
 {sliderData.controlPanelData[sliderData.currentIndex].profileName}

 {   isOpen == true ? 
                {

                }
                :
                {

                }
            }
 */