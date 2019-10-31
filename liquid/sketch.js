const maxR = 160;
const secondHexR = 110;
const thirdHexR = 80;
const fourthHexR = 60;
const Hex5R = 80;
const Hex6R = 60;
const rotateAngle = Math.PI / 2;

var xCount = 50;
var yCount = 50;
var begin;// = color(0xAA00F6FF);
var end;// = color(0xAAFF00E9);
var shape;
//down hex
var hex1Controller = {
    cl: 0xC8646464
    , r: 120
    , pointCount: 12
}

//upper hex
var hex2Controller = {
    cl: 0xC8C8C8C8
    , r: 110
    , pointCount: 12
}

var fieldController = { 
    f : 2
    , r: 100
    , k: 0.999
}

var objectController = {
    m : 25
    , gauss: 0.1
    , dragForce: 0.1
    , rebuild:initHex
}

var font;

var recording = false;

var mField;
var pSurface;

function setup() {
    createCanvas(windowWidth, windowHeight);
    begin = color('#00F6FF');
    end = color('#FF00E9');
    pSurface = new PSurface();
    initHex();
    console.log(pSurface.objects);
    //initGrid();
    /*mField = new ExpField(10.0, 100.0, 0.999);
    mField.isOn = true;
    pSurface.fields.push(mField);*/

    gui = new dat.GUI();    
    gui.add(fieldController, 'r').onChange(initField);
    gui.add(fieldController, 'f').onChange(initField);
    gui.add(fieldController, 'k').onChange(initField);
    gui.add(objectController, 'm');
    gui.add(objectController, 'dragForce');
    gui.add(objectController, 'gauss');
    gui.add(objectController, 'rebuild');
    initField();

}

function initField() {
    if (mField) {
        pSurface.fields.pop();
        console.log('field removed');
        console.log(pSurface.fields.length);
    }
    console.log('field updated');

    mField = new linearField(fieldController.f, fieldController.r, fieldController.k);
    mField.isOn = true;
    pSurface.fields.push(mField);
}

function draw() {
    background(0, 0, 0);
    noStroke();
    mField.pos.x = mouseX;
    mField.pos.y = mouseY;
    //mField.isOn = mouseIsPressed;

    pSurface.update();
    fill(100, 100, 100, 200);
    beginShape();
    for (let i = 7; i < 14; i++) {
        let object = pSurface.objects[i];
        let pos = object.getPosition();
        vertex(pos.x, pos.y);
    }
    {
        let object = pSurface.objects[7];
        let pos = object.getPosition();
        vertex(pos.x, pos.y);
    }
    endShape();
    fill(220, 133, 38);
    stroke(220, 133, 38);
    strokeJoin(BEVEL);
    beginShape();
    for (let i = 0; i < 7; i++) {
        let object = pSurface.objects[i];
        let pos = object.getPosition();
        vertex(pos.x, pos.y);
    }
    {
        let object = pSurface.objects[0];
        let pos = object.getPosition();
        vertex(pos.x, pos.y);
    }
    endShape();

    noFill();
    stroke(255, 255, 255);
    strokeWeight(3);
    strokeJoin(ROUND);
    //draw max hex
    polygon(0, 0, maxR, 6, rotateAngle);
    // draw inner hex
    stroke(255, 255, 255, 100);
    polygon(0, 0, secondHexR, 6, rotateAngle);




    /*for (var i = 0; i < xCount; i++) {
        //setStrokeCl(i * windowWidth / xCount);
        var scl = lerpColor(begin, end, i * windowWidth / xCount / windowWidth);
        fill(scl);
        for (var j = 0; j < yCount; j++) {
            var node = pSurface.objects[i * yCount + j];
            rect(node.getX(), node.getY(), 2, 2);
        }
    }*/
    stroke(0, 0, 0);
    noFill();
    circle(mField.pos.x, mField.pos.y, mField.radius)
}

function polygon(x, y, radius, npoints, rotation) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a + rotation) * radius;
        let sy = y + sin(a + rotation) * radius;
        vertex(sx+windowWidth/2, sy+windowHeight/2);
    }
    endShape(CLOSE);
}

function setStrokeCl(x) {
    var scl = lerpColor(begin, end, x / windowWidth);
    fill(color(scl));
}

function initGrid() {
    var xStep = windowWidth / xCount;
    var yStep = windowHeight / yCount;
    var xPosition = 0, yPosition = 0;

    for (let i = 0; i < xCount; i++) {
        for (let j = 0; j < yCount; j++) {
            let object = new MechanicObject(xPosition, yPosition);
            object.m = 50;
            pSurface.add(new DragForceNode(0.1,
                new SpringNode
                    (createVector(xPosition, yPosition)
                        , 0.1
                        , object)));
            yPosition = j * yStep;
        }
        xPosition = i * xStep;
    }
}

var hex1Objects = [];
var hex2Objects = [];

function initHex1() {
    let angleStep = Math.Pi*2/hex1Controller.pointCount;
    for (let angle = 0; angle<Math.PI*2; angleStep+=angleStep ) {
        let r = hex1Controller.r * Math.cos(Math.PI / 6) /
        (
            Math.cos(
                Math.abs(
                    (angle * 3 / (Math.PI) - floor(angle * 3 / (Math.PI)))
                    * Math.PI * 1 / 3 - Math.PI / 6
                )
            )
        );
    }

    
}

function initHex() {
    pSurface.objects = [];
    let angle = TWO_PI / 6;
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = cos(a+rotateAngle) * 120 + windowWidth / 2;
        let sy = sin(a+rotateAngle) * 120 + windowHeight / 2;
        let object = new MechanicObject(sx, sy);
        object.m = 25;
        pSurface.add(new DragForceNode(0.1,
            new SpringNode
                (createVector(sx, sy)
                    , 0.1
                    , object)));
    }

    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = cos(a+rotateAngle) * 120 + windowWidth / 2;
        let sy = sin(a+rotateAngle) * 120 + windowHeight / 2;
        let object = new MechanicObject(sx, sy);
        object.m = 40;
        pSurface.add(new DragForceNode(0.1,
            new SpringNode
                (createVector(sx, sy)
                    , 0.1
                    , object)));
    }
}

