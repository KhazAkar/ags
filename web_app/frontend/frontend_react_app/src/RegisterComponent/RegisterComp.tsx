import React from 'react';
import style from './RegisterStyle.module.css';
import InputComp from '../LoginComponent/InputComponent/InputComp';
import { useRef, useState } from 'react';
import ButtonComp from '../LoginComponent/ButtonComponent/ButtonComp';
import { useNavigate } from 'react-router-dom';

export default function RegisterComp()
{
    let loginValue = useRef<HTMLInputElement | null>(null); //loginValue.current.value
    let passwordValue = useRef<HTMLInputElement | null>(null); //passwordValue.current.value
    let passwordValueSecond = useRef<HTMLInputElement | null>(null); //passwordValue.current.value

    let loginError = useRef<boolean | null>(null); //loginValue.current.value
    let passwordError = useRef<boolean | null>(null); //passwordValue.current.value

    let [update, setUpdate] = useState<number>(0);
    let goTo = useNavigate();

    function setAccount()
    {
        let logStr:string = loginValue?.current?.value ?? '';
        let passStr:string  = passwordValue?.current?.value ?? '';
        let passSecondStr:string  = passwordValueSecond?.current?.value ?? '';    
        const regex = /[^a-zA-Z0-9_.]/;
        passwordError.current = false;
        loginError.current = false;

        //check if login is even filled in
        if(logStr.length === 0)
        {
            loginError.current = true;
        }
        else if(regex.test(logStr)) //check if login pass the test of avaiable characters
        {
            loginError.current = true;
        }

        //check if password is even filled in
        if(passStr.length < 9 || passSecondStr.length < 9)
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
        //if everything is ok it back to login window and needs set up a session throught the loging in
        //goTo('/');
        //in other case throw a error
        setUpdate((prev):number => {return prev + 1});
    }

    function backToLogin()
    {
        goTo('/');
    }

    return(
        <div className={style.page}>
            <div className={style.registerWindow}>
                <div>
                    Planter 0.1v alpha
                </div>
                <div className={style.registerGrid}>
                    
                    <InputComp text={'Login (a-z A-Z 0-9 _ .)'} isError={loginError.current} ref={loginValue}/>
                    <InputComp text={'Password (min length: 9)'} isError={passwordError.current} ref={passwordValue} isHide={true}/>
                    <InputComp text={'Repeat a Passwword'} isError={passwordError.current} ref={passwordValueSecond} isHide={true}/>

                    <div className={style.buttonGrid}>
                        <ButtonComp text={'Back to Login'} onClickFun={()=>{backToLogin()}}/>
                        <ButtonComp text={'Set UP a Account'} onClickFun={()=>setAccount()}/>
                    </div>

                </div>
            </div>
        </div> 
    );
}