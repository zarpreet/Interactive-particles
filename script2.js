const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 12;
let adjustY = 2;
const mouse = {
  x: null,
  y: null,
  radius: 250,
};

let textToDisplay = "sam."; // Initial text

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

function getValue() {
  let txt = document.getElementById("txt");
  textToDisplay = txt.value; // Update the textToDisplay variable with user input
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colorDistance = 0;
    this.size = 2;
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
  for (let y = 0; y < canvas.height; y += 20) {
    for (let x = 0; x < canvas.width; x += 20) {
      particleArray.push(new Particle(x, y));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      opacityValue = 1 - distance / 30;
      if (distance < 30) {
        if (particleArray[a].colorDistance < mouse.radius) {
          // Calculate the angle between the particle and the mouse
          const angle = Math.atan2(mouse.y - particleArray[a].y, mouse.x - particleArray[a].x);
        
          // Map the angle to a color in the RGB spectrum
          const red = Math.round(Math.sin(angle) * 127 + 128);
          const green = Math.round(Math.sin(angle + (2 * Math.PI / 3)) * 127 + 128);
          const blue = Math.round(Math.sin(angle + (4 * Math.PI / 3)) * 127 + 128);
        
          ctx.strokeStyle = "rgb(" + red + "," + green + "," + blue + "," + opacityValue + ")";
        } else {
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

init();
animate();
