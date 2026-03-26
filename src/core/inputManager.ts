export interface InputSnapshot {
    moveForward: boolean;
    moveBack: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    jump: boolean;
    crouch: boolean;
    mouseDeltaX: number;
    mouseDeltaY: number;
    isPointerLocked: boolean;
}

export class InputManager {
    private keys = new Map<string, boolean>();
    private mouseDeltaX = 0;
    private mouseDeltaY = 0;

    private readonly lockTarget: HTMLElement

    constructor(lockTarget: HTMLElement) {
        this.lockTarget = lockTarget;

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('mousemove', this.onMouseMove);
        this.lockTarget.addEventListener('click', this.requestPointerLock);
        document.addEventListener('pointerlockchange', this.onPointerLockChange);
    }

    snapshot(): InputSnapshot {
        const snap: InputSnapshot = {
            moveForward: this.keys.get('w') ?? false,
            moveBack: this.keys.get('s') ?? false,
            moveLeft: this.keys.get('a') ?? false,
            moveRight: this.keys.get('d') ?? false,
            jump: this.keys.get(' ') ?? false,
            crouch: this.keys.get("control") ?? false,
            mouseDeltaX: this.mouseDeltaX,
            mouseDeltaY: this.mouseDeltaY,
            isPointerLocked: this.isLocked(),
        };
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        return snap;
    }

    destroy(): void {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('mousemove', this.onMouseMove);
        this.lockTarget.removeEventListener('click', this.requestPointerLock);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }

    private isLocked(): boolean {
        return document.pointerLockElement === this.lockTarget;
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        this.keys.set(e.key.toLowerCase(), true);
    };

    private onKeyUp = (e: KeyboardEvent): void => {
        this.keys.set(e.key.toLowerCase(), false);
    };

    private onMouseMove = (e: MouseEvent): void => {
        if (!this.isLocked()) return;
        this.mouseDeltaX += e.movementX;
        this.mouseDeltaY += e.movementY;
    };

    private requestPointerLock = (): void => {
        this.lockTarget.requestPointerLock();
    };

    private onPointerLockChange = (): void => {
        if (!this.isLocked()) {
            this.keys.clear();
        }
    };
}