import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import { GUI } from '../node_modules/dat.gui/build/dat.gui.module.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';
import { CopyShader } from '../node_modules/three/examples/jsm/shaders/CopyShader.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';


var camera, scene, renderer;
var composer;
var renderScene;
var controls;
var cone;

var mouse = new THREE.Vector2()

var bloomController = {
    bloomStrength: 2
    , bloomRadius: 0
    , bloomThreshold: 0.1
}

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    createHexShape(400, { x: 0, y: 0, z: 0 }, Math.PI / 6, 0xffFFFF);
    createHexShape(300, { x: 0, y: 0, z: -150 }, Math.PI / 6, 0xffFFFF);
    createHexShape(200, { x: 0, y: 0, z: -300 }, Math.PI / 6, 0xffFFFF);
    createHexShape(100, { x: 0, y: 0, z: -450 }, Math.PI / 6, 0xffFFFF);
    createCone(100, -450, 400, Math.PI / 6);


    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.setClearColor(0x000000, 0.0);
    controls = new OrbitControls(camera, renderer.domElement);

    document.body.appendChild(renderer.domElement);

    renderScene = new RenderPass(scene, camera);

    var effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);

    var copyShader = new ShaderPass(CopyShader);
    copyShader.renderToScreen = true;

    var gui = new GUI();
    gui.add(bloomController, 'bloomStrength', 0.0, 10.0).onChange(function (value) {
        bloomPass.strength = Number(value);
    });
    gui.add(bloomController, 'bloomRadius', 0.0, 2.0).onChange(function (value) {
        bloomPass.radius = Number(value);
    });
    gui.add(bloomController, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
        bloomPass.threshold = Number(value);
    });

    var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomController.bloomStrength, bloomController.bloomRadius, bloomController.bloomThreshold);

    composer = new EffectComposer(renderer);

    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    composer.addPass(effectFXAA);
    composer.addPass(effectFXAA);

    composer.addPass(bloomPass);
    composer.addPass(copyShader);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = event.clientX-window.innerWidth/2;
    mouse.y = -event.clientY+window.innerHeight/2;
}

function createHexShape(radius, position, angle, color) {
    console.log(position);
    let hex = createHex(radius, angle);
    let hexShpae = new THREE.Shape(hex);
    let hexGeo = new THREE.EdgesGeometry(new THREE.ShapeGeometry(hexShpae));
    var hexMat = new THREE.LineBasicMaterial({ color: color, linewidth: 200 });

    let hexMesh = new THREE.LineSegments(hexGeo, hexMat);
    hexMesh.position.set(position.x, position.y, position.z);
    scene.add(hexMesh);
}

function createHex(radius, rotationAngle) {
    let hex = [];
    let angle = Math.PI * 2 / 6;
    for (let a = 0 + rotationAngle; a < Math.PI * 2 + rotationAngle; a += angle) {
        let sx = Math.cos(a) * radius;
        let sy = Math.sin(a) * radius;
        hex.push(new THREE.Vector2(sx, sy));
    }
    return hex;
}

function createCone(radiusSmall, z, radiusBig, rotationAngle) {
    var geometry = new THREE.Geometry();
    geometry.verticesNeedUpdate = true;
    let angle = Math.PI * 2 / 6;
    for (let a = 0 + rotationAngle; a < Math.PI * 2 + rotationAngle; a += angle) {
        let sx = Math.cos(a) * radiusSmall;
        let sy = Math.sin(a) * radiusSmall;
        geometry.vertices.push(new THREE.Vector3(sx, sy, z));
        let bx = Math.cos(Math.PI / 6 * 5) * radiusBig;
        let by = Math.sin(Math.PI / 6 * 5) * radiusBig;
        geometry.vertices.push(new THREE.Vector3(bx, by, 0));
    }
    let hexGeo = new THREE.EdgesGeometry(geometry);
    var hexMat = new THREE.LineBasicMaterial({ color: 0xdc8426, linewidth: 1 });

    let hexMesh = new THREE.LineSegments(hexGeo, hexMat);
    
    cone = new THREE.Line(geometry, hexMat);
    console.log(cone.geometry);
    scene.add(cone);

}

function updateCone() {
    let maxR = 400;
    let angle = mouse.angle()+Math.PI/6;
    let r = maxR * Math.cos(Math.PI / 6) /
        (
            Math.cos(
                Math.abs(
                    (angle * 3 / (Math.PI) - Math.floor(angle * 3 / (Math.PI)))
                    * Math.PI * 1 / 3 - Math.PI / 6
                )
            )
        );
    //calculate point in the outer hex to draw lines
    var x = r * Math.cos(mouse.angle());
    var y = r * Math.sin(mouse.angle());


    for (let i=1; i<=14; i+=2) {
        cone.geometry.vertices[i].x = x;
        cone.geometry.vertices[i].y = y;
    }

    cone.geometry.verticesNeedUpdate = true;
}

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

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    updateCone();

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    //renderer.render(scene, camera);
    composer.render();

}
