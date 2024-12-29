import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';
import Button from '../components/Button';

const Home: React.FC = () => {
  const filteredRoutes = routes.filter((route) => route.index == true);
  
  return (
    <>
      <div className="sidebar">
        {filteredRoutes.map((item, key) =>
          <Link key={key} to={item.path ?? ''} >
            <Button key={key} text={item.id?.toString() ?? 'Unknown'} />
          </Link>
        )}
      </div>

      <div className="content">
        <strong className='title'>GGWS</strong>
        <a className='sub-title'>"Gema Game's Wouldn't Stop"</a>
      </div>
    </>
  );
}

export default Home;