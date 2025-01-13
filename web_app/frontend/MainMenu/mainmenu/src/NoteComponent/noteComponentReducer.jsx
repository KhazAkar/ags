import React from 'react'

export function noteComponentReducer(state, action) 
{
    switch(action.type)
    {        
        case "create":
        {
            return {
                    
                type: "create",
                arrData: state.arrData.length ? [...state.arrData.map((element)=>element)] : [],
                creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element)] : [], //old data //old data
                editionDate: state.arrData.length ? [...state.editionDate.map((element)=>element)] : []
          };  

        }

        case "cancel":
        {
            return {
                type: "cancel",
                arrData: state.arrData.length ? [...state.arrData.map((element)=>element)] : [],
                creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element)] : [], //old data //old data
                editionDate: state.arrData.length ? [...state.editionDate.map((element)=>element)] : []
          };   

        }

        case "save":
        {
            let today = new Date();
            
            let currentDate = { 
                dd : String(today.getDate()).padStart(2, '0'),
                mm :String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
                yyyy : String(today.getFullYear()).padStart(2, '0'),
                hour : String(today.getHours()).padStart(2, '0'),
                min : String(today.getMinutes()).padStart(2, '0'),
                sec : String(today.getSeconds()).padStart(2, '0')
            }
            
            console.log("action: " + action.val)

            if(action.val.length > 0)
            {
                return {
                    type: "save",
                    arrData: state.arrData.length ? [...state.arrData.map((element)=>element), action.val ] : [action.val],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element), JSON.parse(JSON.stringify(currentDate))] : [JSON.parse(JSON.stringify(currentDate))],
                    editionDate:  state.arrData.length ? [...state.editionDate.map((element)=>element), 
                    {
                        dd : null,
                        mm :null,
                        yyyy : null,
                        hour : null,
                        min : null,
                        sec : null
                    } ] 
                    :
                    [
                        {
                            dd : null,
                            mm :null,
                            yyyy : null,
                            hour : null,
                            min : null,
                            sec : null
                        } 
                    ]

                };   
            }
            else
            {
                return {
                    type: "cancel",
                    arrData: state.arrData.length ? [...state.arrData.map((element)=>element)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element)] : [], //old data //old data
                    editionDate: state.arrData.length ? [...state.editionDate.map((element)=>element)] : []
                };   
            }
        }

        case "saveEdit":
        {
            let today = new Date();
            
            let currentDate = { 
                dd : String(today.getDate()).padStart(2, '0'),
                mm :String(today.getMonth() + 1).padStart(2, '0'), //January is 0!
                yyyy : String(today.getFullYear()).padStart(2, '0'),
                hour : String(today.getHours()).padStart(2, '0'),
                min : String(today.getMinutes()).padStart(2, '0'),
                sec : String(today.getSeconds()).padStart(2, '0')
            }
            
            if(action.val.length > 0)
            {
                return {
                    type: "saveEdit",
                    arrData: [...state.arrData.map((element, index)=> index === action.editionIndex ? action.val : element)],
                    creationDate: [...state.creationDate.map((element)=>element)], 
                    editionDate: [...state.editionDate.map((date, index) => index === action.editionIndex ? JSON.parse(JSON.stringify(currentDate)) : date )]
            };    
            }
            else
            {
                return {
                    type: "cancel",
                    arrData: state.arrData.length ? [...state.arrData.map((element)=>element)] : [],
                    creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element)] : [],
                    editionDate: state.arrData.length ? [...state.editionDate.map((element)=>element)] : []
                };   
            }         
        }

        case "delete":
        {
            return {           
                type: "delete",
                arrData: state.arrData.length ? [...state.arrData.filter( (value,index) => index != action.index)] : [],
                creationDate: state.arrData.length ? [...state.creationDate.filter( (value,index) => index != action.index)] : [],
                editionDate: state.arrData.length ? [...state.editionDate.filter( (value,index) => index != action.index)] : []
          };   

        }

        case "edit":
        {
            action.val.current = state.arrData[action.index];
            console.log("editIndex from edit: " + action.index)
            return {
                    
                type: "edit",
                arrData: state.arrData.length ? [...state.arrData.map((element)=>element)] : [],
                creationDate: state.arrData.length ? [...state.creationDate.map((element)=>element)] : [],
                editionDate: state.arrData.length ? [...state.editionDate.map((element)=>element)] : [],
                editionIndex: action.index
          };   
         
        }

        default:
            return state;
    }
}
