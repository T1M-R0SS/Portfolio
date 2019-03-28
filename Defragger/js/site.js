
(function () {
  let requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

let width = window.innerWidth;
let height = window.innerHeight - 200;
let ball;
let bullet;
let powerup;
let plus;
let gameCanvas = document.getElementById('game');
let instructions = document.getElementById('slider');
let sliderImage = document.getElementById('slider_image');
let titleColour = document.getElementById('title');
let offset = -700;
let count = 0;
let sliderTimer = setInterval('Slide()', 9000);
let ctx = gameCanvas.getContext('2d');
let HUD = document.getElementById('HUD');
let hud = HUD.getContext('2d');

gameCanvas.width = width;
gameCanvas.height = height;
HUD.width = width;
HUD.height = 40;
let balls = [];
let bullets = [];
let powerups = [];
let pluses = [];
let reds = 0;
let greens = 0;
let blues = 0;
let rGoal = 3;
let gGoal = 3;
let bGoal = 3;
let system = 1;
let slowDown = false;
let ballTimer = setInterval('AddBall()', 500);
let powerupTimer = setInterval('AddPowerup()', 1200);
let resetSpeed = setTimeout('resetSpd()', 5000);
let ballRate = 5;
let powerupRate = 3;
let playerY;
let player = new Player(width, height, playerY);
let health = player.health;
let isAlive = true;
let audioLoop = true;

//////////////////////////////////////////
/////////// AUDIO ////////////////////////

let shoot = new Audio('audio/fire.wav');
let collect = new Audio('audio/collected.mp3');
let colourbomb = new Audio('audio/colourbomb.wav');
let wormhole = new Audio('audio/wormhole.wav');
let repairchip = new Audio('audio/repairchip.wav');
let gameover = new Audio('audio/gameover.wav');

function Slide()
{
  count++;
  sliderImage.setAttribute('style', 'margin-left: ' + count * offset + 'px;');
  switch(count)
  {
    case 0:
    {
      titleColour.setAttribute('style', 'text-shadow: 3px 3px #f00;');
      break;
    }
    case 1:
    {
      titleColour.setAttribute('style', 'text-shadow: 3px 3px #0f0;');
      break;
    }
    case 2:
    {
      titleColour.setAttribute('style', 'text-shadow: 3px 3px #00f;');
      break;
    }
  }
  if(count == 2)
  {
    count = -1;
  }
}

//////////////////////////////////////////////
////////////// UI Features ///////////////////

function DrawHealth()
{
  let xPos = 0;
  for(let i = 0; i < player.health; i++)
  {
    let cIndex = Math.ceil(player.health / 2);
    let hCol = ['#ff0000', '#ff3b00', '#ff7200', '#ff9900', '#ffcc00', '#f6ff00', '#bbff00', '#7fff00', '#3fff00', '#00ff08', '#00ff08'];
    
    hud.fillStyle = hCol[cIndex];
    hud.fillRect(width - 210 + xPos, 8, 8, 24);
    xPos +=10;
  }
  
}
function DrawHUD()
{
  hud.clearRect(0, 0, width, 40);
  hud.font = '20px Share Tech';
  hud.fillStyle = 'red';
  hud.fillText(reds + ' / ' + rGoal, 995, 28);

  hud.fillStyle = 'green';
  hud.fillText(greens + ' / ' + gGoal, 1045, 28);

  hud.fillStyle = 'blue';
  hud.fillText(blues + ' / ' + bGoal, 1095, 28);

  if(isAlive)
  {
    hud.fillStyle = 'white';
    hud.fillText('System ' + system, width / 2, 28);
  }
  else
  {
    hud.fillStyle = 'red';
    hud.fillText('GAME OVER --------- ' + system + ' systems cleared', 500, 28);
  }
  
}

//////////////////////////////////////////////
////////////// Player Features ///////////////

function DrawPlayer()
{
  let ship = new Image();
  ship.src = 'images/ship.png';
  ctx.drawImage(ship, player.x, player.y);
  // ctx.fillStyle = player.background;
  // ctx.fillRect(player.x, player.y, 20, 20);
}

function MovePlayer()
{
  player.Move(playerY);
}

function pMove()
{
  let e = window.event;
  playerY = e.clientY - 110;
}

//////////////////////////////////////////////
////////////// Bullet Features ///////////////

function DrawBullets()
{
  for(let i = 0; i < bullets.length; i++)
  {
    ctx.fillStyle = bullets[i].background;
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
  }
}

function Fire()
{
  let e = window.event;
  e.preventDefault();
  let code = e.keyCode;
  switch(code)
  {
    case 65:
    { // shoot red
      bullet = new Bullet(width, height, 0);
      bullets.push(bullet);
      break;
    }
    case 83:
    {
      // shoot green
      bullet = new Bullet(width, height, 1);
      bullets.push(bullet);
      break;
    }
    case 68:
    {
      // shoot blue
      bullet = new Bullet(width, height, 2);
      bullets.push(bullet);
      break;
    }
  }
  shoot.play();
}

function MoveBullets()
{
  for(let i = 0; i < bullets.length; i++)
  {
    bullets[i].Move();
  }  
}

function CheckBullets()
{
  for(let i = 0; i < bullets.length; i++)
  {
    if(bullets[i].x <= 0)
    {
      bullets.splice(i, 1);
    }
  }
}

function DrawPlus()
{
  for(let i = 0; i < pluses.length; i++)
  {
    ctx.font = '55px Arial';
    ctx.fillStyle = pluses[i].background;
    ctx.fillText('+', pluses[i].x, pluses[i].y);
  }
}

function MovePlus()
{
  for(let i = 0; i < pluses.length; i++)
  {
    pluses[i].Move();
  }
}

function CheckPlus()
{
  for(let i = 0; i < pluses.length; i++)
  {
    if(pluses[i].y <= 0)
    {
      pluses.splice(i, 1);
    }
  }
}

///////////////////////////////////////////////
/////////////// Powerup Features //////////////

function DrawPowerups()
{
  for(let i = 0; i < powerups.length; i++)
  {
    ctx.beginPath();
    ctx.fillStyle = powerups[i].background;
    ctx.fillRect(powerups[i].x, powerups[i].y, powerups[i].width, powerups[i].height);
  }
}

function AddPowerup()
{
  let timer = Math.floor((Math.random() * 50) + 1);
  if(timer < powerupRate)
  {
    powerup = new Powerup(width, height);
    powerups.push(powerup);
  }
}

function MovePowerups()
{
  for(let i = 0; i < powerups.length; i++)
  {
    powerups[i].Move();
  }
}

function CheckPowerups()
{
  for(let i = 0; i < powerups.length; i++)
  {
    if(powerups[i].x > width)
    {
      powerups.splice(i, 1);
    }
  }
}

function colorBomb(color)
{
  for(let i = 0; i < balls.length; i++)
  {
    if(balls[i].background == color)
    {
      colorCount(color);
      balls.splice(i, 1);
    }
  }
  colourbomb.play();
}

function colorCount(color) // adds each color bombed enemy to system total
{
  switch(color)
  {
    case('#f00'):
    {
      reds++;
      if(reds > rGoal)
      {
        reds = rGoal;
      }
      break;
    }
    case('#0f0'):
    {
      greens++;
      if(greens > gGoal)
      {
        greens = gGoal;
      }
      break;
    }
    case('#00f'):
    {
      blues++;
      if(blues > bGoal)
      {
        blues = bGoal;
      }
      break;
    }
  }
}

function setSpd()
{
  for(let i = 0; i < balls.length; i++)
  {
    balls[i].spd = 2;
  }
}

function resetSpd()
{
  for(let i = 0; i < balls.length; i++)
  {
    balls[i].spd = 5;
  }
  slowDown = false;
}

//////////////////////////////////////////////
////////////// Ball Features /////////////////

function AddBall()
{
  let timer = Math.floor((Math.random() * 50) + 1);
  if(timer < ballRate)
  {
    ball = new Ball(width, height);
    balls.push(ball);
  }
}

function DrawBalls()
{
  ctx.clearRect(0, 0, width, height);
  for(let i = 0; i < balls.length; i++)
  {
    ctx.beginPath();
    ctx.fillStyle = balls[i].background;
    ctx.fillRect(balls[i].x, balls[i].y, balls[i].width, balls[i].height);
  }
}

function MoveBalls()
{
  for(let i = 0; i < balls.length; i++)
  {
    balls[i].Move();
  }
}

function CheckBalls()
{
  for(let i = 0; i < balls.length; i++)
  {
    if(balls[i].x > width)
    {
      balls.splice(i, 1);
      player.health--;
    }
  }
}

//////////////////////////////////////////////
////////////// Collision Detection ///////////

function collisionDetected(shapeA, shapeB)  // checks bullets against enemy objects
{
  let vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)); // difference between the two center x's
  let vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)); // difference between the two center y's   
  let hWidths = (shapeA.width / 2) + (shapeB.width / 2); // sum of the two halves x
  let hHeights = (shapeA.height / 2) + (shapeB.height / 2); // sum of the two halves y
  let isHit = null;
  
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights)  // collision detected
    {
      isHit = 1;  // just a magic number for now
      return isHit;
    }
}

