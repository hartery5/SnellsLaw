let _ni = 1.0;
let _nf = 1.5;
let f;
let q;

let slider1;
let slider2;
let checkbox;

let cval;

let playerX = 100;
let playerY = 100;

function setup() {
  textSize(30);
  textStyle(BOLD);
  strokeWeight(2);
  createCanvas(windowWidth, windowHeight);
  slider1 = createSlider(1, 3, 1.0, 0.01);
  slider1.position(width - 100, 15);
  slider1.style("width", "80px");
  slider2 = createSlider(1, 3, 1.5, 0.01);
  slider2.position(width - 100, 55);
  slider2.style("width", "80px");
  checkbox = createCheckbox("", false);
  checkbox.position(width - 100, 95);
  textAlign(CENTER);
}

function draw() {
  _ni = float(slider1.value());
  _nf = float(slider2.value());

  if (checkbox.checked()) {
    cval = true;
  } else {
    cval = false;
  }

  // Adjust player position so that angle is rounded to nearest 1's place
  let _r = dist(playerX, playerY, width / 2, height / 2);
  let _t = atan2(playerY - height / 2, playerX - width / 2);
  let _tr = (round((_t * 180) / PI) * PI) / 180;
  playerX = _r * cos(_tr) + width / 2;
  playerY = _r * sin(_tr) + height / 2;

  // Fill the slabs.
  push();
  noStroke();
  fill("cornflowerblue");
  let from = color(225, 225, 225);
  let to = color("cornflowerblue");
  let v = map(_nf, 1, 3, 0, 1);
  let c = lerpColor(from, to, v);
  fill(c);
  rect(0, height / 2, width, height / 2);
  v = map(_ni, 1, 3, 0, 1);
  c = lerpColor(from, to, v);
  fill(c);
  rect(0, 0, width, height / 2);
  pop();

  // Other display items
  push();
  textAlign(LEFT);
  noStroke();
  fill(0);
  text("n₁ = " + nf(_ni, 1, 2), width - 250, 35);
  text("n₂ = " + nf(_nf, 1, 2), width - 250, 75);
  text("Medium 1", width - 150, height / 2 - 10);
  text("Medium 2", width - 150, height / 2 + 30);
  text("Show R?", width - 250, 115);
  rotate(PI / 2);
  text("Normal", 10, -width / 2 - 5);
  rotate(-PI / 2);
  stroke(1);
  setLineDash([10, 10]);
  line(width / 2, 0, width / 2, height);
  pop();

  // Some quadrant handling.
  if (playerX < width / 2 && playerY < height / 2) {
    n1 = _ni;
    n2 = _nf;
    fx = 1.0;
    fy = 1.0;
    rx = 1.0;
    q = 1;
  } else if (playerX >= width / 2 && playerY < height / 2) {
    n1 = _ni;
    n2 = _nf;
    fx = -1.0;
    fy = 1.0;
    rx = -1.0;
    q = 2;
  } else if (playerX < width / 2 && playerY > height / 2) {
    n1 = _nf;
    n2 = _ni;
    fx = 1.0;
    fy = -1.0;
    rx = 1.0;
    q = 3;
  } else if (playerX > width / 2 && playerY > height / 2) {
    n1 = _nf;
    n2 = _ni;
    fx = -1.0;
    fy = -1.0;
    rx = -1.0;
    q = 4;
  }

  // Display the player
  push();
  strokeWeight(2);
  fill(0);
  text("I", playerX - rx * 20, playerY);
  stroke(0);
  line(playerX, playerY, width / 2, height / 2);
  circle(playerX, playerY, 5);

  // Polar Coordinates
  let ti = abs(atan2(width / 2 - playerX, height / 2 - playerY));
  let r = dist(playerX, playerY, width / 2, height / 2);
  let rf = 300.;

  // Snell's Law
  let tf = asin((n1 * sin(ti)) / n2);
  let ex = fx * rf * sin(tf) + width / 2;
  let ey = fy * rf * cos(tf) + height / 2;
  line(width / 2, height / 2, ex, ey);
  text("T", ex + fx * 20, ey);

  // Law of Reflection
  let px = rx * rf * sin(ti) + width / 2;
  let py = -rf * cos(ti) + height / 2;
  if (cval) {
    line(width / 2, height / 2, px, py);
    text("R", px + rx * 20, py);
  }

  // Very horrendous implementation. Can't bear to look at it.
  noFill();
  let tt, tx, ty;
  switch (q) {
    case 1:
      arc(width / 2, height / 2, r / 2, r / 2, (3 * PI) / 2 - ti, (3 * PI) / 2);
      tt = (3 * PI) / 2 - ti / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((ti * 180) / PI)) + "°", tx, ty);
      noFill();
      arc(width / 2, height / 2, r / 2, r / 2, PI / 2 - tf, PI / 2);
      tt = PI / 2 - tf / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((tf * 180) / PI)) + "°", tx, ty);
      noFill();
      if (cval) {
        arc(
          width / 2,
          height / 2,
          r / 2,
          r / 2,
          (3 * PI) / 2,
          (3 * PI) / 2 + ti
        );
        tt = (3 * PI) / 2 + ti / 2;
        tx = (r / 3) * cos(tt) + width / 2;
        ty = (r / 3) * sin(tt) + height / 2;
        fill(0);
        text(nf(round((ti * 180) / PI)) + "°", tx, ty);
        noFill();
      }
      break;
    case 2:
      arc(width / 2, height / 2, r / 2, r / 2, (3 * PI) / 2, (3 * PI) / 2 + ti);
      tt = (3 * PI) / 2 + ti / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((ti * 180) / PI) % 90) + "°", tx, ty);
      noFill();
      arc(width / 2, height / 2, r / 2, r / 2, PI / 2, PI / 2 + tf);
      tt = PI / 2 + tf / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((tf * 180) / PI)) + "°", tx, ty);
      noFill();
      if (cval) {
        arc(
          width / 2,
          height / 2,
          r / 2,
          r / 2,
          (3 * PI) / 2 - ti,
          (3 * PI) / 2
        );
        tt = (3 * PI) / 2 - ti / 2;
        tx = (r / 3) * cos(tt) + width / 2;
        ty = (r / 3) * sin(tt) + height / 2;
        fill(0);
        text(nf(round((ti * 180) / PI)) + "°", tx, ty);
        noFill();
      }
      break;
    case 3:
      arc(width / 2, height / 2, r / 2, r / 2, PI / 2, (3 * PI) / 2 - ti);
      tt = (3 * PI) / 2 - ti - (PI - ti) / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round(((PI - ti) * 180) / PI)) + "°", tx, ty);
      noFill();
      arc(width / 2, height / 2, r / 2, r / 2, (3 * PI) / 2, (3 * PI) / 2 + tf);
      tt = (3 * PI) / 2 + tf / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((tf * 180) / PI)) + "°", tx, ty);
      noFill();
      if (cval) {
        arc(width / 2, height / 2, r / 2, r / 2, (3 * PI) / 2 + ti, PI / 2);
        tt = (3 * PI) / 2 + ti + (PI - ti) / 2;
        tx = (r / 3) * cos(tt) + width / 2;
        ty = (r / 3) * sin(tt) + height / 2;
        fill(0);
        text(nf(round(((PI - ti) * 180) / PI)) + "°", tx, ty);
        noFill();
      }
      break;
    case 4:
      arc(width / 2, height / 2, r / 2, r / 2, PI / 2 + ti - PI, PI / 2);
      tt = PI / 2 + 0.5 * (ti - PI);
      tx = (r / 2.5) * cos(tt) + width / 2;
      ty = (r / 2.5) * sin(tt) + height / 2;
      fill(0);
      text(nf(round(((PI - ti) * 180) / PI)) + "°", tx, ty);
      noFill();
      arc(width / 2, height / 2, r / 2, r / 2, (3 * PI) / 2 - tf, (3 * PI) / 2);
      tt = (3 * PI) / 2 - tf / 2;
      tx = (r / 3) * cos(tt) + width / 2;
      ty = (r / 3) * sin(tt) + height / 2;
      fill(0);
      text(nf(round((tf * 180) / PI)) + "°", tx, ty);
      noFill();
      if (cval) {
        arc(width / 2, height / 2, r / 2, r / 2, PI / 2, PI / 2 - ti - PI);
        tt = PI / 2 - 0.5 * (ti - PI);
        tx = (r / 3) * cos(tt) + width / 2;
        ty = (r / 3) * sin(tt) + height / 2;
        fill(0);
        text(nf(round(((PI - ti) * 180) / PI)) + "°", tx, ty);
        noFill();
      }
      break;
  }
}

function mouseDragged() {
  if (abs(mouseX - playerX) < 50 && abs(mouseY - playerY) < 50) {
    playerX = mouseX;
    playerY = mouseY;
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}
