class ExpField {
    force;
    radius;
    k;
    pos;

    a;
    b;
    isOn;

    constructor(f, r, k) {
        this.force = f;
        this.radius = r;
        this.k = k;
        this.isOn = false;
        this.b = this.force - 1;
        this.a = log(this.force * (this.k - 1) + 1) / this.radius;
        this.pos = createVector(0, 0);
    }

    attract(object) {
        if (this.isOn) {
            let dist = this.pos.dist(object.getPosition());
            //if (dist<radius) {
            let direction = p5.Vector.sub(this.pos,object.getPosition());

            let l = exp(this.a * dist) + this.b;
            if (l > 0.1) {
                let forceVect = createVector(1, 1);
                forceVect.setMag(l);
                forceVect.rotate(direction.heading());
                object.addForce(forceVect);
            }
        }
    }
}



class RExpField {
    force;
    radius;
    k;
    pos;

    a;
    b;
    isOn;

    constructor(f, r, k) {
        this.force = f;
        this.radius = r;
        this.k = k;
        this.isOn = false;
        this.b = this.force - 1;
        this.a = log(this.force * (k - 1) + 1) / this.radius;
        this.pos = createVector(0, 0);
    }

    attract(object) {
        if (this.isOn) {
            let dist = this.pos.dist(object.getPosition());
            //if (dist<radius) {
            let direction = p5.Vector.sub(this.pos, object.getPosition());

            let l = exp(this.a * dist) + this.b;
            if (l > 0.1) {
                let forceVect = createVector(1, 1);
                forceVect.setMag(l);

                forceVect.rotate(direction.heading());
                object.addForce(forceVect);
            }
        }
    }
}

class pushField {
    force;
    radius;
    k;
    pos;

    a;
    b;
    isOn;

    constructor(f, r) {
        this.force = f;
        this.radius = r;
        this.isOn = false;
        this.pos = createVector(0, 0);
    }

    attract(object) {
        if (this.isOn) {
            let dist = this.pos.dist(object.getPosition());
            if (dist < this.radius) {
                let direction = p5.Vector.sub(this.pos, object.getPosition());
                    let forceVect = createVector(1, 1);
                    forceVect.setMag(this.force);

                    forceVect.rotate(direction.heading());
                    object.addForce(forceVect);
                
            }
        }
    }
}

class linearField {
    force;
    radius;
    k;
    pos;

    a;
    b;
    isOn;

    constructor(f, r, k) {
        this.force = f;
        this.radius = r;
        this.k = k;
        this.isOn = false;
        this.pos = createVector(0, 0);
    }

    attract(object) {
        if (this.isOn) {
            let dist = this.pos.dist(object.getPosition());
            if (dist < this.radius) {
                let direction = p5.Vector.sub(this.pos, object.getPosition());
                    let forceVect = createVector(1, 1);
                    forceVect.setMag(this.force-this.force*dist/this.r);

                    forceVect.rotate(direction.heading());
                    object.addForce(forceVect);
                
            }
        }
    }
}