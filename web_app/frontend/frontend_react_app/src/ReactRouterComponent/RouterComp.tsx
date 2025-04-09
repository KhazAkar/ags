import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router';
import MenuComp from "../MenuComponent/MenuComp";
import RootComp from "./RootComp";
import ComandCenterComp from "../CCComponent/ComandCenterComp";
import DevicesListComp from "../DevicesListComponent/DevicesListComp";
import AccountComp from "../AccountComponent/AccountComp";
import ConfigComp from "../ConfigComponent/ConfigComp";
import LoginComp from "../LoginComponent/LoginComp";
import RegisterComp from '../RegisterComponent/RegisterComp'

interface Route {
    path: string;
    element: React.Component;
    children?: Object[];
}

let routingArray: RouteObject[] = [
    {path: '/', element: <LoginComp /> }, 
    {path: '/registration', element: <RegisterComp/>  }, 
    {path: '/app', element: <RootComp/> , children: [  //all chldrens are render inside <Outlet/> component 
        {index: true, element: <ComandCenterComp/> }, //main screen
        {path: 'account', element: <AccountComp/> }, //config account screen
        {path: 'devices', element: <DevicesListComp/> }, //list of devices (it contains a list per device with info like IP address, current status, list with events, errors etc) screen
        {path: 'config', element: <ConfigComp/> }, //page with list of controling panel for specfied devices
    ]}, 

]

const readyRouting = createBrowserRouter([...routingArray]);

export default function RouterComp ()
{
    return ( <RouterProvider router={readyRouting}/>);
}