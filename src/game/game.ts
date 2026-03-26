import * as THREE from 'three';
import { gameState } from '../data/shared_object';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { canvasToThreeJS } from '../utils/conversions';
import { PLAYER_SIZE } from '../constants';

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 920;

const { width, height } = gameState.world.boundaries;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
renderer.setAnimationLoop(animate);
let container = document.getElementsByClassName("container")[0] as HTMLDivElement;
container.appendChild(renderer.domElement);

const floor_geo = new THREE.PlaneGeometry(width * 20, height * 20);
const floor_mat = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
const floor = new THREE.Mesh(floor_geo, floor_mat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const cubePos = canvasToThreeJS(0, 0);
const cube_geo = new THREE.BoxGeometry(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE);
const cube_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cube_geo, cube_mat);
cube.position.set(cubePos.x + PLAYER_SIZE / 2, cubePos.y + PLAYER_SIZE / 2, cubePos.z + PLAYER_SIZE / 2);
scene.add(cube);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.y = 300;
controls.update();

function animate(time: number) {
  controls.update();
  renderer.render(scene, camera);

  const playerPos = canvasToThreeJS(gameState.player.x, gameState.player.y);
  console.log(playerPos);

  cube.position.set(playerPos.x + PLAYER_SIZE / 2, PLAYER_SIZE / 2, playerPos.z + PLAYER_SIZE / 2);
}