import React from "react";
import './AccountComponentStyle.css';

export default function AccountComponentComponent()
{
    return(
      <div className="ConfigPanelComponent">
            {/* 3 columns one row */}
            <div className="outerGridC"> 
      
              {/* 3columns x 4rows */}
              <div className="centerGridC"> 
      
                <div className="content1">
                
                </div>
                <div className="content1">
                
                </div>
                <div className="content1">
                
                </div>
      
                <div className="content2a">
                  
                </div>
      
                <div className="content2b">
                
                </div>
      
                <div className="content2c">
                  
                </div>
      
                <div className="contentCam">
                  
                </div>
      
              </div>
      
              {/* 1column x 2rows */}
              <div className="rightGridC"> 
      
                  <div className="content4">
                    
                  </div>
        
                  <div className="content5">
                    
                  </div>
      
              </div>
            </div>
          </div>
    )
}