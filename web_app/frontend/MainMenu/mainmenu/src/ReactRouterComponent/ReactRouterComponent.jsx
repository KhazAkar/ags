import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ConfigPanelComponent from '../ConfigPanelComponent/ConfigPanelComponent.jsx';
import RootComponent from './RootComponent.jsx'
import MainComponent from '../MenuComponent/MenuComponent.jsx';

const XrouterX = createBrowserRouter([
    {
        path: '/',
        element: <RootComponent />, children: [
            { path: '/', element: <MainComponent/> },
            { path: '/config', element: <ConfigPanelComponent/>  },
        ],

    }]);


export default function ReactRouterComponent({}) {
  return (
    <div>
        <RouterProvider router={XrouterX} />
    </div>
  );
}
