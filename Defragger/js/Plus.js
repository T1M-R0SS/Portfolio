
class Plus {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.alpha = '1';
    this.colors = ['255, 0, 0, ', '0, 255, 0, ', '0, 0, 255, ',]
    this.background = 'rgba('+ this.colors[color] + this.alpha +')';
  } // constructor

  Move()
  {
    this.y -= 7;
    this.alpha -= .2;
  }
} // class