// global variabel
let drawheight = 500;
let drawwidth = 365;

interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AnimationState {
  frames: AnimationFrame[];
  frameRate: number;
}

class Sprite {
  private image: HTMLImageElement;
  private animations: Map<string, AnimationState>;
  private currentAnimation: string;
  private currentFrame: number;
  private frameTimer: number;
  private lastUpdate: number;
  private isImageLoaded: boolean;
  private errorState: string | null;
  private flipX: boolean;

  constructor(imageSrc: string) {
      this.image = new Image();
      this.animations = new Map();
      this.currentAnimation = '';
      this.currentFrame = 0;
      this.frameTimer = 0;
      this.lastUpdate = performance.now();
      this.isImageLoaded = false;
      this.errorState = null;
      this.flipX = false;

      this.image.onload = () => {
          this.isImageLoaded = true;
          this.errorState = null;
      };

      this.image.onerror = (error) => {
          this.errorState = `Failed to load sprite image: ${error}`;
          console.error(this.errorState);
      };

      this.image.src = imageSrc;
  }

  addAnimation(name: string, frameCount: number, rowIndex: number, frameWidth: number, frameHeight: number, frameRate: number) {
      try {
          const frames: AnimationFrame[] = [];
          
          for (let i = 0; i < frameCount; i++) {
              frames.push({
                  x: i * frameWidth,
                  y: rowIndex * frameHeight,
                  width: frameWidth,
                  height: frameHeight
              });
          }

          this.animations.set(name, {
              frames,
              frameRate
          });

          if (!this.currentAnimation) {
              this.currentAnimation = name;
          }
      } catch (error) {
          this.errorState = `Failed to add animation '${name}': ${error}`;
          console.error(this.errorState);
      }
  }

  setAnimation(name: string) {
      try {
          if (!this.animations.has(name)) {
              throw new Error(`Animation '${name}' not found`);
          }
          if (this.currentAnimation !== name) {
              this.currentAnimation = name;
              this.currentFrame = 0;
              this.frameTimer = 0;
          }
      } catch (error) {
          this.errorState = `Failed to set animation '${name}': ${error}`;
          console.error(this.errorState);
      }
  }

  setFlipX(flip: boolean) {
      this.flipX = flip;
  }

  update(deltaTime: number) {
      if (!this.isImageLoaded || this.errorState) return;

      try {
          const animation = this.animations.get(this.currentAnimation);
          if (!animation) return;

          const now = performance.now();
          const actualDeltaTime = now - this.lastUpdate;
          this.lastUpdate = now;

          this.frameTimer += actualDeltaTime;
          if (this.frameTimer >= 1000 / animation.frameRate) {
              this.currentFrame = (this.currentFrame + 1) % animation.frames.length;
              this.frameTimer = 0;
          }
      } catch (error) {
          this.errorState = `Animation update failed: ${error}`;
          console.error(this.errorState);
      }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
      if (!this.isImageLoaded || this.errorState) {
          ctx.fillStyle = this.errorState ? 'red' : 'gray';
          ctx.fillRect(x, y, width, height);
          return;
      }

      try {
          const animation = this.animations.get(this.currentAnimation);
          if (!animation) throw new Error('No animation selected');

          const frame = animation.frames[this.currentFrame];

          ctx.save();
          if (this.flipX) {
              ctx.scale(-1, 1);
              ctx.translate(-x - width, 0);
          } else {
              ctx.translate(x, 0);
          }

          ctx.drawImage(
              this.image,
              frame.x,
              frame.y,
              frame.width,
              frame.height,
              this.flipX ? 0 : 0,
              y,
              width,
              height
          );

          ctx.restore();
      } catch (error) {
          this.errorState = `Drawing failed: ${error}`;
          console.error(this.errorState);
          ctx.fillStyle = 'red';
          ctx.fillRect(x, y, width, height);
      }
  }

  isReady(): boolean {
      return this.isImageLoaded && !this.errorState;
  }

