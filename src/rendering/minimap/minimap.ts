import { getState } from '../../core/gameState';
import type { World } from '../../game/world';
import {
    CELL_BORDER_PX,
    LOOK_LINE_LEN,
    MINIMAP_HEIGHT,
    MINIMAP_WIDTH,
    PLAYER_DOT_R,
} from './constants';

export class Minimap {
    private ctx: CanvasRenderingContext2D;
    private readonly scaleX: number;
    private readonly scaleY: number;

    private readonly world: World;

    constructor(world: World, canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context from minimap canvas');
        this.ctx = ctx;

        this.world = world;
        this.scaleX = MINIMAP_WIDTH / this.world.widthPx;
        this.scaleY = MINIMAP_HEIGHT / this.world.heightPx;
    }

    render(): void {
        const { ctx } = this;
        ctx.clearRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);
        this.drawGrid();
        this.drawPlayer();
    }

    private wx(worldX: number): number {
        return (worldX + this.world.widthPx / 2) * this.scaleX;
    }

    private wy(worldY: number): number {
        return (worldY + this.world.heightPx / 2) * this.scaleY;
    }

    private drawGrid(): void {
        const { ctx, world } = this;

        ctx.strokeStyle = '#cc3333';
        ctx.lineWidth = CELL_BORDER_PX;

        ctx.strokeRect(0, 0, MINIMAP_WIDTH, MINIMAP_HEIGHT);

        ctx.beginPath();
        for (let col = 1; col < world.widthCells; col++) {
            const x = this.wx(-world.widthPx / 2 + col * world.cellSize);
            ctx.moveTo(x, 0);
            ctx.lineTo(x, MINIMAP_HEIGHT);
        }
        for (let row = 1; row < world.heightCells; row++) {
            const y = this.wy(-world.heightPx / 2 + row * world.cellSize);
            ctx.moveTo(0, y);
            ctx.lineTo(MINIMAP_WIDTH, y);
        }
        ctx.stroke();
    }

    private drawPlayer(): void {
        const { ctx } = this;
        const { x, y, yaw } = getState().player;

        const px = this.wx(x);
        const py = this.wy(y);

        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(px, py, PLAYER_DOT_R, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(
            px + Math.sin(yaw) * LOOK_LINE_LEN,
            py - Math.cos(yaw) * LOOK_LINE_LEN,
        );
        ctx.stroke();
    }
}