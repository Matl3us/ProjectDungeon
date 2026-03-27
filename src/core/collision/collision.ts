interface AABB {
    cx: number; cy: number; cz: number;
    halfW: number; halfH: number; halfD: number;
}

export interface SolidBox extends AABB {
}

export interface SolidPlane extends AABB {
}

function checkAABB(objectA: AABB, objectB: AABB): { x: number; y: number; z: number } {
    const penX = (objectA.halfW + objectB.halfW) - Math.abs(objectA.cx - objectB.cx);
    const penY = (objectA.halfD + objectB.halfD) - Math.abs(objectA.cy - objectB.cy);
    const penZ = (objectA.halfH + objectB.halfH) - Math.abs(objectA.cz - objectB.cz);

    if (penX <= 0 || penY <= 0 || penZ <= 0) return { x: 0, y: 0, z: 0 };

    return { x: penX, y: penY, z: penZ };
}

export function resolveAABB(objectA: AABB, objectB: AABB): { axis: 'x' | 'y' | 'z', depth: number, sign: number } | null {
    const pen = checkAABB(objectA, objectB);
    const min = Math.min(pen.x, pen.y, pen.z);

    if (min == 0) return null;

    switch (min) {
        case pen.x:
            return { axis: 'x', depth: min, sign: objectA.cx < objectB.cx ? 1 : -1 };
        case pen.y:
            return { axis: 'y', depth: min, sign: objectA.cy < objectB.cy ? 1 : -1 };
        default:
            return { axis: 'z', depth: min, sign: objectA.cz < objectB.cz ? 1 : -1 };
    }

}