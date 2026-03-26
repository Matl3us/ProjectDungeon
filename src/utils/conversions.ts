import { CELL_SIZE } from "../constants";
import { gameState } from "../data/shared_object";

const { width, height } = gameState.world.boundaries;
const MAP_WIDTH = width * CELL_SIZE;
const MAP_HEIGHT = height * CELL_SIZE;

export function canvasToThreeJS(canvasX: number, canvasY: number) {
    return {
        x: canvasX - MAP_WIDTH / 2,
        z: canvasY - MAP_HEIGHT / 2,
        y: 0
    };
}

export function threeJSToCanvas(threeX: number, threeZ: number) {
    return {
        x: threeX + MAP_WIDTH / 2,
        y: threeZ + MAP_HEIGHT / 2
    };
}