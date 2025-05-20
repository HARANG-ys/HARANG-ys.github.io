import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 150);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const stats = new Stats();
document.body.appendChild(stats.dom);

const textureLoader = new THREE.TextureLoader();

const createPlanet = (name, radius, distance, color, textureFile, rotationSpeed, orbitSpeed) => {
    const texture = textureLoader.load(textureFile);
    const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8, metalness: 0.2 });
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    const pivot = new THREE.Object3D();
    pivot.add(mesh);
    mesh.position.x = distance;
    scene.add(pivot);

    return { name, mesh, pivot, rotationSpeed, orbitSpeed };
};

const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);


const planets = [
    createPlanet('Mercury', 1.5, 20, '#a6a6a6', 'Mercury.jpg', 0.02, 0.02),
    createPlanet('Venus', 3, 35, '#e39e1c', 'Venus.jpg', 0.015, 0.015),
    createPlanet('Earth', 3.5, 50, '#3498db', 'Earth.jpg', 0.01, 0.01),
    createPlanet('Mars', 2.5, 65, '#c0392b', 'Mars.jpg', 0.008, 0.008)
];

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 500);
scene.add(pointLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // 그림자 추가
directionalLight.position.set(50, 40, 0);
scene.add(directionalLight);

// GUI
const gui = new GUI();
const camFolder = gui.addFolder('Camera');
const camParams = {
  currentCamera: 'Perspective'
};
camFolder.add({ switchCameraType: () => {
    const aspect = window.innerWidth / window.innerHeight;
    if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(
            -aspect * 60, aspect * 60, 60, -60, 0.1, 1000
        );
        camera.position.set(0, 40, 150);
        camera.lookAt(scene.position);
        controls.object = camera;
        controls.update();
        camParams.currentCamera = 'Orthographic';
    } else {
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.set(0, 40, 150);
        camera.lookAt(scene.position);
        controls.object = camera;
        controls.update();
        camParams.currentCamera = 'Perspective';
    }
}}, 'switchCameraType');
camFolder.add(camParams, 'currentCamera').listen();

planets.forEach(planet => {
    const folder = gui.addFolder(planet.name);
    folder.add(planet, 'rotationSpeed', 0, 0.1, 0.001);
    folder.add(planet, 'orbitSpeed', 0, 0.1, 0.001);
});

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect;
    } else {
        camera.left = -aspect * 60;
        camera.right = aspect * 60;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    stats.update();

    planets.forEach(planet => {
        planet.mesh.rotation.y += planet.rotationSpeed;
        planet.pivot.rotation.y += planet.orbitSpeed;
    });

    renderer.render(scene, camera);
}
animate();
