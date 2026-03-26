import { CELL_SIZE, PLAYER_SIZE } from './constants';
import { drawMap } from './map/map';
import './game/game';
import './style.css'
import { gameState } from './data/shared_object';

const { width, height } = gameState.world.boundaries;

const pressedKeyMap = new Map<string, boolean>();
document.addEventListener("keydown", (event) => {
    const keyName = event.key;
    pressedKeyMap.set(keyName, true);
});

document.addEventListener("keyup", (event) => {
    const keyName = event.key;
    pressedKeyMap.set(keyName, false);
});

let start: number;
let velocity = 30;
let x = 0;
let y = 0;

function gameLoop(timestamp: number) {
    if (start === undefined) {
        start = timestamp;
    }
    const delta = timestamp - start;
    start = timestamp;

    let vector_x = 0;
    let vector_y = 0;
    if (pressedKeyMap.get('a')) {
        vector_x--;
    }
    if (pressedKeyMap.get('d')) {
        vector_x++;
    }
    if (pressedKeyMap.get('w')) {
        vector_y--;
    }
    if (pressedKeyMap.get('s')) {
        vector_y++;
    }

    let dt = delta / 100;
    let disp = vector_x && vector_y ? velocity * dt / Math.sqrt(2) : velocity * dt;
    x += disp * vector_x;
    y += disp * vector_y;

    x = Math.max(0, Math.min(x, (width * CELL_SIZE) - PLAYER_SIZE));
    y = Math.max(0, Math.min(y, (height * CELL_SIZE) - PLAYER_SIZE));

    gameState.player.x = x;
    gameState.player.y = y;

    drawMap(x, y);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);