import { createContext } from "react";

export const EmptyContext = createContext({state: null, dispatch: null});

export function noteComponentReducer(state, action) 
{
    switch(action.type)
    {
        case "hello":
        {
            return {state:state, info: "hello"};
        }
        break;

    }
}