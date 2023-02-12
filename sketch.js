// The ISS is not here
// How to take (semi)-useful data and present it in a useless way

// Jamie Shilvock

let jsonData;
let img;
let lat;
let long;
let normalizedLat;
let normalizedLong;
let randomX;
let randomY;
let oldX;
let oldY;
let lerpFloat = 0;
let lerpSpeed = 0.03;
let waitBool = false;

function preload() {
  img = loadImage('assets/worldmap.png');
}

function setup() {
  createCanvas(1920, 960);
  frameRate(30);
  image(img, 0, 0);

  // get ISS location first then get a wrong location
  getISSLocation();
  getLocationThatIsntCorrect();

  // start in the middle of the canvas
  oldX = 1920/2;
  oldY = 960/2;
}

function draw() {
  image(img, 0, 0);

  // lerp to check if the crosshairs have reached the target destination
  if (lerpFloat <= 1) {  
    drawCrosshair(lerp(oldX, randomX, lerpFloat), lerp(oldY, randomY, lerpFloat));
    lerpFloat = lerpFloat + lerpSpeed;

  // else keep crosshairs still for a set time
  } else {
    drawCrosshair(randomX, randomY);
    if (!waitBool) {
      waitBool = true;
      waitForTime(1000);
    }
  }
}

function getISSLocation () {
  // get request to return current ISS location
  httpGet('http://api.open-notify.org/iss-now.json', 'json', false, function(response) {
    jsonData = response;
    lat = jsonData.iss_position.latitude;
    long = jsonData.iss_position.longitude;  
    normalizedLat = map(lat, -90, 90, height, 0);
    normalizedLong = map(long, -180, 180, 0, width);
  });
}

function getLocationThatIsntCorrect () {
  // get random normalized location and check if it matches the current normalized ISS location
  randomX = random(0, 1920);
  randomY = random(0 , 960);
  if (randomX != normalizedLong && randomY != normalizedLat) {
    return(true);
  }
  else {
    getLocationThatIsntCorrect();
  }
}

function drawCrosshair(x, y) {
  // draw crosshair shapes
  stroke(255);
  noFill();
  circle(x, y, 30);
  stroke(255);
  line(x + 20, y, windowWidth, y);
  line(x - 20, y, 0, y);
  line(x, y + 20, x, windowHeight);
  line(x, y - 20, x, 0);

  // if we have reached the target destination, draw the text too
  if (lerpFloat >= 1) {  
    fill(255);
    stroke(0);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(15);
    text('The ISS is not here', x, y - 20);
  }
}

function waitForTime(milliseconds) {
  setTimeout(function() {
    // code to be executed after waiting 
    waitBool = false;  
    oldX = randomX;
    oldY = randomY;
    getISSLocation();
    getLocationThatIsntCorrect();
    lerpFloat = 0;
  }, milliseconds);
}