  getError(): string | null {
      return this.errorState;
  }
}

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
    private sprite: Sprite;
    originalAspectRatio: number;
  
    constructor(
        canvasWidth: number,
        canvasHeight: number,
        groundLevel: number, 
        gravity = 0.2, 
        jumpStrength = 8, 
        maxJumpStrength = 25
    ) {
      // this.width = canvasWidth * 0.09;
      this.height = canvasHeight * 0.3;
      this.x = canvasWidth;
      this.y = groundLevel - this.height;
      this.yVelocity = 0;
      this.xVelocity = 0;
      this.onGround = true;
      this.gravity = gravity;
      this.jumpStrength = jumpStrength;
      // this.jumpStrength = (this.height / 0.2) < 1000 ? jumpStrength : 8;
      this.groundLevel = groundLevel;
      this.maxJumpStrength = maxJumpStrength;
      this.chargeDuration = 0;
      this.sprite = new Sprite('ombak/base-model/base-model.png')
      this.originalAspectRatio = drawwidth/drawheight;
      this.width = this.height * this.originalAspectRatio;

      // (
      //    'Idle', *animation Name
      //    15, * number of frames
      //    0.1, * row index
      //    613, * image width
      //    512, * image height
      //    16 * frame rate
      // )

      this.sprite.addAnimation('Run', 15, 0, drawwidth, drawheight, 30);       // Third row (y=64)
      this.sprite.addAnimation('Jump', 15, 2.25, drawwidth, drawheight, 15);    // Fourth row (y=96)

      this.sprite.setAnimation('Run');

    }

    update(isSpacePressed: boolean, gameSpeed: number) {

        if (!this.onGround) {
            const thresholdGravity = (this.height / 0.2) < 1000 ? 0.3 : 0.3
            
            this.yVelocity += this.gravity * (isSpacePressed ? 0.3 : 0.8); // Kurangi gravitasi saat Space ditekan.
        }
        this.y += this.yVelocity;
        this.x += this.xVelocity * 0.5;
        

        if (this.y >= this.groundLevel - this.height) {
          this.y = this.groundLevel - this.height;
          this.onGround = true;
          this.yVelocity = 0;
        }
        
        if (this.y === this.groundLevel - this.height && this.x > this.width) {
          this.x -= (gameSpeed + 0.1);
          this.xVelocity = 0;
        }
        

        if (!this.onGround) {
            this.sprite.setAnimation('Jump');
        } else if (Math.abs(this.xVelocity) > 0) {
            this.sprite.setAnimation('Run');
        } else {  
            this.sprite.setAnimation('Run');
        }
             
        this.sprite.setFlipX(this.xVelocity < 0); // Set sprite direction based on movement
        this.sprite.update(gameSpeed); // Update sprite animation

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
      const drawWidth = this.height * this.originalAspectRatio;

      this.sprite.draw(ctx, this.x, this.y, drawWidth, this.height);

      // Tampilkan border collision dengan warna semi-transparent
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)'; // Merah semi-transparent
      ctx.lineWidth = 2;  // Ketebalan garis
      ctx.strokeRect(this.x, this.y, drawWidth, this.height);
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
  private sprite: Sprite;
  originalAspectRatio: number;

  constructor(
      canvasWidth: number, 
      canvasHeight: number,
      groundLevel: number, 
      gameSpeed = 3,
  ) {
    this.width = canvasWidth * 0.09;
    this.height = canvasHeight * 0.3;
    this.x = canvasWidth;
    this.y = groundLevel - this.height;
    this.gameSpeed = gameSpeed;
    this.isCollected = false;
    this.offset = Math.random() * 50 - 10;
    this.jumpDelay = null; // Initial delay
    this.jumpStartTime = null; // No jump yet
    this.originalAspectRatio = drawwidth/drawheight;
    this.width = this.height * this.originalAspectRatio;

    this.sprite = new Sprite('ombak/base-model/base-model.png')

    this.sprite.addAnimation('Run', 15, 0, drawwidth, drawheight, 30);       // Third row (y=64)
    this.sprite.addAnimation('Idle', 15, 1.15, drawwidth, drawheight, 15);   // First row (y=0)
    this.sprite.addAnimation('Jump', 15, 2.3, drawwidth, drawheight, 15);    // Fourth row (y=96)

    this.sprite.setAnimation('Idle');
  }

  update(playerX: number, playerY: number, gameSpeed: number) {
    
    if (this.isCollected) {
      // set if crew is collected
      this.x = playerX - (this.width - 50) - this.offset;
      this.y = playerY;
      
    } else {
      this.x -= this.gameSpeed;
    }


    if(this.isCollected){
      this.sprite.setAnimation('Run');
    }else{
      this.sprite.setAnimation('Idle');
    }

    // Update sprite animation
    this.sprite.update(gameSpeed);
  }

  draw(ctx: CanvasRenderingContext2D) {
    const drawWidth = this.height * this.originalAspectRatio;

    this.sprite.draw(ctx, this.x, this.y, drawWidth, this.height);

    ctx.strokeStyle = 'rgba(0, 42, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, drawWidth, this.height);
  }
}

// Background layer class to handle individual parallax layers
class ParallaxLayer {
  private image: HTMLImageElement;
  private x1: number = 0;
  private x2: number;
  private speed: number;
  private width: number;
  private height: number;
  private y: number;
  private isImageLoaded: boolean = false;

  constructor(imageSrc: string, speed: number, width: number, height: number, y: number = 0) {
      this.image = new Image();
      this.image.src = imageSrc;
      this.speed = speed;
      this.width = width;
      this.height = height;
      this.y = y;
      this.x2 = width;

      this.image.onload = () => {
          this.isImageLoaded = true;
      };
  }

  update(gameSpeed: number) {
      this.x1 -= this.speed * gameSpeed;
      this.x2 -= this.speed * gameSpeed;

      // Reset positions when image moves off screen
      if (this.x1 <= -this.width) {
          this.x1 = this.width + this.x2 - this.speed;
      }
      if (this.x2 <= -this.width) {
          this.x2 = this.width + this.x1 - this.speed;
      }
  }

  draw(ctx: CanvasRenderingContext2D) {
      if (!this.isImageLoaded) return;

      // Draw first image
      ctx.drawImage(
          this.image,
          this.x1,
          this.y,
          this.width,
          this.height
      );

      // Draw second image
      ctx.drawImage(
          this.image,
          this.x2,
          this.y,
          this.width,
          this.height
      );
  }
}

// Background manager to handle all parallax layers
export class ParallaxBackground {
  private layers: ParallaxLayer[] = [];
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;

      this.layers = [
          new ParallaxLayer(
              'ombak/bg-parallax/1.2.sea.png',
              0.5,
              canvasWidth,
              canvasHeight
          ),
          new ParallaxLayer(
              'ombak/bg-parallax/2.cloud.png',
              1,
              canvasWidth,
              canvasHeight
          ),
          new ParallaxLayer(
              'ombak/bg-parallax/beach-2.png',
              1.5,
              canvasWidth,
              canvasHeight * 0.2,
              canvasHeight * 0.8 // Position at bottom 20% of canvas
          )
      ];
  }

  update(gameSpeed: number) {
      this.layers.forEach(layer => layer.update(gameSpeed));
  }

  draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      this.layers.forEach(layer => layer.draw(ctx));
      ctx.restore();
  }
}