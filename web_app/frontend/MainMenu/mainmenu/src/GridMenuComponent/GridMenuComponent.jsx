import react from "react"
import './GridMenuComponentStyle.css'
import { Link, NavLink} from "react-router-dom"
import { ReactComponent as SettingSVG } from '../resources/settings.svg';
import { ReactComponent as AccountSVG } from '../resources/account.svg';
import { ReactComponent as DevicesSVG } from '../resources/devices.svg';
import { ReactComponent as HomeSVG } from '../resources/home.svg';
export default function GridMenuComponent({ children }) {
    return (
        <div className="menuGridY">

            <NavLink to="/"
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <HomeSVG className="svgInner"/>
                    </div>
            </NavLink>

            <NavLink to="/config"
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <SettingSVG className="svgInner"/>
                    </div>
            </NavLink>


            <NavLink to="/devices"
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <DevicesSVG className="svgInner"/>
                    </div>
            </NavLink>
            

            <NavLink to="/account"
                className={({ isActive }) => isActive ? "activeButton" : "normalButton"} >
                    <div className="svg">
                        <AccountSVG className="svgInner"/>
                    </div>
            </NavLink>

            <div className="tempButton">
            </div>

            <div className="tempButton">

            </div>
        </div>
    )

}