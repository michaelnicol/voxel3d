import { Comparable } from "../../Comparable.js";
import { Point3D } from "../../Point3D.js";
import { ValidObject } from "../../ValidObject.js";

export class OctreeLeaf<E extends Comparable<E>> {
    value!: E
    constructor(value: E) {
        this.value = value;
    }
}

export class Octree<E extends Comparable<E>> {
    unitLength!: number;
    xLow!: number;
    yLow!: number;
    zLow!: number;
    xHigh!: number;
    yHigh!: number;
    zHigh!: number;
    midX!: number;
    midY!: number;
    midZ!: number;
    /**
     * xLow, yLow, zLow
     */
    c0: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xHigh, yLow, zLow
     */
    c1: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xLow, yHigh, zLow
     */
    c2: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xHigh, yHigh, zLow
     */
    c3: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xLow, yLow, zHigh
     */
    c4: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xHigh, yLow, zHigh
     */
    c5: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xLow, yHigh, zHigh
     */
    c6: Octree<E> | OctreeLeaf<E> | undefined
    /**
     * xHigh, yHigh, zHigh
     */
    c7: Octree<E> | OctreeLeaf<E> | undefined
    nodeCount: number = 0
    /**
     * Creates an octree of a given volume.
     * 
     * Constraints: The difference between each low and high of each dimension must always be visible by two, unless the volume is 1 x 1 x 1.
     * 
     * This means the length of each dimension must be a multiple of two.
     * 
     * @param xLow 
     * @param yLow 
     * @param zLow 
     * @param xHigh 
     * @param yHigh 
     * @param zHigh 
     */
    constructor(xLow: number, yLow: number, zLow: number, xHigh: number, yHigh: number, zHigh: number, unitLength: number) {
        this.unitLength = unitLength
        // console.log("\nCreating")
        // console.log(xLow, yLow, zLow, xHigh, yHigh, zHigh)
        this.xLow = xLow
        this.yLow = yLow
        this.zLow = zLow
        this.xHigh = xHigh
        this.yHigh = yHigh
        this.zHigh = zHigh
        this.midX = ((xHigh - xLow) / 2)
        this.midY = ((yHigh - yLow) / 2)
        this.midZ = ((zHigh - zLow) / 2)
        // Snap to a unit length once it becomes less than the tesselation
        this.midX = this.midX < unitLength ? 0 : this.midX
        this.midY = this.midY < unitLength ? 0 : this.midY
        this.midZ = this.midZ < unitLength ? 0 : this.midZ
        // console.log("Mid")
        // console.log(this.midX, this.midY, this.midZ)
        // console.log("Lengths")
        // console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow))
    }
    getOctant(point: Point3D): number {
        const { arr } = point
        const x = arr[0]
        const y = arr[1]
        const z = arr[2]
        if (x <= this.midX + this.xLow && y <= this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 0
        } else if (x > this.midX + this.xLow && y <= this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 1
        } else if (x <= this.midX + this.xLow && y > this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 2
        } else if (x > this.midX + this.xLow && y > this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 3
        } else if (x <= this.midX + this.xLow && y <= this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 4
        } else if (x > this.midX + this.xLow && y <= this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 5
        } else if (x <= this.midX + this.xLow && y > this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 6
        } else if (x > this.midX + this.xLow && y > this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 7
        } else {
            return -1
        }
    }
    // hasCoordinate(point: Point3D): boolean {
    //     switch (this.getOctant(point)) {
    //         case -1:
    //             return false;
    //         case 0:
    //             return this.c0 === undefined ? false : this.c0.isLeafNode ? true : this.c0.hasCoordinate(point)
    //         case 1:
    //             return this.c1 === undefined ? false : this.c1.isLeafNode ? true : this.c1.hasCoordinate(point)
    //         case 2:
    //             return this.c2 === undefined ? false : this.c2.isLeafNode ? true : this.c2.hasCoordinate(point)
    //         case 3:
    //             return this.c3 === undefined ? false : this.c3.isLeafNode ? true : this.c3.hasCoordinate(point)
    //         case 4:
    //             return this.c4 === undefined ? false : this.c4.isLeafNode ? true : this.c4.hasCoordinate(point)
    //         case 5:
    //             return this.c5 === undefined ? false : this.c5.isLeafNode ? true : this.c5.hasCoordinate(point)
    //         case 6:
    //             return this.c6 === undefined ? false : this.c6.isLeafNode ? true : this.c6.hasCoordinate(point)
    //         case 7:
    //             return this.c7 === undefined ? false : this.c7.isLeafNode ? true : this.c7.hasCoordinate(point)
    //         default:
    //             return false
    //     }
    // }
    addCoordinate(point: Point3D, value: E): void {
        // Find which octant this point falls in
        let Quadrant = this.getOctant(point)
        // console.log("Point: " + point.toPrint())
        // console.log("Quadrant: " + Quadrant)
        // console.log("Is termination node")
        // console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow))
        if (Math.abs(this.yHigh - this.yLow) === this.unitLength && Math.abs(this.xHigh - this.xLow) === this.unitLength && Math.abs(this.zHigh - this.zLow) === this.unitLength) {
            if (Quadrant === -1) {
                // console.log("No Quadrient")
                return;
            } if (Quadrant === 0 && this.c0 === undefined) {
                this.c0 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 1 && this.c1 === undefined) {
                this.c1 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 2 && this.c2 === undefined) {
                this.c2 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 3 && this.c3 === undefined) {
                this.c3 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 4 && this.c4 === undefined) {
                this.c4 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 5 && this.c5 === undefined) {
                this.c5 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 6 && this.c6 === undefined) {
                this.c6 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            } else if (Quadrant === 7 && this.c7 === undefined) {
                this.c7 = new OctreeLeaf<E>(value)
                this.nodeCount += 1
            }
            return;
        }
        if (Quadrant === -1) {
            // console.log("No Quadrient")
            return;
        } else if (Quadrant === 0) {
            if (this.c0 === undefined) {
                this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this.unitLength)
            }
            (this.c0 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 1) {
            if (this.c1 === undefined) {
                this.c1 = new Octree(this.xLow + this.midX, this.yLow, this.zLow, this.xHigh, this.yLow + this.midY, this.zLow + this.midZ, this.unitLength)
            }
            (this.c1 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 2) {
            if (this.c2 === undefined) {
                this.c2 = new Octree(this.xLow, this.midY + this.yLow, this.zLow, this.xLow + this.midX, this.yHigh, this.zLow + this.midZ, this.unitLength)
            }
            (this.c2 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 3) {
            if (this.c3 === undefined) {
                this.c3 = new Octree(this.midX + this.xLow, this.midY + this.yLow, this.zLow, this.xHigh, this.yHigh, this.zLow + this.midZ, this.unitLength)
            }
            (this.c3 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 4) {
            if (this.c4 === undefined) {
                this.c4 = new Octree(this.xLow, this.yLow, this.midZ + this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zHigh, this.unitLength)
            }
            (this.c4 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 5) {
            if (this.c5 === undefined) {
                this.c5 = new Octree(this.xLow + this.midX, this.yLow, this.midZ + this.zLow, this.xHigh, this.yLow + this.midY, this.zHigh, this.unitLength)
            }
            (this.c5 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 6) {
            if (this.c6 === undefined) {
                this.c6 = new Octree(this.xLow, this.midY + this.yLow, this.midZ + this.zLow, this.xLow + this.midX, this.yHigh, this.zHigh, this.unitLength)
            }
            (this.c6 as Octree<E>).addCoordinate(point, value)
        } else if (Quadrant === 7) {
            if (this.c7 === undefined) {
                this.c7 = new Octree(this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this.xHigh, this.yHigh, this.zHigh, this.unitLength)
            }
            (this.c7 as Octree<E>).addCoordinate(point, value)
        }
        this.nodeCount += 1
    }
}