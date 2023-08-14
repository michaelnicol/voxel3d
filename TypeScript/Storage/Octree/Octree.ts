import { Point3D } from "../../Point3D.js";
import { ValidObject } from "../../ValidObject.js";

export class Octree {
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
    c0: Octree | undefined
    /**
     * xHigh, yLow, zLow
     */
    c1: Octree | undefined
    /**
     * xLow, yHigh, zLow
     */
    c2: Octree | undefined
    /**
     * xHigh, yHigh, zLow
     */
    c3: Octree | undefined
    /**
     * xLow, yLow, zHigh
     */
    c4: Octree | undefined
    /**
     * xHigh, yLow, zHigh
     */
    c5: Octree | undefined
    /**
     * xLow, yHigh, zHigh
     */
    c6: Octree | undefined
    /**
     * xHigh, yHigh, zHigh
     */
    c7: Octree | undefined
    isLeafNode!: boolean
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
    constructor(xLow: number, yLow: number, zLow: number, xHigh: number, yHigh: number, zHigh: number) {
        console.log("\nCreating")
        console.log(xLow, yLow, zLow, xHigh, yHigh, zHigh)
        this.xLow = xLow
        this.yLow = yLow
        this.zLow = zLow
        this.xHigh = xHigh
        this.yHigh = yHigh
        this.zHigh = zHigh
        this.midX = Math.round((xHigh - xLow) / 2)
        this.midY = Math.round((yHigh - yLow) / 2)
        this.midZ = Math.round((zHigh - zLow) / 2)
        this.midX = this.midX === 1 ? 0 : this.midX
        this.midY = this.midY === 1 ? 0 : this.midY
        this.midZ = this.midZ === 1 ? 0 : this.midZ
        console.log("Mid")
        console.log(this.midX, this.midY, this.midZ)
        console.log("Lengths")
        console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow))
        this.isLeafNode = Math.abs(this.yHigh - this.yLow) === 1 && Math.abs(this.xHigh - this.xLow) === 1 && Math.abs(this.zHigh - this.zLow) === 1
        this.isLeafNode = yHigh === yLow && zHigh === zLow && xHigh === xLow
        console.log(this.isLeafNode)
    }

    getOctant(point: Point3D): number {
        const { arr } = point
        const x = arr[0]
        const y = arr[1]
        const z = arr[2]
        if (x <= this.midX && y <= this.midY && z <= this.midZ) {
            return 0
        } else if (x > this.midX && y <= this.midY && z <= this.midZ) {
            return 1
        } else if (x <= this.midX && y > this.midY && z <= this.midZ) {
            return 2
        } else if (x > this.midX && y > this.midY && z <= this.midZ) {
            return 3
        } else if (x <= this.midX && y <= this.midY && z > this.midZ) {
            return 4
        } else if (x > this.midX && y <= this.midY && z > this.midZ) {
            return 5
        } else if (x <= this.midX && y > this.midY && z > this.midZ) {
            return 6
        } else if (x > this.midX && y > this.midY && z > this.midZ) {
            return 7
        } else {
            return -1
        }
    }
    hasCoordinate(point: Point3D): boolean {
        switch (this.getOctant(point)) {
            case -1:
                return false;
            case 0:
                return this.c0 === undefined ? false : this.c0.isLeafNode ? true : this.c0.hasCoordinate(point)
            case 1:
                return this.c1 === undefined ? false : this.c1.isLeafNode ? true : this.c1.hasCoordinate(point)
            case 2:
                return this.c2 === undefined ? false : this.c2.isLeafNode ? true : this.c2.hasCoordinate(point)
            case 3:
                return this.c3 === undefined ? false : this.c3.isLeafNode ? true : this.c3.hasCoordinate(point)
            case 4:
                return this.c4 === undefined ? false : this.c4.isLeafNode ? true : this.c4.hasCoordinate(point)
            case 5:
                return this.c5 === undefined ? false : this.c5.isLeafNode ? true : this.c5.hasCoordinate(point)
            case 6:
                return this.c6 === undefined ? false : this.c6.isLeafNode ? true : this.c6.hasCoordinate(point)
            case 7:
                return this.c7 === undefined ? false : this.c7.isLeafNode ? true : this.c7.hasCoordinate(point)
            default:
                return false
        }
    }
    addCoordinate(point: Point3D): void {
        if (this.isLeafNode) {
            return;
        }
        // Find which octant this point falls in
        let Quadrant = this.getOctant(point)
        // console.log("This is a leaf node: " + this.isLeafNode)
        console.log(Quadrant)
        if (Quadrant === -1) {
            // console.log("No Quadrient")
            return;
        } else if (Quadrant === 0) {
            if (this.c0 === undefined) {
                this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ)
                this.nodeCount += 1
            }
            // console.log("Is C0 leaf node: " + this.c0.isLeafNode)
            if (!this.c0.isLeafNode) {
                this.c0.addCoordinate(point)
            }
            return;
        } else if (Quadrant === 1) {
            if (this.c1 === undefined) {
                this.c1 = new Octree(this.xLow + this.midX, this.yLow, this.zLow, this.xHigh, this.yLow + this.midY, this.zLow + this.midZ)
                this.nodeCount += 1
            }
            // console.log("Is C1 leaf node: " + this.c1.isLeafNode)
            if (!this.c1.isLeafNode) {
                // console.log("Calling add coordinate c1")
                this.c1.addCoordinate(point)
            }
            return;
        } else if (Quadrant === 2) {
            if (this.c2 === undefined) {
                this.c2 = new Octree(this.xLow, this.midY, this.zLow, this.xLow + this.midX, this.yHigh, this.zLow + this.midZ)
                this.nodeCount += 1
            }
            if (!this.c2.isLeafNode) {
                // console.log("Calling add coordinate c2")
                this.c2.addCoordinate(point)
            }

        } else if (Quadrant === 3) {
            if (this.c3 === undefined) {
                this.c3 = new Octree(this.midX, this.midY, this.zLow, this.xHigh, this.yHigh, this.zLow + this.midZ)
                this.nodeCount += 1
            }
            if (!this.c3.isLeafNode) {
                this.c3.addCoordinate(point)
            }
        } else if (Quadrant === 4) {
            if (this.c4 === undefined) {
                this.c4 = new Octree(this.xLow, this.yLow, this.midZ, this.xLow + this.midX, this.yLow + this.midY, this.zHigh)
                this.nodeCount += 1
            }
            if (!this.c4.isLeafNode) {
                this.c4.addCoordinate(point)
            }
        } else if (Quadrant === 5) {
            if (this.c5 === undefined) {
                this.c5 = new Octree(this.xLow + this.midX, this.yLow, this.midZ, this.xHigh, this.yLow + this.midY, this.zHigh)
                this.nodeCount += 1
            }
            if (!this.c5.isLeafNode) {
                this.c5.addCoordinate(point)
            }
        } else if (Quadrant === 6) {
            if (this.c6 === undefined) {
                this.c6 = new Octree(this.xLow, this.midY, this.midZ, this.xLow + this.midX, this.yHigh, this.zHigh)
                this.nodeCount += 1
            }
            if (!this.c6.isLeafNode) {
                this.c6.addCoordinate(point)
            }
        } else if (Quadrant === 7) {
            if (this.c7 === undefined) {
                this.c7 = new Octree(this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this.xHigh, this.yHigh, this.zHigh)
                this.nodeCount += 1
            }
            if (!this.c7.isLeafNode) {
                this.c7.addCoordinate(point)
            }
        }
    }
}