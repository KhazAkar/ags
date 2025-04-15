import React, { useContext, useRef, useEffect } from 'react';
import NoteReducerWrapper, { GlobalContext } from './NoteReducerWrapper';
import style from './NoteComponentStyle.module.css';
import InputComp from '../InputComponent/InputComp';
import ButtonComp from '../ButtonComponent/ButtonComp';

//all notes are stored into "items" and it is updated by reducer updateFun and the inputed note is passed by reference(the "noteRef" variable is sent)
//Input component contain a access to the reference too, it update it always when the "creating phase" is turn on
//arrData of reducer is a object property which contain all pasted by user/downloaded data from server

export default function NoteComp() {
    let { items, updateFun } = useContext(GlobalContext);

    const noteRef = useRef('');
    const previousEvent = useRef('');

    useEffect(() => {
        noteRef.current = '';

    }, [previousEvent.current]);

    function showNoteOrOpenIt() {
        switch (items.type) {
            case "create":
            case "edit":
                return (
                    <div className={style.noteInputDisplay}>
                        <InputComp getString={noteRef} />
                    </div>
                );

            default:
                return (
                    returnList()
                );
        }
    }

    function returnList() {
        return (
            <div className={style.noteDisplayBlock}>
                <div className={style.noteDisplay}>
                    {items.arrData.map((element: any, index: any) => {
                        return (
                            <div className={style.aNoteHolder} key={"abc" + index}>
                                <div className={style.aNote}>
                                    <div>{element}</div>
                                    <div className={style.aNoteCreated}>
                                        <div>
                                            {
                                                "Created: " + items.creationDate[index].dd + " "
                                                + items.creationDate[index].mm + " "
                                                + items.creationDate[index].yyyy + " - "
                                                + items.creationDate[index].hour + ":"
                                                + items.creationDate[index].min + ":"
                                                + items.creationDate[index].sec
                                            }
                                        </div>
                                        <div>
                                            {
                                                (items.editionDate[index].dd != null) ?
                                                    "Edited: " + items.editionDate[index].dd + " "
                                                    + items.editionDate[index].mm + " "
                                                    + items.editionDate[index].yyyy + " - "
                                                    + items.editionDate[index].hour + ":"
                                                    + items.editionDate[index].min + ":"
                                                    + items.editionDate[index].sec :
                                                    ""
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={style.aNoteButtons}>
                                    <div></div>
                                    <ButtonComp
                                        style={{ fontSize: "10px", lineHeight: "26px", width: "30px", height: "26px", minWidth: "26px", minHeight: "26px" }}
                                        text={"Del"}
                                        onClickFun={() => {
                                            previousEvent.current = items.type;
                                            updateFun({ type: "delete", index: index })
                                        }}
                                        upperCol={"#FF003F"}
                                        underCol={"#C60C30"}
                                    />
                                    <ButtonComp
                                        style={{ fontSize: "10px", lineHeight: "26px", width: "30px", height: "26px", minWidth: "26px", minHeight: "26px" }}
                                        text={"Edit"}
                                        onClickFun={() => {
                                            previousEvent.current = items.type;
                                            updateFun({ type: "edit", val: noteRef, index: index })
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

    function noteManagerButtons() {
        switch (items.type) {
            case "create":
                return (
                    <div className={style.saveCancelButtonHolder}>
                        <ButtonComp
                            text={"Save"}
                            onClickFun={() => {
                                previousEvent.current = items.type;
                                updateFun({ type: "save", val: noteRef.current });
                            }}
                        />
                        <ButtonComp
                            text={"Cancel"}
                            onClickFun={() => {
                                previousEvent.current = items.type;
                                updateFun({ type: "cancel" });
                            }}
                            upperCol={"#FF003F"}
                            underCol={"#C60C30"}
                        />
                    </div>
                )

            case "edit":
                return (
                    <div className={style.saveCancelButtonHolder}>
                        <ButtonComp
                            text={"Save Edit"}
                            onClickFun={() => {
                                previousEvent.current = items.type;
                                updateFun({ type: "saveEdit", val: noteRef.current, editionIndex: items.editionIndex });
                            }}
                        />
                        <ButtonComp
                            text={"Cancel"}
                            onClickFun={() => {
                                previousEvent.current = items.type;
                                updateFun({ type: "cancel" });
                            }}
                            upperCol={"#FF003F"}
                            underCol={"#C60C30"}
                        />
                    </div>
                )

            default:
                return (
                    <div className={style.createButtonHolder}>
                        <div></div>
                        <ButtonComp
                            text="Create"
                            onClickFun={() => {
                                previousEvent.current = items.type;
                                updateFun({ type: "create" });
                            }}
                        />
                        <div></div>
                    </div>
                )
        }
    }

    return (
        <div className={style.noteComponentContainer}>

            {showNoteOrOpenIt()}

            <div className={style.noteManager}>
                {noteManagerButtons()}
            </div>
        </div>
    );

}
