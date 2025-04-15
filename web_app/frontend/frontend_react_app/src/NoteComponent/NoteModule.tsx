import React from 'react';
import NoteComp from './NoteComp';
import NoteReducerWrapper from './NoteReducerWrapper';

export default function NoteModule()
{
    return(
        <NoteReducerWrapper>
            <NoteComp/>
        </NoteReducerWrapper>
    )
}