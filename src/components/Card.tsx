import React from 'react';
import '../styles/card.css';
import { Link } from 'react-router-dom';

type CardProps = {
  title: string,
  description: string,
  image: string,
  to: string
}

const Card: React.FC<CardProps> = ({title, description, image, to}) => {
  return (
    <div className="card">
      <Link to={to}>
        <img className='card-image' src={image != '' ? image : 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='} />
        <div className="container">
          <h4><b>{title}</b></h4> 
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default Card;