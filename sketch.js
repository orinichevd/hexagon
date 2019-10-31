const rotateAngle = Math.PI / 2;

const maxR = 160;
const secondHexR = 110;
const thirdHexR = 80;
const fourthHexR = 60;
const Hex5R = 80;
const Hex6R = 60;

var points = [];


function setup() {
    createCanvas(windowWidth, windowHeight);
    //calculate points of orange
    let angle = TWO_PI / 6;
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = cos(a + rotateAngle) * secondHexR;
        let sy = sin(a + rotateAngle) * secondHexR;
        points.push([sx, sy]);
    }

}

function draw() {
    background(0, 0, 0);
    //draw orange hexagon
    let v1 = createVector(1, 0);
    let v2 = createVector(mouseX - windowWidth / 2, mouseY - windowHeight / 2);

    let angle = v1.angleBetween(v2) * (mouseY - windowHeight / 2) / Math.abs(mouseY - windowHeight / 2) + rotateAngle;
    let r = maxR * Math.cos(Math.PI / 6) /
        (
            Math.cos(
                Math.abs(
                    (angle * 3 / (Math.PI) - floor(angle * 3 / (Math.PI)))
                    * Math.PI * 1 / 3 - Math.PI / 6
                )
            )
        );
    //calculate point in the outer hex to draw lines
    var x = r * Math.cos(angle - rotateAngle);
    var y = r * Math.sin(angle - rotateAngle);

    translate(windowWidth / 2, windowHeight / 2);
    fill(220, 133, 38);
    stroke(220, 133, 38);
    strokeJoin(BEVEL);
    for (var i = 0; i < 6; i++) {
        beginShape();
        if (i == 5) {
            vertex(points[i][0], points[i][1]);
            vertex(points[0][0], points[0][1]);
            vertex(x, y);
        } else {
            vertex(points[i][0], points[i][1]);
            vertex(points[i + 1][0], points[i + 1][1]);
            vertex(x, y);
        }
        endShape(CLOSE);
    }
    noFill();
    stroke(255, 255, 255);
    strokeWeight(3);
    strokeJoin(ROUND);
    //draw max hex
    polygon(0, 0, maxR, 6, rotateAngle);
    // draw inner hex
    stroke(255, 255, 255, 100);
    polygon(0, 0, secondHexR, 6, rotateAngle);

    //inner polygons with rotation
    fill(0, 0, 0, 100);
    noStroke();
    let percent = map(angle, 0, Math.PI, 0.4, 1)
    polygon(0, 0, thirdHexR * percent, 6, angle * (-0.8));
    fill(220, 133, 38);
    polygon(0, 0, fourthHexR * percent, 6, angle * (-0.8));
    //inner polygons with rotation
    fill(0, 0, 0, 100);
    noStroke();
    percent = map(angle, 0, Math.PI, 1, 0.4)
    polygon(0, 0, Hex5R * percent, 6, angle * (0.7));
    fill(220, 133, 38);
    polygon(0, 0, Hex6R * percent, 6, angle * (0.7));




}

function polygon(x, y, radius, npoints, rotation) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a + rotation) * radius;
        let sy = y + sin(a + rotation) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}