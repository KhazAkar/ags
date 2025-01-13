import React, {useRef,useEffect} from "react";
import './inputStyle.css';


export default function Input({child, getString=null}) //props which are avaiable to pass: 'text' 
{
    let inputRef = useRef(null);

    function updateString(newString)
    {
        if(getString!=null && inputRef!=null)
        {
            getString.current =  newString;
        }
    }

    return (
        <div className="inputContainer">
                <textarea ref={inputRef} onChange={(event)=>{updateString(event.target.value)} } defaultValue={getString.current} autoCorrect={'off'} className={'inputComponent'} placeholder={'Start typing...'} wrap={'hard'} rows={'30'} maxLength={1024}/>
        </div>
    );
}

