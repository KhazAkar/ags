import React, { useState } from 'react';
import './DropDownComponentStyle.css';  // Zawiera style CSS

export default function DropDownComponent()
{
    const [isOpen, setIsOpen] = useState(false); // Stan, czy lista jest otwarta

    const toggleDropdown = () => {
        setIsOpen(!isOpen);  // Zmieniamy stan, otwierając/zamykając listę
    };

    return (
        <div className="dropdown">
            xxx
        </div>
    );
};
