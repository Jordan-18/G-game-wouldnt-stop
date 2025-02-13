import React from 'react';
import '../styles/setting.css';
import { BrowserRouter, Link, Route, RouteObject, Routes } from 'react-router-dom';

const Credits: React.FC = () => {
  return (
    <>
      <div className="content-setting" id="layer">
        <strong 
        style={{
          color: '#ffffff',
          fontSize: '40px',
          fontWeight: 'bold',
          fontFamily: 'neuropolitical rg'
        }}
        >Credits</strong>
        <Link to='/'><button style={{
          float: 'right', 
          padding:'10px', 
          background: 'none', 
          border: 'none', 
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#ffffff'
        }}>X</button> </Link>
      </div>
    </>
  );
}

export default Credits;