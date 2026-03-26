import './style.css';
import { GameLoop } from './core/gameLoop';
import { InputManager } from './core/inputManager';
import { Player } from './game/player';
import { World } from './game/world';
import { Renderer3D } from './rendering/renderer3d';
import { Minimap } from './rendering/minimap/minimap';

const container3d = document.getElementById('view3d') as HTMLDivElement;
const minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement;

const world = new World();
const input = new InputManager(container3d);
const player = new Player(world);
const renderer3d = new Renderer3D(world, container3d);
const minimap = new Minimap(world, minimapCanvas);

const loop = new GameLoop(
    (delta) => {
        const snapshot = input.snapshot();
        player.update(snapshot, delta);
    },
    () => {
        renderer3d.render();
        minimap.render();
    },
);

loop.start();