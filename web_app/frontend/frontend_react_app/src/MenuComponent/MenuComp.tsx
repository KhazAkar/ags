import React from 'react';
import menuStyle from './MenuStyle.module.css';

import { NavLink } from "react-router-dom"
import { ReactComponent as SettingSVG } from '../resources/svg/settings.svg';
import { ReactComponent as AccountSVG } from '../resources/svg/account.svg';
import { ReactComponent as DevicesSVG } from '../resources/svg/devices.svg';
import { ReactComponent as HomeSVG } from '../resources/svg/home.svg';
import { ReactComponent as LogOutSVG } from '../resources/svg/logout.svg';

function MenuButton({ path, IconSVG }: {path: string, IconSVG: React.FC<React.SVGProps<SVGSVGElement>>}) {
  return (<NavLink to={path} end
    className={({ isActive }) => isActive ? menuStyle.activeButton : menuStyle.normalButton} >
    <div className={menuStyle.svg}>
      <IconSVG className={menuStyle.svgInner} />
    </div>
  </NavLink>
  )
}

export default function MenuComp() {
  return (
    <div className={menuStyle.container}>
      <div className={menuStyle.menuWrapperGrid}>

        <MenuButton path="/app" IconSVG={HomeSVG} />
        <MenuButton path="devices" IconSVG={DevicesSVG} />
        <MenuButton path="config" IconSVG={SettingSVG} />
        <MenuButton path="account" IconSVG={AccountSVG} />

        <div>
          {/*blank div because of my idea for that component in css xdxdxd */}
        </div>
        
        <MenuButton path="/" IconSVG={LogOutSVG} /> {/*Here add some logic to log out the server and close the connection*/}
      </div>
    </div>
  )

}