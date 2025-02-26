import React from 'react';
import './buttonStyle.css';

export default function Button({text, onClick, style, variant = 'primary'}) {
    return (
        <button 
            className={`button ${variant}`} 
            onClick={onClick} 
            style={style}
        >
            {text}
        </button>
    );
}