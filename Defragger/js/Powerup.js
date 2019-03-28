
class Powerup {
  constructor(cWidth, cHeight) {
    this.colors = ['#f00', '#0f0', '#00f', '#0ff', '#ff0'];
    this.background = this.colors[(Math.floor(Math.random() * this.colors.length))];
    this.maxY = cHeight - 50;
    this.minY = 50;
    this.x = 1;
    this.y = (Math.random() * (this.maxY - this.minY)) + this.minY;
    this.width = 18;
    this.height = 18;
  }  // constructor

  Move() {
    this.x += 8;
  }

} // class