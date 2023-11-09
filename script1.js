const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 2;
let adjustY = 0;
const mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

var customInputElements = document.getElementsByClassName("custom-input");

var sizeABC = 2;
var userInput;

// Iterate through the elements and add the event listener to each

for (var i = 0; i < customInputElements.length; i++) {
  customInputElements[i].addEventListener("input", function() {

    if (this.id === "textInput") {
      userInput = this.value; // Access the value of the "textInput" element
    } else if (this.id === "Input") {
      // Handle Input
      var InputValue = this.value;

      // Update the mouse radius based on InputValue
      if (!isNaN(InputValue)) {
        mouse.radius = InputValue;
      }
    } else if (this.id === "Num") {
      // Handle Num input
      var NumValue = this.value;

      // Update the sizeABC based on InputValue
      if (!isNaN(NumValue)) {
        sizeABC = NumValue;
      } else {
        sizeABC = 2; // Default value if the input is not a valid number
      }
    }

ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  var fontSize = 20 - userInput.length; // You can adjust this formula
  ctx.font = fontSize + "px Verdana";
  ctx.fillText(userInput, 0, 30);

  // Split the input text by spaces to get individual words
  // const words = userInput.split(" ");

  // let x = 0;
  // let y = 30;

  // for (const word of words) {
  //   ctx.fillText(word, x, y); // Draw the word
  //   y += fontSize + 5; // Move to the next line
  // }

const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colorDistance = 0;
    this.size = sizeABC;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 40 + 5;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    this.colorDistance = distance;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function init() {
  particleArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 120
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 20, positionY * 20));
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();


function connect() {
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let opacityValue = 1 - distance / 30;


      // Calculate a color that changes over time for the lines
      const colorChangeSpeed = 0.01; // You can adjust the speed
      let colorAngle = (performance.now() * colorChangeSpeed) % (2 * Math.PI);

      const red = Math.round(Math.sin(colorAngle) * 127 + 128);
      const green = Math.round(Math.sin(colorAngle + (2 * Math.PI / 3)) * 127 + 128);
      const blue = Math.round(Math.sin(colorAngle + (4 * Math.PI / 3)) * 127 + 128);

      if (distance < 30) {
        if (particleArray[a].colorDistance < mouse.radius) {
        ctx.strokeStyle = "rgb(" + red + "," + green + "," + blue + "," + opacityValue + ")";
        }else {
          ctx.strokeStyle = "rgb(255,255,255," + opacityValue + ")";
        }


        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}
});
}