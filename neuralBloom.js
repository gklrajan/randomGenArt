let dfFTrace = [
  0.34438196, 0.33824408, 0.33598438, 0.33526227, 0.33559600,
  0.34091786, 0.34605381, 0.35385692, 0.36650470, 0.38006786,
  0.40052783, 0.42725787, 0.46123886, 0.50608182, 0.70177126,
  0.97243309, 0.97232479, 0.97226351, 0.97220618, 0.97243887,
  0.97260481, 0.97281528, 0.97320968, 0.97344244, 0.97352225,
  0.97373146, 0.97334439, 0.97163010, 0.96786875, 0.95916885,
  0.94465166, 0.90094000, 0.85883033, 0.85392559, 0.84907448,
  0.84220779, 0.83234560, 0.82097769, 0.81201512, 0.80149031,
  0.78939950, 0.78104550, 0.77149206, 0.76232439, 0.75379407,
  0.74299091, 0.73460197, 0.72518224, 0.69578022, 0.67254823,
  0.66204476, 0.65223259, 0.64170313, 0.63222623, 0.62295210,
  0.61320466, 0.60255927, 0.59364629, 0.58369619, 0.57392311,
  0.56680834, 0.55712938, 0.55028439, 0.54388446, 0.53510243,
  0.51077694, 0.49297744, 0.48676151, 0.47878107, 0.47324133,
  0.46787617, 0.46274546, 0.45810473, 0.45301291, 0.44556752,
  0.44012254, 0.43389693, 0.42778793, 0.42225569, 0.41631523
];

let trail = [];
let frame = 0;
let smoothVal = dfFTrace[0];
let smoothing = 1;
let minVal, maxVal;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 255, 255, 255);
  frameRate(5);
  background(0);
  noFill();
  strokeWeight(2);

  // Automatically determine min and max for mapping
  minVal = min(dfFTrace);
  maxVal = max(dfFTrace);
}

function draw() {
  fill(0, 0, 0, 2); // fading overlay
  rect(0, 0, width, height);

  // Smooth transition
  if (frame < dfFTrace.length) {
    smoothVal = lerp(smoothVal, dfFTrace[frame], smoothing);
    if (abs(smoothVal - dfFTrace[frame]) < 0.00001) {
      frame++;
    }
  }

  translate(width / 2, height / 2);

  let radius = map(smoothVal, minVal, maxVal, 50, 250);
  let hue = map(smoothVal, minVal, maxVal, 200, 360);
  let sides = int(map(smoothVal, minVal, maxVal, 3, 12));

  // Add to trail
  trail.push({ r: radius, hue: hue, sides: sides });
  if (trail.length > 20) trail.shift();

  // Draw trail
  for (let i = 0; i < trail.length; i++) {
    let t = trail[i];
    let alpha = map(i, 0, trail.length - 1, 50, 255);
    stroke(t.hue, 255, 255, alpha);

    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / t.sides) {
      let r = t.r + sin(a * 3 + frame * 0.1) * 10;
      let x = r * cos(a);
      let y = r * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

 // drawWaveform(); // Provide 50ish space at the bottom if you want to draw the waveform
}

function drawWaveform() {
  push();
  translate(-width / 2, height / 2 - 100);
  stroke(180, 80, 255);
  noFill();
  beginShape();
  let scaleX = width / dfFTrace.length;
  for (let i = 0; i < dfFTrace.length; i++) {
    let y = map(dfFTrace[i], minVal, maxVal, 100, 0);
    vertex(i * scaleX, y);
  }
  endShape();

  if (frame < dfFTrace.length) {
    let x = map(frame, 0, dfFTrace.length, 0, width);
    stroke(0, 0, 255);
    line(x, 0, x, 100);
  }
  pop();
}
