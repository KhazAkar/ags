import { React, createContext, useReducer } from "react";

//predefined for test
let configDataChart = {
    "controlPanelData" : [
                            {
                                "profileName":"BUILT_IN",
                                "dataset": [
                                    {
                                        "sliderNames": "TEMPERATURE",
                                        "label": ['00:00:00', "chuj" ,'23:59:59'],
                                        "time": [0, 34233, 86399],
                                        "val":  [0, 45, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxY": 100

                                    },
                                    {
                                        "sliderNames": "AIR HUMIDITY",
                                        "label": ['00:00:00', '23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxy": 100
                                    },

                                    {
                                        "sliderNames": "SOIL HUMIDITY",
                                        "label": ['00:00:00', '23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxy": 100
                                    },

                                    {
                                        "sliderNames": "N",
                                        "label": ['00:00:00', '23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxy": 1000
                                    },

                                    {
                                        "sliderNames": "P",
                                        "label": ['00:00:00', '23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxy": 1000
                                    },

                                    {
                                        "sliderNames": "K",
                                        "label": ['00:00:00', '23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
                                        "type": "seconds",
                                        "minY" : 0,
                                        "maxy": 1000
                                    },
                                ],
                            },

                        ],
    "currentIndex": 0 //index of profile

}
export const ProfileContext = createContext( {
                            sliderData: {},
                            dispatchChart: () => {}
                        } );

function reducerHandler(state, action) /* action.type .load{times, values} .sliderNames .profileName  */
{
    if(action.type === "CHOOSEN_INDEX")
    {
        let temp = 
        state[action.sliderNames] 
    }

    return state;
}


export default function ConfigContextComponent({children})
{
    let [stateX, dispatchChart] = useReducer(reducerHandler, configDataChart);

    return (
        <ProfileContext.Provider value={{sliderData: stateX, dispatchChart: dispatchChart }} >
            {children}
        </ProfileContext.Provider>
    )
}


/* ARCHITECTURE
 list of object
 {
    "profileName":"name<string>"
    "dataset": {
        "sliderNames": [],
        "type" : string "seconds" or "hours" (seconds format) hh:mm:ss   (hour format) dd::hh
        "times": [],
        "values": [],
    }
 }
 
*/