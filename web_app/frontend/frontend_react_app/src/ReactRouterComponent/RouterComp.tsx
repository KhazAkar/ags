import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import type { RouteObject } from 'react-router';
import MenuComp from "../MenuComponent/MenuComp";
import RootComp from "./RootComp";
import ComandCenterComp from "../CCComponent/ComandCenterComp";
interface Route {
    path: string;
    element: React.Component;
    children?: Object[];
}


let routingArray: RouteObject[] = [
    {path: '/', element: <MenuComp/> }, 
    {path: '/registration', element: <MenuComp/>  }, 
    {path: '/app', element: <RootComp/> , children: [  //all chldrens are render inside <Outlet/> component 
        {index: true, element: <ComandCenterComp/> }, //main screen
        {path: 'account', element: <MenuComp/> }, //config account screen
        {path: 'devices', element: <MenuComp/> }, //list of devices (it contains a list per device with info like IP address, current status, list with events, errors etc) screen
        {path: 'config', element: <MenuComp/> }, //page with list of controling panel for specfied devices
    ]}, 

]

const readyRouting = createBrowserRouter([...routingArray]);

export default function RouterComp ()
{
    return ( <RouterProvider router={readyRouting}/>);
}