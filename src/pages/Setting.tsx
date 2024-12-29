import React, { Suspense, useState } from 'react';
import '../styles/setting.css';
import { BrowserRouter, Link, Route, RouteObject, Routes } from 'react-router-dom';

type ButtonProps = {
  text: string;
  isSelected: boolean;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ text, isSelected, onClick }) => {
  return (
    <button
      className={`setting-button ${isSelected ? 'selected-button' : ''}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const SettingContent: React.FC<{ selectedRouteId: string | null }> = ({ selectedRouteId }) => {
  const Settingroutes: RouteObject[] = [
    { id: 'Menu', path: '/menu', element: <div>Menu Content</div> },
    { id: 'Audio', path: '/audio', element: <div>Audio Content</div> },
  ];

  const getContent = () => {
    if (!selectedRouteId) return null;
    const route = Settingroutes.find((route) => route.id === selectedRouteId);
    return route ? route.element : null;
  };

  return <div>{getContent()}</div>;
};

const Setting: React.FC = () => {
  const MenuSetting = [{ text: "Menu" }, { text: "Audio" }];
  const [selectedButton, setSelectedButton] = useState<null | number>(null);

  const handleButtonSelection = (buttonId: number) => {
    setSelectedButton(buttonId);
  };

  return (
    <>
      <div className="sidebar-setting" id="layer">
        {MenuSetting.map((item, key) => (
            <Button
              key={key}
              text={item.text}
              isSelected={selectedButton === key}
              onClick={() => handleButtonSelection(key)}
            />
        ))}
      </div>
      <div className="content-setting" id="layer">
        <Link to='/'><button style={{
          float: 'right', 
          padding:'10px', 
          background: 'none', 
          border: 'none', 
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#ffffff'
        }}>X</button> </Link>
        
        <SettingContent selectedRouteId={MenuSetting[selectedButton ?? 0]?.text ?? null} />
      </div>
    </>
  );
};

export default Setting;