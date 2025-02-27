import {createContext, useReducer} from 'react'

export const GlobalContext = createContext (
    { 
        name: [],//"undefinied",
        id: [],//"undefinied",
        ip: [],//"undefinied",
        updateVersion: [],//"undefinied",
        modelVersion:[] //"undefinied"
    }
);

function reducerHandler(state,action)
{
    if(action.type === "GET")
    {
        let tempArr = {
            name: [...state.name],//"undefinied",
            id: [...state.id],//"undefinied",
            ip: [...state.ip],//"undefinied",
            updateVersion: [...state.updateVersion],//"undefinied",
            modelVersion:[...state.modelVersion] //"undefinied"}
        }

        tempArr.name.push(action.load.name)
        tempArr.id.push(action.load.id)
        tempArr.ip.push(action.load.ip)
        tempArr.updateVersion.push(action.load.updateVersion)
        tempArr.modelVersion.push(action.load.modelVersion)

        return tempArr;
    }
}

export function DevContextComponent({children})
{
    let [devList, dispatch] = useReducer(reducerHandler, { 
        name: [],//"undefinied",
        id: [],//"undefinied",
        ip: [],//"undefinied",
        updateVersion: [],//"undefinied",
        modelVersion:[] //"undefinied"
    }
)
}