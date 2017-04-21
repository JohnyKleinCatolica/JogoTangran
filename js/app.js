var endGame = false, isIn = false;

var tangram = {
  trianguloGrande1: {
    color: '',
    status: false
  },
  trianguloGrande2: {
    color: '',
    status: false
  },
  trianguloMedio: {
    color: '',
    status: false
  },
  trianguloPequeno1: {
    color: '',
    status: false
  },
  trianguloPequeno2: {
    color: '',
    status: false
  },
  quadrado: {
    color: '',
    status: false
  },
  paralelogramo: {
    color: '',
    status: false
  },
};

function init() {

  // Initialise our object
  obj = { x: 300, y: 50, w: 70, h: 70 };
  model = { x: 50, y: 50, w: 70, h: 70 };

  canvas = document.getElementById("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener('touchmove', function () {
    var touch = event.targetTouches[0];

    if (endGame === true) return;

    if (detectHit(obj.x, obj.y, touch.pageX, touch.pageY, obj.w, obj.h)) {
      obj.x = touch.pageX;
      obj.y = touch.pageY;
      draw();
    }

    if (obj.x > model.x - 3 && obj.x < model.x + 3 && obj.y > model.y - 3 && obj.y < model.y + 3) {
      isIn = true;
    } else {
      isIn = false;
    }

    console.log(isIn);

    event.preventDefault();
  }, false);
  draw();
}

function detectHit(x1, y1, x2, y2, w, h) {
  if (x2 - x1 > w) return false;
  if (y2 - y1 > h) return false;
  return true;
}


function draw() {
  canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');



  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //model.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'gray';
  ctx.fillRect(model.x, model.y, model.w, model.h);

  ctx.fillStyle = 'blue';
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);


  //model.clearRect(0, 0, canvas.width, canvas.height);

}

TouchEmulator();
init();
