import React from 'react';
import Button from '../ButtonComponent/Button.jsx';
import '../CommonComponentStyle.css';

/**
 * SidebarMenu Component
 * Displays the main navigation menu
 */
const SidebarMenuComponent = () => {
  // Menu items configuration
  const menuItems = [
    { text: "Settings", action: () => console.log("Settings clicked"), variant: "primary" },
    { text: "Dashboard", action: () => console.log("Dashboard clicked"), variant: "primary" },
    { text: "Reports", action: () => console.log("Reports clicked"), variant: "primary" },
    { text: "Automation", action: () => console.log("Automation clicked"), variant: "primary" },
    null, // Spacer
    { text: "Help", action: () => console.log("Help clicked"), variant: "secondary" }
  ];

  return (
    <div className="menuGrid">
      {menuItems.map((item, index) => 
        item ? (
          <div className="tempButton" key={index}>
            <Button 
              text={item.text} 
              onClick={item.action} 
              variant={item.variant} 
            />
          </div>
        ) : (
          <div key={index}>{/* Spacer */}</div>
        )
      )}
    </div>
  );
};

export default SidebarMenuComponent;
