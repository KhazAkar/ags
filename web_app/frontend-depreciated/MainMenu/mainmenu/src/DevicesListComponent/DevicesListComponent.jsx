import React from "react";
import './DevicesListComponentStyle.css';
import Button from '../ButtonComponent/Button.jsx';

export default function DevicesListComponent()
{
    return(
        <div className="ConfigPanelComponent">
              {/* 2 columns one row */}

              <div className="outerGridC"> 
        
                {/* 3columns x 4rows */}
                <div className="centerGridC"> 
        
                  <div className="leftGridC">
                    <div>
                      get list of all aviable devices connected to server
                    </div>
                    <div className="buttonDisplay">
                        <Button text={"ADD"} onClickFun={()=>{}}/> 
                        <Button upperCol={"#C60C30"} underCol={"#FF003F"} text={"DELETE"} onClickFun={()=>{}}/> 
                    </div>
                  </div>

                </div>
        
                {/* 1column x 2rows */}
                <div className="rightGridC"> 
        
                  <div className="content4">
                    Print out all data about specified device
                  </div>
                  
                </div>

              </div>

            </div>
    )
}