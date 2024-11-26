import './appStyle.css';
import Login from './LoginComponent/Login.jsx';
import Register from './RegisterComponent/Register.jsx';
import React from 'react';
import {useRef, useState} from 'react';

export default function App({children}) 
{
  let [mode, setMode] = useState('login');

  return (
    <div className="App">
      {
        (mode == 'login') ? <Login changeMode={setMode} /> : <Register changeMode={setMode} />
      }
    </div>
  );
}

