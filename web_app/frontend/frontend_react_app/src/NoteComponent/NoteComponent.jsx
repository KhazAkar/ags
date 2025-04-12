import React, { useReducer, useRef, useEffect } from 'react';
import {noteComponentReducer} from './noteComponentReducer.jsx';
import './NoteComponentStyle.css';
import Input from '../InputComponent/Input.jsx';
import Button from '../ButtonComponent/Button.jsx';

//all notes are stored into "reducerState" and it is updated by reducer dispatch and the inputed note is passed by reference(the "noteRef" variable is sent)
//Input component contain a access to the reference too, it update it always when the "creating phase" is turn on
//arrData of reducer is a object property which contain all pasted by user/downloaded data from server

export default function NoteComponent({child})
{
    const [reducerState, dispatch] = useReducer(noteComponentReducer, {type: "hello", info: "hola hola", val: null, arrData: [], creationDate: [], editionDate: [], editionIndex: null})
    const noteRef = useRef('');
    const previousEvent = useRef('');

      useEffect(()=>
      {
        noteRef.current = '';
        
      }, [previousEvent.current]);


      return (
        <div className='noteComponentContainer'>
            {
                (() => {
                    switch (reducerState.type) {
                        
                        case 'create':
                        case "edit":
                            return (
                                <div className='noteInputDisplay'>
                                    <Input getString={noteRef} />
                                </div>
                            );
                        
                        default:
                            return (
                                <div className='noteDisplayBlocker'>
                                    <div className='noteDisplay'>
                                        {reducerState.arrData.map((element, index) => {
                                            return (
                                                <div className="aNoteHolder" key={"abc" + index}>
                                                    <div className="aNote">
                                                        <div>{element}</div>
                                                        <div className="aNoteCreated">
                                                            <div>
                                                            {
                                                                "Created: " + reducerState.creationDate[index].dd + " "
                                                                + reducerState.creationDate[index].mm + " "
                                                                + reducerState.creationDate[index].yyyy + " - "
                                                                + reducerState.creationDate[index].hour + ":"
                                                                + reducerState.creationDate[index].min + ":"
                                                                + reducerState.creationDate[index].sec
                                                            }
                                                            </div>
                                                            <div>
                                                            {
                                                                (reducerState.editionDate[index].dd != null) ?
                                                                    "Edited: " + reducerState.editionDate[index].dd + " "
                                                                    + reducerState.editionDate[index].mm + " "
                                                                    + reducerState.editionDate[index].yyyy + " - "
                                                                    + reducerState.editionDate[index].hour + ":"
                                                                    + reducerState.editionDate[index].min + ":"
                                                                    + reducerState.editionDate[index].sec :
                                                                    ""
                                                            }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="aNoteButtons">
                                                        <div></div>
                                                        <Button
                                                            style={{ fontSize: "10px", lineHeight: "26px", width: "30px", height: "26px", minWidth: "26px", minHeight: "26px" }}
                                                            text={"Del"}
                                                            onClickFun={() => {
                                                                previousEvent.current = reducerState.type;
                                                                dispatch({ type: "delete", index: index })
                                                            }}
                                                            upperCol={"#C60C30"} 
                                                            underCol={"#FF003F"} 
                                                        />
                                                        <Button
                                                            style={{ fontSize: "10px", lineHeight: "26px", width: "30px", height: "26px", minWidth: "26px", minHeight: "26px" }}
                                                            text={"Edit"}
                                                            onClickFun={() => {
                                                                previousEvent.current = reducerState.type;
                                                                dispatch({ type: "edit", val: noteRef, index: index})
                                                            }}
                                                            upperCol={"#83BCEC"} 
                                                            underCol={"#789CC4"} 
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                    }
                })()
            }
    
            <div className='noteManager'>
            {   (() => { 
                switch(reducerState.type)
                    {
                    case "create":
                    return(
                    <div className='saveCancelButtonHolder'>
                        <Button
                            text={"Save"}
                            onClickFun={() => {
                                previousEvent.current = reducerState.type;
                                dispatch({ type: "save", val: noteRef.current });
                            }}
                        />
                        <Button
                            text={"Cancel"}
                            onClickFun={() => {
                                previousEvent.current = reducerState.type;
                                dispatch({ type: "cancel"});
                            }}
                            upperCol={"#C60C30"} 
                            underCol={"#FF003F"}
                        />
                    </div>
                    )

                    case "edit":
                        return(
                            <div className='saveCancelButtonHolder'>
                                <Button
                                    text={"Save Edit"}
                                    onClickFun={() => {
                                        previousEvent.current = reducerState.type;
                                        dispatch({ type: "saveEdit", val: noteRef.current, editionIndex: reducerState.editionIndex });
                                    }}
                                />
                                <Button
                                    text={"Cancel"}
                                    onClickFun={() => {
                                        previousEvent.current = reducerState.type;
                                        dispatch({ type: "cancel"});
                                    }}
                                    upperCol={"#C60C30"} 
                                    underCol={"#FF003F"}
                                />
                            </div>
                            ) 

                    default:
                    return(
                        <div className='createButtonHolder'>
                            <div></div>
                            <Button
                                text="Create"
                                onClickFun={() => {
                                    previousEvent.current = reducerState.type;
                                    dispatch({ type: "create" });
                                }}
                            />
                            <div></div>
                        </div>
                        )
                    }
                })()
            }

            </div>
        </div>
    );
    
}
