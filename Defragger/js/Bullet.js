
class Bullet {
  constructor(cWidth, cHeight, color) {
    this.x = player.x - 10;
    this.y = player.y;
    this.width = 15;
    this.height = 15;
    this.colors = ['#f00', '#0f0', '#00f'];
    this.background = this.colors[color];
  } // constructor

    Move()
    {
      this.x -= 5;
    }
} // class