import React, { useRef, useEffect, RefObject } from "react";
import './inputStyle.css';

type Props = {
    getString?: RefObject<string>;
};

export default function InputComp({ getString }: Props)
{
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    function updateString(newString: string)
    {
        if (getString && getString.current !== null) {
            getString.current = newString;
        }
    }

    return (
        <div className="inputContainer">
            <textarea
                ref={inputRef}
                onChange={(event) => updateString(event.target.value)}
                defaultValue={getString?.current}
                autoCorrect="off"
                className="inputComponent"
                placeholder="Start typing..."
                wrap="hard"
                rows={30}
                maxLength={1024}
            />
        </div>
    );
}
