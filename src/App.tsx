import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter, useRoutes, Routes, Route } from 'react-router-dom';
import routes from './routes';

const App: React.FC = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  {route.element}
                </Suspense>
              }
            />
          ))}
        </Routes>
        {/* <Home /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;