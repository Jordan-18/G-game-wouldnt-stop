// src/routes.tsx
import React from 'react';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import App from './services/App';

const appService = new App();

const Home = lazy(() => import('./pages/Home'));
const Choose = lazy(() => import('./pages/Choose'));
const GemaOmbak = lazy(() => import('./pages/GemaOmbak'));
const GemaSupply = lazy(() => import('./pages/GemaSupply'));
const Setting = lazy(() => import('./pages/Setting'));
const Credits = lazy(() => import('./pages/Credits'));

const routes: RouteObject[] = [
  { id: 'Home', path: '/', element: <Home /> },
  { id: 'Start', path: '/Choose', element: <Choose />, index: true},
  { id: 'Credits', path: '/credits', element: <Credits />, index: true},
  { id: 'Setting', path: '/setting', element: <Setting />, index: true},
  { id: 'Exit',   path: '/exit', index: true, action: () => {
    appService.exit()
    return null
  }},

  { id: 'Gema Ombak', path: '/gemaombak', element: <GemaOmbak />},
  { id: 'Gema Supply', path: '/gemasupply', element: <GemaSupply />},
  
  { path: '*', element: <Home />, id: '404' },
];

export default routes;