ballTimer = setInterval('AddBall()', 500);
powerupTimer = setInterval('AddPowerup()', 1200);
sliderTimer = setInterval('Slide()', 9000);

function Update() {
  CheckBalls();
  CheckBullets();
  CheckPowerups();
  CheckPlus();
  DrawBalls();
  MoveBalls();
  if(isAlive)
  {
    DrawPlayer();
    MovePlayer();
  }
  
  DrawBullets();
  MoveBullets();
  DrawPowerups();
  if(slowDown)
  {
    setSpd();
  }
  MovePowerups();
  DrawHUD();
  DrawHealth();
  DrawPlus();
  MovePlus();

  ////////////////////////////////////////////////////////////
  ////////////////// NEXT SYSTEM /////////////////////////////

  let systemTotal = reds + greens + blues;  // total of all the colours collected
  let systemGoal = rGoal + gGoal + bGoal; // total of how many of each is required per system
  if(systemTotal >= systemGoal)
  {
    reds = 0;
    greens = 0;
    blues = 0;
    balls = [];
    bullets = [];
    powerups = [];
    player.health = player.maxHealth;
    system += 1;
    rGoal += 2;
    gGoal += 2;
    bGoal += 2;
    ballRate += 2;
  }

  if(player.health <= 0)
  {
    isAlive = false;
    if(audioLoop)
    {
      gameover.play();
    }
    audioLoop = false;
  }
  
  ///////////////////////////////////////////////////////////
  ///////////////// BALL/BULLET COLLISION ///////////////////
  
  for(let i = 0; i < bullets.length; i++) // loops through every bullet
  {
    for(let j = 0; j < balls.length; j++) // loops through every enemy
    {
      let ballVbullet = collisionDetected(bullets[i], balls[j]);
      if(ballVbullet != null) // collision
      {
        if(bullets[i].background == balls[j].background)  // if the colors match
        {
          switch(balls[j].background)
          {
            case('#f00'): // reds
            {
              if(reds < rGoal)
              {
                reds++;
              }
              plus = new Plus(balls[j].x, balls[j].y, 0);
              pluses.push(plus);
              break;
            }
            case('#0f0'): // greens
            {
              if(greens < gGoal)
              {
                greens++;
              }
              plus = new Plus(balls[j].x, balls[j].y, 1);
              pluses.push(plus);
              break;
            }
            case('#00f'): // blues
            {
              if(blues < bGoal)
              {
                blues++;
              }
              plus = new Plus(balls[j].x, balls[j].y, 2);
              pluses.push(plus);
              break;
            }
          } // switch
          balls.splice(j, 1);
          bullets.splice(i, 1);
          collect.play();
        }
        else
        {
          player.health -= 1;
          bullets.splice(i, 1);
        }
      } // collision
      if (bullets.indexOf(bullets[i]) !== i)  // prevents the first for loop from skipping an iteration b/c of the splice.
      {
        i--;
      }
      if(bullets.length <= 1) // makes sure the for loop doesn't continue if there's only one bullet left.
      {
        break;
      }
    } // inner forloop
  } // outer forloop
  
  ///////////////////////////////////////////////////////////
  ///////////////// PLAYER/POWERUP COLLISION ////////////////

  for(let i = 0; i < powerups.length; i++)
  {
    let pCollected = collisionDetected(player, powerups[i]);
    if(pCollected != null)
    {
      switch(powerups[i].background)
      {
        case('#f00'): // red bomb
        {
          colorBomb('#f00');
          powerups.splice(i, 1);
          break;
        }
        case('#0f0'): // green bomb
        {
          colorBomb('#0f0');
          powerups.splice(i, 1);
          break;
        }
        case('#00f'): // blue bomb
        {
          colorBomb('#00f');
          powerups.splice(i, 1);
          break;
        }
        case('#0ff'): // gain health
        {
          player.health += 2;
          if(player.health >= player.maxHealth)
          {
            player.health = player.maxHealth;
          }
          repairchip.play();
          powerups.splice(i, 1);
          break;
        }
        case('#ff0'): // slows down enemies
        {
          slowDown = true;
          resetSpeed = setTimeout('resetSpd()', 5000);
          wormhole.play();
          powerups.splice(i, 1);
          break;
        }
      }
    }
  }

  requestAnimationFrame(Update); // recalls Update
}

//--------------------> MOUSE EVENT LISTENER <----------------------//
window.addEventListener("mousemove", function () {
  pMove();
});

//--------------------> KEY PRESS EVENT LISTENER <----------------------//
document.body.addEventListener("keydown", function () {
  Fire();
});

//--------------------> ONLOAD EVENT LISTENER <---------------------//
window.addEventListener("load", function () {
    Update();
});