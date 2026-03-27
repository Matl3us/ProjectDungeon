import { GRAVITY, JUMP_FORCE, MAX_FALL_SPEED, PLAYER_HEIGHT, PLAYER_SIZE, PLAYER_SPEED } from '../constants';
import { resolveAABB } from '../core/collision/collision';
import { getState, setPlayerLook, setPlayerPosition, setPlayerVelocity } from '../core/gameState';
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
        const { x, y, z, verticalV, yaw } = getState().player;

        const fwdX = Math.sin(yaw);
        const fwdY = -Math.cos(yaw);

        let dx = 0;
        let dy = 0;

        let newVerticalV = verticalV;
        let isOnGround = false;

        if (input.moveForward) { dx += fwdX; dy += fwdY; }
        if (input.moveBack) { dx -= fwdX; dy -= fwdY; }
        if (input.moveLeft) { dx += fwdY; dy -= fwdX; }
        if (input.moveRight) { dx -= fwdY; dy += fwdX; }

        if (!isOnGround) {
            newVerticalV -= GRAVITY * deltaSeconds;
            newVerticalV = Math.max(newVerticalV, -MAX_FALL_SPEED);
        }

        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
            dx = (dx / len) * PLAYER_SPEED * deltaSeconds;
            dy = (dy / len) * PLAYER_SPEED * deltaSeconds;
        }

        let newX = x + dx;
        let newY = y + dy;
        let newZ = z + newVerticalV * deltaSeconds;

        const playerAABB = {
            cx: newX, cy: newY, cz: newZ + PLAYER_HEIGHT / 2,
            halfW: PLAYER_SIZE / 2, halfD: PLAYER_SIZE / 2, halfH: PLAYER_HEIGHT / 2
        };
        for (const obj of [...this.world.collisionBoxes, this.world.collisionPlane]) {
            const result = resolveAABB(playerAABB, obj);
            if (!result) continue;

            switch (result.axis) {
                case 'x':
                    newX += -result.sign * result.depth;
                    break;
                case 'y':
                    newY += -result.sign * result.depth;
                    break;
                case 'z':
                    newZ += -result.sign * result.depth;
                    newVerticalV = 0;
                    if (result.sign < 0) isOnGround = true;
            }

            playerAABB.cx = newX;
            playerAABB.cy = newY;
            playerAABB.cz = newZ + PLAYER_HEIGHT / 2;
        }

        if (input.jump && isOnGround) {
            newVerticalV = JUMP_FORCE;
            isOnGround = false;
        }

        setPlayerPosition(newX, newY, newZ);
        setPlayerVelocity(PLAYER_SPEED, newVerticalV);
    }
}