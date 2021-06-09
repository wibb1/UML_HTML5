// class constructs a sigle point
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//class combines a series of points to make up a line
class Path {
  constructor(ctx, penColor, size) {
    this.ctx = ctx;
    this.penColor = penColor;
    this.size = size;
    this.points = [];
  }
  //adds point on mousedown, mousemove with mousedown and ends with mouseup
  addPointFromEvent(e) {
    const x = e.pageX - this.ctx.canvas.offsetLeft;
    const y = e.pageY - this.ctx.canvas.offsetTop;
    this.addPoint(x, y);
  }
  //Adds a single point to the line
  addPoint(x, y) {
    this.points.push(new Point(x, y));
    this.render();
    console.log(this.penColor);
  }

  //renders the line: adds penColor line width and the ending of the line
  render() {
    this.ctx.save();
    this.ctx.strokeStyle = this.penColor;
    this.ctx.lineWidth = this.size;
    this.ctx.lineCap = "round";
    const [first, ...rest] = this.points;
    this.ctx.beginPath();
    this.ctx.moveTo(first.x, first.y);
    rest.forEach((point) => this.ctx.lineTo(point.x, point.y));
    this.ctx.stroke();
    this.ctx.restore();
  }
}

///Combines the lines and generates the canvas functions
class Paint {
  constructor(selector) {
    this.swatch = document.querySelector("#swatch");
    this.clearBtn = document.querySelector("#clear");
    this.sizeInput = document.querySelector("#size");
    this.saveBtn = document.querySelector("#save");
    this.pad = document.querySelector(selector);
    this.ctx = this.pad.getContext("2d");
    this.penColor = "black";
    this.size = 1;
    this.paths = [];
    this.path = new Path(this.ctx, this.penColor, this.size);
    this.drawing = false;
    this.setupEvents();
  }
  //combines all the action events
  setupEvents() {
    //mousedown begins a line
    this.pad.addEventListener("mousedown", (e) => {
      this.drawing = true;
      this.path.addPointFromEvent(e);
    });
    //mouseup ends a line
    this.pad.addEventListener("mouseup", (e) => {
      this.drawing = false;
      this.paths.push(this.path);
      this.path = new Path(this.ctx, this.penColor, this.size);
    });
    //mouse move is always registered only added on mouse down
    this.pad.addEventListener("mousemove", (e) => {
      if (this.drawing) {
        this.path.addPointFromEvent(e);
      }
    });
    //changes the penColor via penColor picker
    this.swatch.addEventListener("change", (e) => {
      this.setPenColor(e.target.value);
    });
    //clears the screen and resets the path to the selected variables
    this.clearBtn.addEventListener("click", (e) => {
      this.clear();
      console.log("clear)");
    });
    //saves image
    this.saveBtn.addEventListener("click", (e) => {
      this.saveImage();
    });
    //gets pen size
    this.sizeInput.addEventListener("input", (e) => {
      this.setSize(e.target.value);
      this.path = new Path(this.ctx, this.penColor, this.size);
      document.querySelector("span.value").textContent = this.size;
    });
  }
  //clears the screen
  clear() {
    this.paths = [];
    this.render();
  }
  //adds the penColor to the path
  setPenColor(penColor) {
    this.penColor = penColor;
    console.log(penColor);
    this.path = new Path(this.ctx, this.penColor, this.size);
  }
  //adds the size to the path
  setSize(size) {
    this.size = size;
  }

  //renders the drawing and the paths
  render() {
    this.ctx.clearRect(0, 0, this.pad.width, this.pad.height);
    this.paths.forEach((path) => path.render());
  }
  //saves the file
  saveImage() {
    const link = document.createElement("a");
    link.href = this.ctx.canvas.toDataURL("image/png");
    link.download = "SusiesSignsSample.png";
    link.click();
  }
}
//Creates a drawing
const app = new Paint("#app canvas");
