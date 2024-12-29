import React from 'react';
import '../styles/choose.css';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Choose: React.FC = () => {
  return (
    <>      
      <div className='choose' id="mask">
        <Link to='/'><button  className="close-button">X</button> </Link>
        
        <div className='card-container'>
          <Card
            title='Gema Ombak'
            description='Avoid Obstacle'
            image=''
            to='/gemaombak'
          />

          <Card
            title='Gema Supply'
            description='Supply Struggle'
            image=''
            to='/gemasupply'
          />
        </div>
      </div>
    </>
  );
}

export default Choose;