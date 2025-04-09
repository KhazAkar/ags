import React from "react";
import { Outlet } from "react-router-dom";
import MenuComp from "../MenuComponent/MenuComp";
import rootStyle from './RootStyle.module.css';

export default function RootComp()
{
    return(
        <div className={rootStyle.appWindow}>
            <div className={rootStyle.wrappingGrid}>
                <div className={rootStyle.leftColumnGrid}>
                    <MenuComp/>
                </div>
                
                <div className={rootStyle.centerColumnGrid}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}