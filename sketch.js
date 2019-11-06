const rotateAngle = Math.PI / 2;

const maxR = 208;
const secondHexR = 161;
const thirdHexR = 115;
const fourthHexR = 69;
const Hex5R = 80;
const Hex6R = 60;

const bkgCl = '#171920';

var mField;
var pSurface;

var movableHexController = {
    color: '#F6901FEF'
}

var grayHexController = {
    color: '#8386937F'
    , maxR: maxR
    , minR: secondHexR
    , positions: [0.7,0.8,0.5,0.9,0.4,0.5] //array of percent
}

var fieldController = { 
    f : 100
    , r: 100
    , k: 0.999
}

var points = [];


function setup() {
    createCanvas(windowWidth, windowHeight);
    //calculate points of orange hex
    let angle = TWO_PI / 6;
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = cos(a + rotateAngle) * secondHexR;
        let sy = sin(a + rotateAngle) * secondHexR;
        points.push([sx, sy]);
    }

    // init gray hex
    pSurface = new PSurface();
    initHex();
    console.log(pSurface.objects);
    //init mouse field
    initField();

}

function initField() {
    if (mField) {
        pSurface.fields.pop();
    }
    mField = new linearField(fieldController.f, fieldController.r, fieldController.k);
    mField.isOn = true;
    pSurface.fields.push(mField);
}

function initHex() {
    pSurface.objects = [];
    let angle = TWO_PI / 6;
    var iterator = grayHexController.positions.values(); 
    for (let a = 0; a < 6; a++) {
        let r = lerp(grayHexController.minR, grayHexController.maxR, iterator.next().value);
        let sx = cos(a*angle + rotateAngle) * r;
        let sy = sin(a*angle + rotateAngle) * r;
        let object = new MechanicObject(sx, sy);
        object.m = 1;
        pSurface.add(new DragForceNode(0.1,
            new SpringNode
                (createVector(sx, sy)
                    , 0.1
                    , object)));
    }
}

function draw() {
    background(bkgCl);
    drawingContext.setLineDash([]);
    translate(windowWidth / 2, windowHeight / 2);
    //draw gray hex
    noStroke();
    fill(grayHexController.color);

    beginShape(); 
    pSurface.objects.forEach(object => {
        let pos = object.getPosition();
        vertex(pos.x, pos.y);
    });
    endShape(CLOSE);
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

    
    fill(movableHexController.color);
    noStroke();
    //stroke(movableHexController.color);
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
    //update field
    mField.pos.x = x;
    mField.pos.y = y;
    

    noFill();
    stroke(255, 255, 255, 255);
    strokeWeight(3);
    strokeJoin(ROUND);
    //draw max hex
    polygon(0, 0, maxR, 6, rotateAngle);
    // draw inner hex
    stroke(255, 255, 255, 127);
    polygon(0, 0, secondHexR, 6, rotateAngle);
    // 
    drawingContext.setLineDash([10, 10]);
    stroke(255, 255, 255, 100);
    polygon(0, 0, thirdHexR, 6, rotateAngle);
    //
    drawingContext.setLineDash([3, 7]);
    stroke(255, 255, 255, 64);
    polygon(0, 0, fourthHexR, 6, rotateAngle);
    pSurface.update();





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