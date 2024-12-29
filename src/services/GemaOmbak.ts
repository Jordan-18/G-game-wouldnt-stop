export class Player {
    width: number;
    height: number;
    x: number;
    y: number;
    yVelocity: number;
    xVelocity: number;
    onGround: boolean;
    gravity: number;
    jumpStrength: number;
    groundLevel: number;
    maxJumpStrength: number;
    chargeDuration: number;
  
    constructor(
        canvasWidth: number,
        canvasHeight: number,
        groundLevel: number, 
        gravity = 0.2, 
        jumpStrength = 8, 
        maxJumpStrength = 25
    ) {
      this.width = canvasWidth * 0.05;
      this.height = canvasHeight * 0.2;
      this.x = canvasWidth * 0.1;
      this.y = groundLevel - this.height;
      this.yVelocity = 0;
      this.xVelocity = 0;
      this.onGround = true;
      this.gravity = gravity;
      // this.jumpStrength = jumpStrength;
      this.jumpStrength = (this.height / 0.2) < 1000 ? jumpStrength : 10;
      this.groundLevel = groundLevel;
      this.maxJumpStrength = maxJumpStrength;
      this.chargeDuration = 0;
    }

    update(isSpacePressed: boolean, gameSpeed: number) {
        if (!this.onGround) {
            const thresholdGravity = (this.height / 0.2) < 1000 ? 0.3 : 0.3
            
            this.yVelocity += this.gravity * (isSpacePressed ? 0.3 : 0.8); // Kurangi gravitasi saat Space ditekan.
        }
        this.y += this.yVelocity;
        this.x += this.xVelocity;
      
        if (this.y >= this.groundLevel - this.height) {
          this.y = this.groundLevel - this.height;
          this.onGround = true;
          this.yVelocity = 0;
        }
        
        if (this.y === this.groundLevel - this.height && this.x > this.width) {
          this.x -= (gameSpeed + 0.1);
          this.xVelocity = 0;
        }
    }      
  
    jump() {
      if (this.onGround) {
        this.yVelocity = -this.jumpStrength
        this.onGround = false

        this.xVelocity = 2
      }
    }

    jumpcharge(){
      if (this.onGround) {
        const strength = Math.min(this.jumpStrength + this.chargeDuration/10, this.maxJumpStrength)
        
        this.yVelocity = -strength
        this.onGround = false

        this.xVelocity = 4

        this.chargeDuration = 0
      }
    }

    charge(){
        if(this.onGround){
            this.chargeDuration += 1
        }
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
  
export class Obstacle {
    width: number;
    height: number;
    x: number;
    y: number;
    gameSpeed: number;
    isCollocted: boolean;
  
    constructor(
        canvasWidth: number, 
        canvasHeight: number,
        groundLevel: number, 
        gameSpeed = 3
    ) {
      this.width = canvasWidth * 0.05;
      this.height = canvasHeight * 0.2;
      this.x = canvasWidth;
      this.y = groundLevel - this.height;
      this.gameSpeed = gameSpeed;
      this.isCollocted = false;
    }
  
    update() {
      this.x -= this.gameSpeed;
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}  

export class Crew {
  width: number;
  height: number;
  x: number;
  y: number;
  gameSpeed: number;
  isCollected: boolean;
  offset: number;
  jumpDelay: number | null; // Delay waktu lompatan
  jumpStartTime: number | null; // Waktu awal lompatan player

  constructor(
      canvasWidth: number, 
      canvasHeight: number,
      groundLevel: number, 
      gameSpeed = 3,
  ) {
    this.width = canvasWidth * 0.05;
    this.height = canvasHeight * 0.2;
    this.x = canvasWidth;
    this.y = groundLevel - this.height;
    this.gameSpeed = gameSpeed;
    this.isCollected = false;
    this.offset = Math.random() * 50 + 10;
    this.jumpDelay = null; // Initial delay
    this.jumpStartTime = null; // No jump yet
  }

  update(playerX: number, playerY: number) {
    
    if (this.isCollected) {
      this.x = playerX - (this.width * 1.15) - this.offset;

      
      
      if (this.jumpStartTime !== null) {
        const currentTime = Date.now();
        
        if (currentTime - this.jumpStartTime >= (this.jumpDelay || 0)) {
          this.y -= 10; // Lompatan crew
          if (this.y <= playerY - 150) {
            this.y = playerY - 150; // Tentukan ketinggian maksimum lompatan
          }
        }
        
      }
      this.y = playerY;

    } else {
      this.x -= this.gameSpeed;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'pink';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  startJump(playerJumpTime: number) {
    this.jumpDelay = 20000; // Delay hingga 500 ms
    this.jumpStartTime = playerJumpTime; // Waktu mulai lompatan player
  }
}