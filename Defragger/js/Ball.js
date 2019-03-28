
class Ball {
  constructor(cWidth, cHeight) {
    this.colors = ['#f00', '#0f0', '#00f'];
    this.background = this.colors[(Math.floor(Math.random() * this.colors.length))];
    this.maxY = cHeight - 50;
    this.minY = 50;
    this.x = 1;
    this.y = (Math.random() * (this.maxY - this.minY)) + this.minY;
    this.width = 22;
    this.height = 48;
    this.spd = 5;
  } // constructor

  Move() {
    this.x += this.spd;
  }
} // class