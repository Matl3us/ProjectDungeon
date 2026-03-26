import { PLAYER_SIZE, PLAYER_SPEED } from '../constants';
import { getState, setPlayerLook, setPlayerPosition } from '../core/gameState';
import type { InputSnapshot } from '../core/inputManager';
import type { World } from './world';

const MOUSE_SENSITIVITY = 0.002;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

export class Player {
    private readonly world: World;

    constructor(world: World) {
        this.world = world;
    }

    update(input: InputSnapshot, deltaSeconds: number): void {
        this.updateLook(input);
        this.updatePosition(input, deltaSeconds);
    }

    private updateLook(input: InputSnapshot): void {
        if (!input.isPointerLocked) return;

        const { yaw, pitch } = getState().player;

        const newYaw = yaw + input.mouseDeltaX * MOUSE_SENSITIVITY;
        const newPitch = Math.max(
            -PITCH_LIMIT,
            Math.min(PITCH_LIMIT, pitch - input.mouseDeltaY * MOUSE_SENSITIVITY),
        );

        setPlayerLook(newYaw, newPitch);
    }

    private updatePosition(input: InputSnapshot, deltaSeconds: number): void {
        const { x, y, yaw } = getState().player;

        const fwdX = Math.sin(yaw);
        const fwdY = -Math.cos(yaw);

        let dx = 0;
        let dy = 0;

        if (input.moveForward) { dx += fwdX; dy += fwdY; }
        if (input.moveBack) { dx -= fwdX; dy -= fwdY; }
        if (input.moveLeft) { dx += fwdY; dy -= fwdX; }
        if (input.moveRight) { dx -= fwdY; dy += fwdX; }

        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            dx = (dx / len) * PLAYER_SPEED * deltaSeconds;
            dy = (dy / len) * PLAYER_SPEED * deltaSeconds;
        }

        const clamped = this.world.clamp(x + dx, y + dy, PLAYER_SIZE);
        setPlayerPosition(clamped.x, clamped.y);
    }
}