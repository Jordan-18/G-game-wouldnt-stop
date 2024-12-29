import React, { useEffect, useRef } from 'react';

const CanvasSetup: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
  }, []);

  return <canvas ref={canvasRef} id="canvas-gemaombak" />;
}

export default CanvasSetup;