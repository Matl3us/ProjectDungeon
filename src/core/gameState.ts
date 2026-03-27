export interface WorldState {
    boundaries: { width: number; height: number };
}

export interface PlayerState {
    x: number;
    y: number;
    z: number;
    horizontalV: number;
    verticalV: number;
    yaw: number;
    pitch: number;
}

export interface GameState {
    world: WorldState;
    player: PlayerState;
}

const state: GameState = {
    world: {
        boundaries: { width: 25, height: 15 },
    },
    player: {
        x: 0,
        y: 0,
        z: 0,
        horizontalV: 0,
        verticalV: 0,
        yaw: 0,
        pitch: 0,
    },
};

export function getState(): Readonly<GameState> {
    return state;
}

export function setPlayerPosition(x: number, y: number, z: number): void {
    state.player.x = x;
    state.player.y = y;
    state.player.z = z;
}

export function setPlayerLook(yaw: number, pitch: number): void {
    state.player.yaw = yaw;
    state.player.pitch = pitch;
}

export function setPlayerVelocity(horizontalV: number, verticalV: number): void {
    state.player.horizontalV = horizontalV;
    state.player.verticalV = verticalV;
}