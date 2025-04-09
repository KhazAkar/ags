import React from 'react';
import style from './LoginStyle.module.css';
import InputComp from './InputComponent/InputComp';
import { useRef, useState } from 'react';
import ButtonComp from './ButtonComponent/ButtonComp';
import { useNavigate } from 'react-router-dom';


export default function LoginComp()
{
    let loginValue = useRef<HTMLInputElement | null>(null); //loginValue.current.value
    let passwordValue = useRef<HTMLInputElement | null>(null); //passwordValue.current.value

    let loginError = useRef<boolean>(null); //loginValue.current.value
    let passwordError = useRef<boolean>(null);//passwordValue.current.value

    let [update, setUpdate] = useState<HTMLInputElement | null>(null);

    let goTo = useNavigate();
    
    function checkIfOk()
    {
        let logStr: number= loginValue?.current?.value?.length ?? 0;
        let passStr: number = passwordValue?.current?.value?.length ?? 0;

        //check if login and password are even filled in
        logStr == 0 ? loginError.current = true : loginError.current = false;
        passStr == 0 ?  passwordError.current = true : passwordError.current = false;

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
        goTo('/registration')
    }

    return(
        <div className={style.page}>
            <div className={style.loginWindow}>
            <div>
                Planter 0.1v alpha
            </div>
            <div className={style.loginGrid}>
                
                <InputComp text={'Login'} isError={loginError.current} ref={loginValue}/>
                <InputComp isHide={true}text={'Password'} isError={passwordError.current} ref={passwordValue}/>

                <div className={style.buttonGrid}>
                    <ButtonComp text={'Sign IN'} onClickFun={()=>checkIfOk()}/>
                    <ButtonComp text={'Sign UP'} onClickFun={()=>setAccount()}/>
                </div>

            </div>
        </div>
        </div>
    );
}