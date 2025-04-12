import React from "react";
import { Outlet } from "react-router-dom";
import NavigationComp from "../NavigationComponent/NavigationComp";
import rootStyle from './RootStyle.module.css';

export default function RootComp()
{
    return(
        <div className={rootStyle.appWindow}>
            <div className={rootStyle.wrappingGrid}>
                <div className={rootStyle.mainColumn}>
                    <NavigationComp/>
                </div>
                
                <div className={rootStyle.mainColumn}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}