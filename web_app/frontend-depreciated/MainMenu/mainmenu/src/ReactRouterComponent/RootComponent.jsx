import './ReactRouterComponentStyle.css';
import React from 'react';
import GridMenuComponent from '../GridMenuComponent/GridMenuComponent.jsx';
import { Outlet } from 'react-router-dom';


export default function RootComponent() {
    return (
        <div className="ReactRouterComponent">
            <div className='outerGridX'>
                <div className='leftGridX'>
                    <GridMenuComponent />
                </div>
                
                <div className='centerGridX'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

