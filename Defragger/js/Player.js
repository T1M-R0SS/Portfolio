
class Player {
  constructor(cWidth, cHeight, playerY) {
    this.background = '#737';
    this.x = cWidth - 80;
    this.y = playerY;
    this.width = 28;
    this.height = 32;
    this.minY = 50;
    this.maxY = cHeight - 40;
    this.health = 20;
    this.maxHealth = 20;
  } // constructor

  Move()
  {
    this.y = playerY;
    if(this.y >= this.maxY)
    {
      this.y = this.maxY;
    }
    if(this.y <= this.minY)
    {
      this.y = this.minY;
    }
  }
  
} // class