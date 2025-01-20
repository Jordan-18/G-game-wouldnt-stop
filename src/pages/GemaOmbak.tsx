import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, Obstacle, Crew, ParallaxBackground } from '../services/GemaOmbak'
import { getRandomInt } from '../utils/Helper';
import '../styles/GemaOmbak.css';

const GemaOmbak: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playersRef = useRef<Player[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  let gameSpeed: number = 2;
  const baseInterval: number = 5000; // Base interval in milliseconds
  const stageIncrement: number = 500; // Reduction in interval per stage
  const PRESS_HOLD_THRESHOLD = 500;
  let holdTimer: number | null = null;
  let isHoldTriggered = false;
  let isSpacePressed = false;
  const heigtcanvas = 0.9;
  let score: number = 0;
  let crewscore: number = 0;
  const scoreRef = useRef<HTMLElement>(null);
  const crewscoreRef = useRef<HTMLElement>(null);
  const crewRef = useRef<Crew[]>([]);
  let isCollected: boolean = false;
  let lastSpeedCheck: number = 0;
  const activeKeys = useRef(new Set());

  const seaLayerRef  = useRef<HTMLDivElement>(null);
  const cloudLayerRef = useRef<HTMLDivElement>(null);
  const beachLayerRef = useRef<HTMLDivElement>(null);

  const backgroundRef = useRef<ParallaxBackground | null>(null);

  const spawnObstacle = () => {
    if (canvasRef.current) {
      let obstacle = new Obstacle(canvasRef.current.width, canvasRef.current.height, canvasRef.current.height, gameSpeed);
      // while (obstaclesRef.current.some((o) => isCollision(o, obstacle))) {
      //   obstacle = new Obstacle(canvasRef.current.width, canvasRef.current.height, canvasRef.current.height * 0.9, gameSpeed);
      // }
      obstaclesRef.current.push(obstacle);
    }
  };
  const spawnCrew = () => {
    if (canvasRef.current) {
      let crew = new Crew(canvasRef.current.width, canvasRef.current.height, canvasRef.current.height, gameSpeed);
      // // Pastikan crew tidak tumpang tindih dengan obstacle
      // while (obstaclesRef.current.some((obstacle) => isCollision(obstacle, crew))) {
      //   crew = new Crew(canvasRef.current.width, canvasRef.current.height, canvasRef.current.height * 0.9, gameSpeed);
      // }
      crewRef.current.push(crew);
    }
  };
  const scheduleNextCrew = (currentStage: number) => {
    const minTime = baseInterval - currentStage * stageIncrement;
    const maxTime = minTime + 2200;
    const nextInterval = Math.max(getRandomInt(minTime, maxTime), 1000);
    setTimeout(() => {
      spawnCrew()
      scheduleNextCrew(currentStage);
    }, nextInterval);
  };
  const scheduleNextObstacle = (currentStage: number) => {
    const minTime = baseInterval - currentStage * stageIncrement;
    const maxTime = minTime + 2000; // Add variability
    const nextInterval = Math.max(getRandomInt(minTime, maxTime), 500); // Ensure a minimum delay
    setTimeout(() => {
      spawnObstacle()
      scheduleNextObstacle(currentStage);
    }, nextInterval);
  };
  const update = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      updateParallaxSpeed()

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundRef.current) {
            backgroundRef.current.update(gameSpeed);
            backgroundRef.current.draw(ctx);
        }

        // player section
        playersRef.current.forEach((player) => {
          player.update(isSpacePressed, gameSpeed); // Berikan nilai isSpacePressed ke player.
          player.draw(ctx);
        });
        
        // obtacle section
        obstaclesRef.current.forEach((obstacle) => {
          obstacle.update();
          obstacle.draw(ctx);
        });

        obstaclesRef.current = obstaclesRef.current.filter(
          (obstacle) => obstacle.x + obstacle.width > 0
        );

        // crew section
        crewRef.current.forEach((crew) => {
          crew.update(playersRef.current[0].x, playersRef.current[0].y, gameSpeed);
          crew.draw(ctx);
        });

        crewRef.current = crewRef.current.filter( 
          (crew) => crew.x + crew.width > 0
        );

        checkCollision();
        score += 1 * (gameSpeed / 100);
        scoreRef.current!.textContent = score.toFixed(0).toString();

        const roundedScore = Math.floor(score);
        if (roundedScore % 100 === 0 && roundedScore !== lastSpeedCheck && gameSpeed < 5) {
          gameSpeed += 1; // Tingkatkan gameSpeed
          lastSpeedCheck = roundedScore; // Update skor terakhir yang memicu peningkatan
          // console.log(`Game speed increased to ${gameSpeed}`);
        }
      }
    }
    requestAnimationFrame(update);
  };
  const checkCollision = () => {
    playersRef.current.forEach((player) => {
      // check obstacle collision
      obstaclesRef.current.forEach((obstacle) => {
        if (
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y
        ) {
          
        }
      });

      // check crew collision
      crewRef.current.forEach((crew) => {
        if (
          !crew.isCollected &&
          player.x < crew.x + crew.width &&
          player.x + player.width > crew.x &&
          player.y < crew.y + crew.height &&
          player.y + player.height > crew.y
        ) {
          crewscore += 1
          crew.isCollected = true; // set true ketika crew diambil

          crew.x = player.x; // Pastikan posisi x crew mengikuti player
          crew.y = player.y - crew.width; // Posisi crew sedikit di atas player

          if (crewscoreRef.current) {
            crewscoreRef.current.textContent = String(crewscore);
          }

        }
      });
    });
  };
  const isCollision = (obj1: { x: number, y: number, width: number, height: number }, obj2: { x: number, y: number, width: number, height: number }) => {
    return !(obj1.x + obj1.width < obj2.x || obj1.x > obj2.x + obj2.width || obj1.y + obj1.height < obj2.y || obj1.y > obj2.y + obj2.height);
  };

  const updateParallaxSpeed = () => {
    if (seaLayerRef.current && cloudLayerRef.current && beachLayerRef.current) {

      const adjustAnimationDuration = (
        layerRef: React.RefObject<HTMLElement>,
        baseDuration: number
      ) => {
        const elements = layerRef.current?.querySelectorAll('.image-container') || [];
        elements.forEach(el => {
          const element = el as HTMLElement;
          const currentDuration = parseFloat(element.style.animationDuration.replace('s', '')) || baseDuration;
          
          
          const newDuration = Math.max(currentDuration - 1, (baseDuration - (gameSpeed - 5) + 1)); // Kurangi 1 tetapi pastikan minimal 1 detik
          // element.style.animationDuration = `${newDuration}s`;
        });
      };
  
      adjustAnimationDuration(seaLayerRef, 15);
      adjustAnimationDuration(cloudLayerRef, 10);
      adjustAnimationDuration(beachLayerRef, 8);
    }
  };
  

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      backgroundRef.current = new ParallaxBackground(canvas.width, canvas.height);

      const groundLevel = (canvas.height); // canvas.height * heigtcanvas
      playersRef.current = [new Player(canvasRef.current.width, canvasRef.current.height, groundLevel)];

      // Start game loop | update is handle player, obstacle and crew
      update();
      
      const handleKeyDown = (event: KeyboardEvent) => {
        activeKeys.current.add(event.code);
        if (event.code === 'Space') {
          isSpacePressed = true; // Set true saat tombol Space ditekan.
          if (!holdTimer) {
            isHoldTriggered = false;
            holdTimer = window.setTimeout(() => {
              isHoldTriggered = true;
              
              playersRef.current.forEach((player) => player.jumpcharge());
              holdTimer = null; // Clear timer setelah charge.
            }, PRESS_HOLD_THRESHOLD);
            playersRef.current.forEach((player) => player.jump());
          }
        }
      };
      const handleKeyUp = (event: KeyboardEvent) => {
        activeKeys.current.delete(event.code);
        if (event.code === 'Space') {
          isSpacePressed = false; // Set false saat tombol Space dilepas.
          if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
          } 
        }
      };

      const handleTouchDown = (event: TouchEvent) => {
        if (event.touches[0].identifier) {
          isSpacePressed = true; // Set true saat tombol Space ditekan.
          if (!holdTimer) {
            isHoldTriggered = false;
            holdTimer = window.setTimeout(() => {
              isHoldTriggered = true;
              
              playersRef.current.forEach((player) => player.jumpcharge());
              holdTimer = null; // Clear timer setelah charge.
            }, PRESS_HOLD_THRESHOLD);
            playersRef.current.forEach((player) => player.jump());
          }
        }
      };
      const handleTouchUp = (event: TouchEvent) => {
        if (!event.touches[0].identifier) {
          isSpacePressed = false; // Set false saat tombol Space dilepas.
          if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
          } 
        }
      };


      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      document.addEventListener('touchstart', handleTouchDown);
      document.addEventListener('touchend', handleTouchUp);
      

      scheduleNextObstacle(0);
      scheduleNextCrew(0);
      const collisionInterval = setInterval(checkCollision, 100);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        clearInterval(collisionInterval);
      };
    }
  }, []);

  return (
    <>

      {/* <div className="parallax">
        <div ref={seaLayerRef} className="parallax-layer sea">
          <div className="image-container"></div>
          <div className="image-container"></div>
        </div>
        <div ref={cloudLayerRef} className="parallax-layer cloud">
          <div className="image-container"></div>
          <div className="image-container"></div>
        </div>
        <div ref={beachLayerRef} className="parallax-layer beach">
          <div className="image-container"></div>
          <div className="image-container"></div>
        </div>
      </div> */}
      <canvas ref={canvasRef} id="gameCanvas"></canvas>
      <div className='label-score' > 
        Score
        <strong ref={scoreRef} id="score">0</strong>
      </div>
      
      <div className='label-crewscore'>
        Crew 
        <strong ref={crewscoreRef} id="crewscore">0</strong>
      </div>
    </>
  );
};

export default GemaOmbak;