import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();

const highwayTexture = new THREE.TextureLoader().load("img/road.png");
const highwayMaterial = new THREE.MeshBasicMaterial({ map: highwayTexture });

const background = new THREE.Color(0x291b03);
scene.background = (background);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.setX(0);
camera.position.setY(10);
camera.position.setZ(0);

camera.rotateY(toRadian(180));
camera.rotateX(toRadian(-75));

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#screen"),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

/*
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
*/

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//GRID CONTROLS
const rows = 25;
const cols = 20;
const grid = new NoiseGrid(rows, cols);

var gameSpeed = 0.1;
var distance = 0;

const highway = new HighwayMesh();
for (var i = 0; i < 8; i++) {
    highway.addSection();
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

animate();

function render() {
    updateScene();

    renderer.render(scene, camera);
}

function updateScene() {
    distance += gameSpeed * -1;

    clearPage();

    highway.update();

    for (var i = 0; i < highway.getSectionAmount(); i++) {
        const sectionGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            highway.getSection(i)[0].getPoint(0), highway.getSection(i)[0].getPoint(1), highway.getSection(i)[0].getPoint(2),
            highway.getSection(i)[1].getPoint(0), highway.getSection(i)[1].getPoint(1), highway.getSection(i)[1].getPoint(2),
            highway.getSection(i)[2].getPoint(0), highway.getSection(i)[2].getPoint(1), highway.getSection(i)[2].getPoint(2),

            highway.getSection(i)[2].getPoint(0), highway.getSection(i)[2].getPoint(1), highway.getSection(i)[2].getPoint(2),
            highway.getSection(i)[3].getPoint(0), highway.getSection(i)[3].getPoint(1), highway.getSection(i)[3].getPoint(2),
            highway.getSection(i)[0].getPoint(0), highway.getSection(i)[0].getPoint(1), highway.getSection(i)[0].getPoint(2),
        ]);

        const uvs = [
            1, 0,
            0, 0,
            0, 1,
            0, 1,
            1, 1,
            1, 0
        ];

        sectionGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        sectionGeometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );

        const mesh = new THREE.Mesh(sectionGeometry, highwayMaterial);

        mesh.rotateX(toRadian(180));
        mesh.name = "highway";
        mesh.position.setZ(distance);

        scene.add(mesh);
    }

    highway.checkDeletions(Math.abs(distance));

    grid.updatePoints();

    var spacing = 2;
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0xc60aff });
    for (var row = 0; row < rows - 1; row++) {
        let points = [];
        for (var col = 0; col < cols; col++) {
            let y = grid.getPoint(row, col);
            points.push(new THREE.Vector3(row * spacing - (rows / 2 * spacing), y, col * spacing - (cols / 2 * spacing)));
            let newY = grid.getPoint(row + 1, col);
            points.push(new THREE.Vector3((row + 1) * spacing - (rows / 2 * spacing), newY, col * spacing - (cols / 2 * spacing)));

        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, gridMaterial);
        scene.add(line);
    }
    for (var col = 0; col < cols; col++) {
        let points = [];
        for (var row = 0; row < rows - 1; row++) {
            let y = grid.getPoint(row, col);
            points.push(new THREE.Vector3(row * spacing - (rows / 2 * spacing), y, col * spacing - (cols / 2 * spacing)));
            let newY = grid.getPoint(row, col + 1);
            points.push(new THREE.Vector3(row * spacing - (rows / 2 * spacing), newY, (col + 1) * spacing - (cols / 2 * spacing)));

        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, gridMaterial);
        scene.add(line);
    }
    renderer.render(scene, camera);
}

function clearPage() {
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
}

function toRadian(deg) {
    return deg * Math.PI / 180;
}