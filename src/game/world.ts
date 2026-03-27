import { CELL_SIZE } from '../constants';
import type { SolidBox, SolidPlane } from '../core/collision/collision';
import { getState } from '../core/gameState';

export class World {
    readonly widthCells: number;
    readonly depthCells: number;
    readonly heightCells: number;
    readonly cellSize: number;
    readonly widthPx: number;
    readonly depthPx: number;
    readonly heightPx: number;

    readonly collisionBoxes: Array<SolidBox>;
    readonly worldFloor: SolidPlane;
    readonly worldWalls: Array<SolidPlane>;

    constructor() {
        const { width, depth, height } = getState().world.boundaries;
        this.widthCells = width;
        this.depthCells = depth;
        this.heightCells = height;
        this.cellSize = CELL_SIZE;
        this.widthPx = width * CELL_SIZE;
        this.depthPx = depth * CELL_SIZE;
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
            halfD: this.depthPx / 2,
            halfH: 5
        }

        this.worldWalls = [
            { cx: -this.widthPx / 2 - 5, cy: 0, cz: this.heightPx / 2, halfW: 5, halfD: this.depthPx / 2, halfH: this.heightPx / 2 },
            { cx: this.widthPx / 2 + 5, cy: 0, cz: this.heightPx / 2, halfW: 5, halfD: this.depthPx / 2, halfH: this.heightPx / 2 },
            { cx: 0, cy: this.depthPx / 2 + 5, cz: this.heightPx / 2, halfW: this.widthPx / 2, halfD: 5, halfH: this.heightPx / 2 },
            { cx: 0, cy: -this.depthPx / 2 - 5, cz: this.heightPx / 2, halfW: this.widthPx / 2, halfD: 5, halfH: this.heightPx / 2 },
        ]
    }
}