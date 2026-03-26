import * as THREE from 'three';
import { CELL_SIZE, PLAYER_HEIGHT } from '../constants';
import { getState } from '../core/gameState';
import type { World } from '../game/world';

export class Renderer3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private readonly world: World

    constructor(world: World, container: HTMLElement) {
        this.world = world;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);

        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            5000,
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        this.buildScene();

        window.addEventListener('resize', () => this.onResize(container));
    }

    render(): void {
        const { x, y, z, yaw, pitch } = getState().player;

        const threeX = x - this.world.widthPx / 2;
        const threeZ = y - this.world.heightPx / 2;
        const threeY = z;

        this.camera.position.set(threeX, threeY + PLAYER_HEIGHT / 2, threeZ);

        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = -yaw;
        this.camera.rotation.x = pitch;

        this.renderer.render(this.scene, this.camera);
    }

    private buildScene(): void {
        const floorGeo = new THREE.PlaneGeometry(this.world.widthPx, this.world.heightPx);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x444444 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        const ceilGeo = new THREE.PlaneGeometry(this.world.widthPx, this.world.heightPx);
        const ceilMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
        const ceil = new THREE.Mesh(ceilGeo, ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.y = PLAYER_HEIGHT * 2;
        this.scene.add(ceil);

        this.buildWalls();

        const ambient = new THREE.AmbientLight(0xff0000, 0.4);
        this.scene.add(ambient);

        const point = new THREE.PointLight(0xffffff, 1.5, this.world.widthPx);
        point.position.set(0, PLAYER_HEIGHT, 0);
        this.scene.add(point);
    }

    private buildWalls(): void {
        const wallMat = new THREE.MeshLambertMaterial({ color: 0x886644 });
        const wallH = PLAYER_HEIGHT * 2;
        const W = this.world.widthPx;
        const H = this.world.heightPx;
        const T = CELL_SIZE;

        const walls: Array<{ w: number; h: number; d: number; x: number; y: number; z: number }> = [
            { w: W + T * 2, h: wallH, d: T, x: 0, y: wallH / 2, z: -(H / 2 + T / 2) },
            { w: W + T * 2, h: wallH, d: T, x: 0, y: wallH / 2, z: (H / 2 + T / 2) },
            { w: T, h: wallH, d: H, x: -(W / 2 + T / 2), y: wallH / 2, z: 0 },
            { w: T, h: wallH, d: H, x: (W / 2 + T / 2), y: wallH / 2, z: 0 },
        ];

        for (const { w, h, d, x, y, z } of walls) {
            const geo = new THREE.BoxGeometry(w, h, d);
            const mesh = new THREE.Mesh(geo, wallMat);
            mesh.position.set(x, y, z);
            this.scene.add(mesh);
        }
    }

    private onResize(container: HTMLElement): void {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}