import React, { createContext, useReducer } from 'react'



type GlobalContextType = {
    items: any;
    updateFun: any;
};

export const GlobalContext = createContext<GlobalContextType>({
    items: { type: "hello", arrData: [], creationDate: [], editionDate: [], editionIndex: null },
    updateFun: () => { },
});


export function noteReducer(state: any, action: any) {

    console.log("action: ", action.type, " -val: ", action.val)

    switch (action.type) {
        case "create":
            {
                return {
                    type: "create",
                    arrData: state.arrData.length ? [...state.arrData.map((element: any) => element)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element)] : [], //old data //old data
                    editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element)] : []
                };

            }

        case "cancel":
            {
                return {
                    type: "cancel",
                    arrData: state.arrData.length ? [...state.arrData.map((element: any) => element)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element)] : [], //old data //old data
                    editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element)] : []
                };

            }

        case "save":
            {
                let today = new Date();

                let currentDate = {
                    dd: String(today.getDate()).padStart(2, '0'),
                    mm: String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
                    yyyy: String(today.getFullYear()).padStart(2, '0'),
                    hour: String(today.getHours()).padStart(2, '0'),
                    min: String(today.getMinutes()).padStart(2, '0'),
                    sec: String(today.getSeconds()).padStart(2, '0')
                }

                

                if (action.val.length > 0) {
                    return {
                        type: "save",
                        arrData: state.arrData.length ? [...state.arrData.map((element: any) => element), action.val] : [action.val],
                        creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element), JSON.parse(JSON.stringify(currentDate))] : [JSON.parse(JSON.stringify(currentDate))],
                        editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element),
                        {
                            dd: null,
                            mm: null,
                            yyyy: null,
                            hour: null,
                            min: null,
                            sec: null
                        }]
                            :
                            [
                                {
                                    dd: null,
                                    mm: null,
                                    yyyy: null,
                                    hour: null,
                                    min: null,
                                    sec: null
                                }
                            ]

                    };
                }
                else {
                    return {
                        type: "cancel",
                        arrData: state.arrData.length ? [...state.arrData.map((element: any) => element)] : [],
                        creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element)] : [], //old data //old data
                        editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element)] : []
                    };
                }
            }

        case "saveEdit":
            {
                let today = new Date();

                let currentDate = {
                    dd: String(today.getDate()).padStart(2, '0'),
                    mm: String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
                    yyyy: String(today.getFullYear()).padStart(2, '0'),
                    hour: String(today.getHours()).padStart(2, '0'),
                    min: String(today.getMinutes()).padStart(2, '0'),
                    sec: String(today.getSeconds()).padStart(2, '0')
                }

                if (action.val.length > 0) {
                    return {
                        type: "saveEdit",
                        arrData: [...state.arrData.map((element: any, index: any) => index === action.editionIndex ? action.val : element)],
                        creationDate: [...state.creationDate.map((element: any) => element)],
                        editionDate: [...state.editionDate.map((date: any, index: any) => index === action.editionIndex ? JSON.parse(JSON.stringify(currentDate)) : date)]
                    };
                }
                else {
                    return {
                        type: "cancel",
                        arrData: state.arrData.length ? [...state.arrData.map((element: any) => element)] : [],
                        creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element)] : [],
                        editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element)] : []
                    };
                }
            }

        case "delete":
            {
                return {
                    type: "delete",
                    arrData: state.arrData.length ? [...state.arrData.filter((value: any, index: any) => index != action.index)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.filter((value: any, index: any) => index != action.index)] : [],
                    editionDate: state.arrData.length ? [...state.editionDate.filter((value: any, index: any) => index != action.index)] : []
                };

            }

        case "edit":
            {
                action.val.current = state.arrData[action.index];
                console.log("editIndex from edit: " + action.index)
                return {

                    type: "edit",
                    arrData: state.arrData.length ? [...state.arrData.map((element: any) => element)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element: any) => element)] : [],
                    editionDate: state.arrData.length ? [...state.editionDate.map((element: any) => element)] : [],
                    editionIndex: action.index
                };

            }

        default:
            return state;
    }
}

export default function NoteReducerWrapper({ children }: any) {
    let [stateX, dispatch] = useReducer(noteReducer, { type: "hello", arrData: [], creationDate: [], editionDate: [], editionIndex: null })


    console.log("stateX: ", stateX)
    return (
        <GlobalContext.Provider value={{ items: stateX, updateFun: dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
}

