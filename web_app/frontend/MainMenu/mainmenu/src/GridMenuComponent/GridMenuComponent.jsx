import react from "react"
import './GridMenuComponentStyle.css'
import { NavLink} from "react-router-dom"
import { ReactComponent as SettingSVG } from '../resources/settings.svg';
import { ReactComponent as AccountSVG } from '../resources/account.svg';
import { ReactComponent as DevicesSVG } from '../resources/devices.svg';
import { ReactComponent as HomeSVG } from '../resources/home.svg';
import { ReactComponent as LogOutSVG} from '../resources/logout.svg'

export default function GridMenuComponent({ children }) {
    return (
        <div className="menuGridY">

            <NavLink to="/app" end
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <HomeSVG className="svgInner"/>
                    </div>
            </NavLink>

            <NavLink to="devices" end
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <DevicesSVG className="svgInner"/>
                    </div>
            </NavLink>

            <NavLink to="config" end
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <SettingSVG className="svgInner"/>
                    </div>
            </NavLink>
            
            <NavLink to="account" end
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <AccountSVG className="svgInner"/>
                    </div>
            </NavLink>

            <div className="normalButton blank">

            </div>

            <NavLink to="/" end
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        {//Here add some logic to log out the server and close the connection
                        }
                        <LogOutSVG className="svgInner"/>
                    </div>
            </NavLink>
        </div>
    )

}