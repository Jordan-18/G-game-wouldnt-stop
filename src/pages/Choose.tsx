import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import '../styles/choose.css';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import { startFullscreen, endFullscreen } from '../utils/FullScreen';

const Choose: React.FC = () => {
  useEffect(() => {
    // startFullscreen(document.documentElement)
  })
  return (
    <>      
      <div className='choose'> {/*  id="mask" */}
        <Link to='/'><button  className="close-button">X</button> </Link>

        <Swiper
          spaceBetween={5}
          slidesPerView="auto"
          loop
          navigation
          centeredSlides
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
        >
          <SwiperSlide>
            <Card
              title="Gema Ombak"
              description="Avoid Obstacle"
              image=""
              to="/gemaombak"
            />
          </SwiperSlide>
          
          <SwiperSlide>
            <Card
              title="Gema Supply"
              description="Supply Struggle"
              image=""
              to="/gemasupply"
            />
          </SwiperSlide>

          <SwiperSlide>
            <Card
              title="WereWolfs"
              description=""
              image=""
              to=""
            />
          </SwiperSlide>

          <SwiperSlide>
            <Card
              title="White Hats"
              description=""
              image=""
              to=""
            />
          </SwiperSlide>

        </Swiper>
      </div>
    </>
  );
}

export default Choose;