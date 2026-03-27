import * as THREE from 'three';
import { PLAYER_HEIGHT } from '../constants';
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
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x898c87 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        this.buildCollisionBoxes();
        this.buildCollisionPlanes();

        const ambient = new THREE.AmbientLight(0xff0000, 0.4);
        this.scene.add(ambient);

        const point = new THREE.PointLight(0xffffff, 1.5, this.world.widthPx);
        point.position.set(0, PLAYER_HEIGHT, 0);
        this.scene.add(point);
    }

    private buildCollisionBoxes(): void {
        const boxMat = new THREE.MeshBasicMaterial({ color: 0x03fc07, wireframe: true })
        for (let box of this.world.collisionBoxes) {
            const boxGeo = new THREE.BoxGeometry(box.halfW * 2, box.halfH * 2, box.halfD * 2);
            const boxMesh = new THREE.Mesh(boxGeo, boxMat);

            const threeX = box.cx - this.world.widthPx / 2;
            const threeZ = box.cy - this.world.heightPx / 2;
            const threeY = box.cz;

            boxMesh.position.set(threeX, threeY, threeZ);
            this.scene.add(boxMesh);
        }
    }

    private buildCollisionPlanes(): void {
        const plane = this.world.collisionPlane;

        const planeMat = new THREE.MeshBasicMaterial({ color: 0x03fc07, wireframe: true })
        const planeGeo = new THREE.BoxGeometry(plane.halfW * 2, plane.halfH * 2, plane.halfD * 2);
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);

        const threeX = plane.cx - this.world.widthPx / 2;
        const threeZ = plane.cy - this.world.heightPx / 2;
        const threeY = plane.cz;

        planeMesh.position.set(threeX, threeY, threeZ);
        this.scene.add(planeMesh);
    }

    private onResize(container: HTMLElement): void {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}