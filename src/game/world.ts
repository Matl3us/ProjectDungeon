import { CELL_SIZE } from '../constants';
import type { SolidBox, SolidPlane } from '../core/collision/collision';
import { getState } from '../core/gameState';

export class World {
    readonly widthCells: number;
    readonly heightCells: number;
    readonly cellSize: number;
    readonly widthPx: number;
    readonly heightPx: number;

    readonly collisionBoxes: Array<SolidBox>;
    readonly worldFloor: SolidPlane;

    constructor() {
        const { width, height } = getState().world.boundaries;
        this.widthCells = width;
        this.heightCells = height;
        this.cellSize = CELL_SIZE;
        this.widthPx = width * CELL_SIZE;
        this.heightPx = height * CELL_SIZE;

        this.collisionBoxes = [
            { cx: -25, cy: -65, cz: 35, halfW: 10, halfH: 10, halfD: 10 },
            { cx: -170, cy: -85, cz: 25, halfW: 10, halfH: 10, halfD: 10 },
            { cx: -150, cy: 15, cz: 10, halfW: 30, halfH: 10, halfD: 50 },
        ]

        this.worldFloor = {
            cx: 0,
            cy: 0,
            cz: -5,
            halfW: this.widthPx / 2,
            halfD: this.heightPx / 2,
            halfH: 5
        }
    }
}