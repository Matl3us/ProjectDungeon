import { CELL_SIZE } from '../constants';
import { getState } from '../core/gameState';

export class World {
    readonly widthCells: number;
    readonly heightCells: number;
    readonly cellSize: number;
    readonly widthPx: number;
    readonly heightPx: number;

    constructor() {
        const { width, height } = getState().world.boundaries;
        this.widthCells = width;
        this.heightCells = height;
        this.cellSize = CELL_SIZE;
        this.widthPx = width * CELL_SIZE;
        this.heightPx = height * CELL_SIZE;
    }

    clamp(x: number, y: number, entitySize: number): { x: number; y: number } {
        return {
            x: Math.max(entitySize / 2, Math.min(x, this.widthPx - entitySize / 2)),
            y: Math.max(entitySize / 2, Math.min(y, this.heightPx - entitySize / 2)),
        };
    }
}