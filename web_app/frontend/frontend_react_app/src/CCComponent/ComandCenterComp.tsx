import React from "react";
import CCStyle from './ComandCenterStyle.module.css';
import TimerComp from '../TimerComponent/TimerComp';

function BasicDiv({ children }: { children: React.ReactNode }) {
    return (
        <div className={CCStyle.basicStyle}>
            {children}
        </div>
    )
}

function SpanModDiv({ children }: { children: React.ReactNode }) {
    return (
        <div className={` ${CCStyle.basicStyle} ${CCStyle.content2}`}>
            {children}
        </div>
    )
}

export default function ComandCenterComp() {
    return (
        <div className={CCStyle.CCContainer}>
            <div className={CCStyle.gridWrapper}>

                {/* 3columns  4rows */}
                <div className={CCStyle.centerGrid}>

                    <BasicDiv> </BasicDiv>

                    <BasicDiv> </BasicDiv>

                    <BasicDiv> </BasicDiv>

                    <SpanModDiv> </SpanModDiv>

                    <SpanModDiv> </SpanModDiv>

                    <SpanModDiv> </SpanModDiv>

                    <div className={` ${CCStyle.basicStyle} ${CCStyle.contentCam}`}>

                    </div>

                </div>

                {/* 1column  2rows */}
                <div className={CCStyle.rightGrid}>

                    <BasicDiv> <TimerComp/> </BasicDiv>
                    
                    <BasicDiv> </BasicDiv>

                </div>
            </div>
        </div>
    )
}