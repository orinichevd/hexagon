class MechanicObject {
    #position;
    velocity;
    acceleration;
    forces;
    m;

    constructor(x, y) {
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.position = createVector(x, y);
        this.forces = [];
        this.m = 10;
    }
    // returns X coordinate
    getX() {
        return this.position.x;
    }

    //returns Y coordinate
    getY() {
        return this.position.y;
    }
    //return position
    getPosition() {
        return this.position;
    }
    //return velocity
    getVelocity() {
        return this.velocity;
    }
    //return aceleration
    getAcceleration() {
        return this.acceleration;
    }
    //return mass of object
    getMass() {
        return this.m;
    }
    //add force to object
    addForce(force) {
        this.forces.push(force);
    }

    update() {
        var resultant = createVector(0, 0);
        for (var i = 0; i < this.forces.length; i++) {
            resultant.add(this.forces[i]);
        }
        this.acceleration = resultant.div(this.m);
        this.velocity.add(this.acceleration); 
        this.position.add(this.velocity);
        this.forces = [];
    }
}

class DragForceNode {
    c;
    source;

    constructor(c, source) {
        this.c = c;
        this.source = source;
    }
    // returns X coordinate
    getX() {
        return this.source.getX();
    }
    //returns Y coordinate
    getY() {
        return this.source.getY();
    }
    //return position
    getPosition() {
        return this.source.getPosition();
    }
    //return velocity
    getVelocity() {
        return this.source.getVelocity();
    }

    //return aceleration
    getAcceleration() {
        return this.source.getAcceleration();
    }
    //return mass of object
    getMass() {
        return this.source.getMass();
    }
    //add force to object
    addForce(force) {
        this.source.addForce(force);
    }
    //update state of object
    update() {
        let velocity = this.source.getVelocity();
        let DragForce = createVector
            (-velocity.x * abs(velocity.x) * this.c
                , -velocity.y * abs(velocity.y) * this.c);
        this.source.addForce(DragForce);
        this.source.update();
    }
}

class SpringNode {
    k;
    initPos;

    source;

    constructor(initialPosition, k, object) {
        this.source = object;
        this.k = k;
        this.initPos = initialPosition;
    }

    // returns X coordinate
    getX() {
        return this.source.getX();
    }
    //returns Y coordinate
    getY() {
        return this.source.getY();
    }
    //return position
    getPosition() {
        return this.source.getPosition();
    }
    //return velocity
    getVelocity() {
        return this.source.getVelocity();
    }
    //return aceleration
    getAcceleration() {
        return this.source.getAcceleration();
    }
    //return mass of object
    getMass() {
        return this.source.getMass();
    }
    //add force to object
    addForce(force) {
        this.source.addForce(force);
    }
    //update state of object
    update() {

        let hookesForce = this.source.getPosition().copy().sub(this.initPos).mult(-this.k);

        this.source.addForce(hookesForce);
        this.source.update();
    }
}