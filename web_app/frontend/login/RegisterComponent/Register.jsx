import React from 'react';
import './registerStyle.css';
import Input from '../InputComponent/Input.jsx';
import { useRef, useState } from 'react';
import Button from '../ButtonComponent/Button.jsx';

export default function Register({children, changeMode})
{
    let loginValue = useRef(null); //loginValue.current.value
    let passwordValue = useRef(null); //passwordValue.current.value
    let passwordValueSecond = useRef(null); //passwordValue.current.value

    let loginError = useRef(null); //loginValue.current.value
    let passwordError = useRef(null); //passwordValue.current.value

    let [update, setUpdate] = useState(null);

    function setAccount()
    {
        let logStr = loginValue.current.value;
        let passStr = passwordValue.current.value;
        let passSecondStr = passwordValueSecond.current.value;    
        const regex = /[^a-zA-Z0-9_.]/;
        passwordError.current = false;
        loginError.current = false;

        //check if login is even filled in
        if(parseInt(logStr.length) == 0)
        {
            loginError.current = true;
        }
        else if(regex.test(logStr)) //check if login pass the test of avaiable characters
        {
            loginError.current = true;
        }

        //check if password is even filled in
        if(parseInt(passStr.length) < 9 || parseInt(passSecondStr.length) < 9)
        {
            passwordError.current = true;
        }
        else if(passStr !== passSecondStr) //check if passwords are the same
        {   
            passwordError.current = true;
        }


        //funtion which get data from the server about good or bad password
        //-----------------------------------------------------------------
        //
        //-----------------------------------------------------------------
        
        setUpdate((prev) => prev + 1);
    }

    function backToLogin()
    {
        changeMode((prev) => 'login');
        setUpdate((prev) => prev + 1);
    }

    return(
        <div className='RegisterWindow'>
            <div>
                Planter 0.1v alpha
            </div>
            <div className='RegisterGrid'>
                
                <Input text={'Login (a-z A-Z 0-9 _ .)'} isError={loginError.current} ref={loginValue}/>
                <Input text={'Password (min length: 9)'} isError={passwordError.current} ref={passwordValue} isHide={true}/>
                <Input text={'Repeat a Passwword'} isError={passwordError.current} ref={passwordValueSecond} isHide={true}/>

                <div className='buttonGrid'>
                    <Button text={'Back to Login'} onClickFun={()=>{backToLogin()}}/>
                    <Button text={'Set up a account'} onClickFun={()=>setAccount()}/>
                </div>

            </div>
        </div>
    );
}