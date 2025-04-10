import React, {  createContext, useReducer } from "react";

//predefined for test
let configDataChart = {
    "controlPanelData" : [
                            {
                                "profileName":"BUILT_IN_1",
                                "dataset": [
                                    {
                                        "sliderNames": "TEMPERATURE",
                                        "label": ['00:00:00','23:59:59'],
                                        "time": [0, 86399],
                                        "val":  [0, 0], 
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
                            {
                                "profileName":"BUILT_IN_2",
                                "dataset": [
                                    {
                                        "sliderNames": "TEMPERATURE",
                                        "label": ['00:00:00', "DESTYLATOR" ,'23:59:59'],
                                        "time": [0, 34233, 86399],
                                        "val":  [0, 32, 76], 
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
                            {
                                "profileName":"BUILT_IN_3",
                                "dataset": [
                                    {
                                        "sliderNames": "TEMPERATURE",
                                        "label": ['00:00:00', "PIWO" ,'23:59:59'],
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
                            {
                                "profileName":"BUILT_IN_4",
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
                            {
                                "profileName":"BUILT_IN_5",
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
                            {
                                "profileName":"BUILT_IN_6",
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
    "currentIndex": 0, //index of profile
    "activeProfile": 0 //index of profile which is running on the machine currently

}
export const ProfileContext = createContext( {
                            sliderData: {},
                            dispatchChart: () => {},
                            reloader: () => {}
                        } );

function reducerHandler(state:any, action:any) 
{
    if(action.type === "CHOOSEN_INDEX")
    {
        let newState = { ...state };

        newState.currentIndex = action.newIndex;
        return newState;
    }
    
    if(action.type === "SAVE_CONFIG")
    {
        let newState = { ...state };
        newState.controlPanelData[state.currentIndex].dataset[action.panelIndex].label = [...action.load.label]
        newState.controlPanelData[state.currentIndex].dataset[action.panelIndex].val = [...action.load.val]
        newState.controlPanelData[state.currentIndex].dataset[action.panelIndex].time = [...action.load.time]
        return newState;
    }

    if(action.type === "SET_NEW_NAME")
        {
            let newState = { ...state };
            newState.controlPanelData[newState.currentIndex].profileName = action.load.newProfileName;
            return newState;
        }

    if(action.type === "CHANGE_ACTIVE_PROGRAM")
        {
            let newState = { ...state };
            newState.activeProfile = state.currentIndex;
            return newState;
        }

    if(action.type === "ADD_NEW_PROFILE")
    {
        const now = new Date();

        const day = now.getDate();
        const month = now.getMonth() + 1; // Months are zero-indexed
        const year = now.getFullYear();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        let obj = {
            "profileName":  day + ":" + month + ":" + year + ":" + hour + ":" + minute + ":" + second,
            "dataset": [
                {
                    "sliderNames": "TEMPERATURE",
                    "label": ['00:00:00','23:59:59'],
                    "time": [0, 86399],
                    "val":  [0, 0], 
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
        }

            let newState = { ...state };
            newState.controlPanelData.push(obj);
            console.log("test")
            return newState
    }

    if (action.type === "DELETE_PROFILE") 
    {
        let newState = { ...state };
    
        if (newState.currentIndex === newState.activeProfile) 
            {
            if (newState.controlPanelData.length > 1) {
                newState.controlPanelData.splice(newState.currentIndex, 1);
                if (newState.currentIndex > 0) {
                    newState.currentIndex -= 1;
                } else {
                    newState.currentIndex = 0;
                }
                newState.activeProfile = newState.currentIndex;
            } 
        } else if (newState.controlPanelData.length > 1) {
            newState.controlPanelData.splice(newState.currentIndex, 1);
            newState.currentIndex = Math.max(newState.currentIndex - 1, 0);
        }
    
        return newState;
    }
    
    
    return state;
}


interface ConfigContextProps 
{
    children : React.ReactNode,
     reloader : any
}

export default function ConfigContextComponent({children, reloader}: ConfigContextProps)
{
    let [stateX, dispatchChart] = useReducer<any, any>(reducerHandler, configDataChart);

    return (
        <ProfileContext.Provider value={{sliderData: stateX, dispatchChart: dispatchChart, reloader:reloader } } >
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