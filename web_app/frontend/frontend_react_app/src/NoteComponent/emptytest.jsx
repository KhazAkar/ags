import React, { useReducer, useRef, useEffect } from 'react';
import {useReducer} from 'react';
import {EmptyContext, noteComponentReducer} from './empty.jsx';

export default Component({children})
{

    let [stateReducer, dispatchReducer] = useReducer(noteComponentReducer);


    return(
        <EmptyContext.Provider value={{state: stateReducer, dispatch: dispatchReducer }}>
            <Input>
            </Input>
        </EmptyContext.Provider>
    );
}