import React from 'react';
import './loginStyle.css';
import Input from '../InputComponent/Input.jsx';
import { useRef, useState } from 'react';
import Button from '../ButtonComponent/Button.jsx';
import { useNavigate } from 'react-router-dom';
export default function Login({children, changeMode})
{
    let loginValue = useRef(null); //loginValue.current.value
    let passwordValue = useRef(null); //passwordValue.current.value

    let loginError = useRef(null); //loginValue.current.value
    let passwordError = useRef(null); //passwordValue.current.value

    let [update, setUpdate] = useState(null);

    let goTo = useNavigate();
    

    function karamba()
    {
        let logStr = loginValue.current.value.length;
        let passStr = passwordValue.current.value.length;

        //check if login and password are even filled in
        if(parseInt(logStr) == 0)
        {
            loginError.current = true;
        }
        else
        {
            loginError.current = false;
        }

        if(parseInt(passStr) == 0)
        {
            passwordError.current = true;
        }
        else
        {
            passwordError.current = false;
        }

        //funtion which get data from the server about good or bad login & password
        //-----------------------------------------------------------------
        //
        //-----------------------------------------------------------------

        //if fetch is ok then and conection has been established
        goTo('/app');

        //in other case throw a error
    }

    function setAccount()
    {
        //changeMode((prev) => 'register');
        goTo('/register')
    }
    return(
        <div className='Page'>
            <div className='LoginWindow'>
            <div>
                Planter 0.1v alpha
            </div>
            <div className='LoginGrid'>
                
                <Input text={'Login'} isError={loginError.current} ref={loginValue}/>
                <Input isHide={true}text={'Password'} isError={passwordError.current} ref={passwordValue}/>
                <div className='buttonGrid'>
                    <Button text={'Sign IN'} onClickFun={()=>karamba()}/>
                    <Button text={'Sign UP'} onClickFun={()=>setAccount()}/>
                </div>

            </div>
        </div>
        </div>
    );
}