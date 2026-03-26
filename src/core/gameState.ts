export interface WorldState {
    boundaries: { width: number; height: number };
}

export interface PlayerState {
    x: number;
    y: number;
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
        x: 250,
        y: 150,
        yaw: 0,
        pitch: 0,
    },
};

export function getState(): Readonly<GameState> {
    return state;
}

export function setPlayerPosition(x: number, y: number): void {
    state.player.x = x;
    state.player.y = y;
}

export function setPlayerLook(yaw: number, pitch: number): void {
    state.player.yaw = yaw;
    state.player.pitch = pitch;
}