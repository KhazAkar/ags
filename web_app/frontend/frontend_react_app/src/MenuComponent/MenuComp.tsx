import React from 'react';
import menuStyle from './MenuStyle.module.css';

import { NavLink} from "react-router-dom"
import { ReactComponent as SettingSVG } from '../resources/svg/settings.svg';
import { ReactComponent as AccountSVG } from '../resources/svg/account.svg';
import { ReactComponent as DevicesSVG } from '../resources/svg/devices.svg';
import { ReactComponent as HomeSVG } from '../resources/svg/home.svg';
import { ReactComponent as LogOutSVG} from '../resources/svg/logout.svg';

export default function MenuComp() {
    return (
      <div className={menuStyle.container}>
        <div className={menuStyle.menuWrapperGrid}>

            <NavLink to="/app" end
                className={({ isActive }) => isActive ? menuStyle.activeButton : menuStyle.normalButton} >
                    <div className={ menuStyle.svg }>
                        <HomeSVG className={menuStyle.svgInner}/>
                    </div>
            </NavLink>

            <NavLink to="devices" end
                className={({ isActive }) => isActive ? menuStyle.activeButton  :  menuStyle.normalButton} >
                    <div className={ menuStyle.svg }>
                        <DevicesSVG className={menuStyle.svgInner}/>
                    </div>
            </NavLink>

            <NavLink to="config" end
                className={({ isActive }) => isActive ? menuStyle.activeButton  :  menuStyle.normalButton} >
                    <div className={ menuStyle.svg }>
                        <SettingSVG className={menuStyle.svgInner}/>
                    </div>
            </NavLink>
            
            <NavLink to="account" end
                className={({ isActive }) => isActive ? menuStyle.activeButton  :  menuStyle.normalButton} >
                    <div className={ menuStyle.svg }>
                        <AccountSVG className={menuStyle.svgInner}/>
                    </div>
            </NavLink>

            <div className={menuStyle.normalButtonX  }>

            </div>

            <NavLink to="/" end
                className={({ isActive }) => isActive ? menuStyle.activeButton  :  menuStyle.normalButton} >
                    <div className={ menuStyle.svg }>
                        {//Here add some logic to log out the server and close the connection
                        }
                        <LogOutSVG className={menuStyle.svgInner}/>
                    </div>
            </NavLink>
        </div>
        </div>
    )

}