import { BORDER_WIDTH, CELL_PADDING, CELL_SIZE, PLAYER_SIZE, REAL_CELL_SIZE } from "../constants";
import { gameState } from "../data/shared_object";

const { width, height } = gameState.world.boundaries;

const canvas = document.getElementById("canvas2d") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

export function drawMap(playerX: number, playerY: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBorders(width, height);
    drawPlayer(playerX, playerY);
}

function drawBorders(width: number, height: number, x: number = 0, y: number = 0) {
    ctx.fillStyle = "red";

    const leftX = x * CELL_SIZE;
    const rightX = (x + width) * CELL_SIZE - BORDER_WIDTH;
    const topY = y * CELL_SIZE;
    const botY = (y + height) * CELL_SIZE - BORDER_WIDTH;

    for (let row = y; row < y + height; row++) {
        const rowY = CELL_PADDING + row * CELL_SIZE;
        for (const colX of [leftX, rightX]) {
            ctx.fillRect(colX, rowY, BORDER_WIDTH, REAL_CELL_SIZE);
        }
    }

    for (let col = x; col < x + width; col++) {
        const colX = CELL_PADDING + col * CELL_SIZE;
        for (const rowY of [topY, botY]) {
            ctx.fillRect(colX, rowY, REAL_CELL_SIZE, BORDER_WIDTH);
        }
    }
}

function drawPlayer(x: number, y: number) {
    ctx.fillStyle = 'green';

    ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
}