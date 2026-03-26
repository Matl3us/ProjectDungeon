type UpdateFn = (deltaSeconds: number) => void;
type RenderFn = () => void;

export class GameLoop {
    private rafHandle = 0;
    private lastTimestamp: number | null = null;

    private readonly update: UpdateFn;
    private readonly render: RenderFn;

    constructor(
        update: UpdateFn,
        render: RenderFn,
    ) {
        this.update = update;
        this.render = render;
    }

    start(): void {
        this.rafHandle = requestAnimationFrame(this.tick);
    }

    stop(): void {
        cancelAnimationFrame(this.rafHandle);
        this.lastTimestamp = null;
    }

    private tick = (timestamp: number): void => {
        if (this.lastTimestamp === null) {
            this.lastTimestamp = timestamp;
        }

        const deltaSeconds = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
        this.lastTimestamp = timestamp;

        this.update(deltaSeconds);
        this.render();

        this.rafHandle = requestAnimationFrame(this.tick);
    };
}