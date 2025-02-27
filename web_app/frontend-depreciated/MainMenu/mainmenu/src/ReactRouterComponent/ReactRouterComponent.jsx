import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ConfigPanelComponent from '../ConfigPanelComponent/ConfigPanelComponent.jsx';
import RootComponent from './RootComponent.jsx'
import MainComponent from '../MenuComponent/MenuComponent.jsx';
import AccountComponentComponent from '../AccountComponent/AccountComponent.jsx';
import DevicesListComponent from '../DevicesListComponent/DevicesListComponent.jsx';
import Login from '../LoginPage/LoginComponent/Login.jsx'
import Register from '../RegisterPage/RegisterComponent/Register.jsx'
const XrouterX = createBrowserRouter([
    {
        path: '/', element: <Login/>
    },

    { 
        path: '/register', element: <Register/> 
    },

    {
        path: '/app',
        element: <RootComponent />, children: [
            { index: true, element: <MainComponent/> },
            { path: 'config', element: <ConfigPanelComponent/>  },
            { path: 'account', element: <AccountComponentComponent/>  },
            { path: 'devices', element: <DevicesListComponent/>}
        ],

    }
]);


export default function ReactRouterComponent({}) {
  return (
    <div>
        <RouterProvider router={XrouterX} />
    </div>
  );
}
