import { Comparable } from "../../Interfaces/Comparable.js";
import { Point3D } from "../../Points/Point3D.js";
import { ValidObject } from "../../Meshes/ValidObject.js";
import { Triangle3D } from "../../Meshes/Triangle3D.js";

export class OctreeLeaf<E extends Comparable<E>> {
    value!: E
    isLeafNode: boolean = true
    xCenter!: number
    yCenter!: number
    zCenter!: number
    constructor(xCenter: number, yCenter: number, zCenter: number, value: E) {
        this.xCenter = xCenter;
        this.yCenter = yCenter;
        this.zCenter = zCenter;
        this.value = value;
    }
}

export class Octree<E extends Comparable<E>> {
    unitLength!: number;
    isLeafNode: boolean = false
    value: E | undefined
    xLow!: number;
    yLow!: number;
    zLow!: number;
    xCenter!: number
    yCenter!: number
    zCenter!: number
    xHigh!: number;
    yHigh!: number;
    zHigh!: number;
    splitX!: number;
    splitY!: number;
    splitZ!: number;
    parent: Octree<E> | undefined;
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
    quadCount: number = 0
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
    constructor(xLow: number, yLow: number, zLow: number, xHigh: number, yHigh: number, zHigh: number, unitLength: number, parent: Octree<E> | undefined) {
        this.unitLength = unitLength
        if (xLow > xHigh || yLow > yHigh || zLow > zHigh) {
            throw new Error("")
        }
        this.xLow = xLow
        this.yLow = yLow
        this.zLow = zLow
        this.xHigh = xHigh
        this.yHigh = yHigh
        this.zHigh = zHigh
        this.xCenter = (xHigh - xLow) / 2
        this.yCenter = (yHigh - yLow) / 2
        this.zCenter = (zHigh - zLow) / 2
        this.splitX = Math.ceil((xHigh - xLow) / 2)
        this.splitY = Math.ceil((yHigh - yLow) / 2)
        this.splitZ = Math.ceil((zHigh - zLow) / 2)
        // Snap to a unit length once it becomes less than the tesselation
        this.splitX = this.splitX < unitLength ? 0 : this.splitX
        this.splitY = this.splitY < unitLength ? 0 : this.splitY
        this.splitZ = this.splitZ < unitLength ? 0 : this.splitZ
        this.parent = parent
    }
    getOctant(x: number, y: number, z: number): number {
        if (x <= this.xLow + this.splitX - this.unitLength &&
            y <= this.yLow + this.splitY - this.unitLength &&
            z <= this.zLow + this.splitZ - this.unitLength) {
            return 0
        } else if (x > this.xLow + this.splitX - this.unitLength &&
            y <= this.splitY + this.yLow - this.unitLength &&
            z <= this.splitZ + this.zLow - this.unitLength) {
            return 1
        } else if (x <= this.xLow + this.splitX - this.unitLength &&
            y > this.splitY + this.yLow - this.unitLength &&
            z <= this.splitZ + this.zLow - this.unitLength) {
            return 2
        } else if (x > this.splitX + this.xLow - this.unitLength &&
            y > this.splitY + this.yLow - this.unitLength &&
            z <= this.splitZ + this.zLow - this.unitLength) {
            return 3
        } else if (x <= this.xLow + this.splitX - this.unitLength &&
            y <= this.yLow + this.splitY - this.unitLength &&
            z > this.zLow + this.splitZ - this.unitLength) {
            return 4
        } else if (x > this.xLow + this.splitX - this.unitLength &&
            y <= this.splitY + this.yLow - this.unitLength &&
            z > this.splitZ + this.zLow - this.unitLength) {
            return 5
        } else if (x <= this.xLow + this.splitX - this.unitLength &&
            y > this.splitY + this.yLow - this.unitLength &&
            z > this.splitZ + this.zLow - this.unitLength) {
            return 6
        } else if (x > this.splitX + this.xLow - this.unitLength &&
            y > this.splitY + this.yLow - this.unitLength &&
            z > this.splitZ + this.zLow - this.unitLength) {
            return 7
        } else {
            return -1
        }
    }
    hasCoordinate(x: number, y: number, z: number): boolean {
        switch (this.getOctant(x, y, z)) {
            case -1:
                return false;
            case 0:
                return this.c0 === undefined ? false : this.c0.isLeafNode ? true : (this.c0 as Octree<E>).hasCoordinate(x, y, z)
            case 1:
                return this.c1 === undefined ? false : this.c1.isLeafNode ? true : (this.c1 as Octree<E>).hasCoordinate(x, y, z)
            case 2:
                return this.c2 === undefined ? false : this.c2.isLeafNode ? true : (this.c2 as Octree<E>).hasCoordinate(x, y, z)
            case 3:
                return this.c3 === undefined ? false : this.c3.isLeafNode ? true : (this.c3 as Octree<E>).hasCoordinate(x, y, z)
            case 4:
                return this.c4 === undefined ? false : this.c4.isLeafNode ? true : (this.c4 as Octree<E>).hasCoordinate(x, y, z)
            case 5:
                return this.c5 === undefined ? false : this.c5.isLeafNode ? true : (this.c5 as Octree<E>).hasCoordinate(x, y, z)
            case 6:
                return this.c6 === undefined ? false : this.c6.isLeafNode ? true : (this.c6 as Octree<E>).hasCoordinate(x, y, z)
            case 7:
                return this.c7 === undefined ? false : this.c7.isLeafNode ? true : (this.c7 as Octree<E>).hasCoordinate(x, y, z)
            default:
                return false
        }
    }
    compressNode(): void {
        if (this.quadCount !== 8) {
            // console.log("Not enough quads")
            return;
        }
        let sectors = [this.c0, this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7]
        let canBeCompressed: boolean = true
        for (let sector of sectors) {
            if ((sector as Octree<E> | OctreeLeaf<E>).value === undefined || !(sector as Octree<E> | OctreeLeaf<E>).isLeafNode) {
                canBeCompressed = false
                break;
            }
        }
        // console.log(canBeCompressed)
        if (canBeCompressed) {
            let compressedValue: E = (this.c0 as Octree<E> | OctreeLeaf<E>).value as E
            for (let sector of sectors) {
                if (((sector as Octree<E> | OctreeLeaf<E>).value as E).compareTo(compressedValue as E) !== 0) {
                    canBeCompressed = false
                    break;
                }
            }
        }
        if (canBeCompressed) {
            this.value = (this.c0 as Octree<E> | OctreeLeaf<E>).value as E
            this.isLeafNode = true
            this.c0 = undefined
            this.c1 = undefined
            this.c2 = undefined
            this.c3 = undefined
            this.c4 = undefined
            this.c5 = undefined
            this.c6 = undefined
            this.c7 = undefined
            this.quadCount = 0
        }
        this.parent?.compressNode()
    }
    decompressNode() {
        this.c0 = new Octree(
            this.xLow,
            this.yLow,
            this.zLow,
            this.xLow + this.splitX - this.unitLength,
            this.yLow + this.splitY - this.unitLength,
            this.zLow + this.splitZ - this.unitLength,
            this.unitLength,
            this)
        this.c0.value = this.value
        this.c1 = new Octree(
            this.xLow + this.splitX,
            this.yLow,
            this.zLow,
            this.xHigh,
            this.yLow + this.splitY - this.unitLength,
            this.zLow + this.splitZ - this.unitLength,
            this.unitLength,
            this)
        this.c1.value = this.value
        this.c2 = new Octree(
            this.xLow,
            this.splitY + this.yLow,
            this.zLow,
            this.xLow + this.splitX - this.unitLength,
            this.yHigh,
            this.zLow + this.splitZ - this.unitLength,
            this.unitLength,
            this)
        this.c2.value = this.value
        this.c3 = new Octree(
            this.splitX + this.xLow,
            this.splitY + this.yLow,
            this.zLow,
            this.xHigh,
            this.yHigh,
            this.zLow + this.splitZ - this.unitLength,
            this.unitLength,
            this)
        this.c3.value = this.value
        this.c4 = new Octree(
            this.xLow,
            this.yLow,
            this.zLow + this.splitZ,
            this.xLow + this.splitX - this.unitLength,
            this.yLow + this.splitY - this.unitLength,
            this.zHigh,
            this.unitLength,
            this)
        this.c4.value = this.value
        this.c5 = new Octree(
            this.xLow + this.splitX,
            this.yLow,
            this.zLow + this.splitZ,
            this.xHigh,
            this.yLow + this.splitY - this.unitLength,
            this.zHigh,
            this.unitLength,
            this)
        this.c5.value = this.value
        this.c6 = new Octree(
            this.xLow,
            this.splitY + this.yLow,
            this.zLow + this.splitZ,
            this.xLow + this.splitX - this.unitLength,
            this.yHigh,
            this.zHigh,
            this.unitLength,
            this)
        this.c6.value = this.value
        this.c7 = new Octree(
            this.splitX + this.xLow,
            this.splitY + this.yLow,
            this.zLow + this.splitZ,
            this.xHigh,
            this.yHigh,
            this.zHigh,
            this.unitLength,
            this)
        this.c7.value = this.value
        this.isLeafNode = false
        this.value = undefined
        this.c0.isLeafNode = true
        this.c1.isLeafNode = true
        this.c2.isLeafNode = true
        this.c3.isLeafNode = true
        this.c4.isLeafNode = true
        this.c5.isLeafNode = true
        this.c6.isLeafNode = true
        this.c7.isLeafNode = true
        this.quadCount = 8
        this.c0.decompressNode()
        this.c1.decompressNode()
        this.c2.decompressNode()
        this.c3.decompressNode()
        this.c4.decompressNode()
        this.c5.decompressNode()
        this.c6.decompressNode()
        this.c7.decompressNode()
    }
    reset() {
        this.isLeafNode = true
        this.c0 = undefined
        this.c1 = undefined
        this.c2 = undefined
        this.c3 = undefined
        this.c4 = undefined
        this.c5 = undefined
        this.c6 = undefined
        this.c7 = undefined
        this.quadCount = 0
    }
    addCoordinate(x: number, y: number, z: number, value: E): void {
        // Find which octant this point falls in
        if (this.isLeafNode && (this.value as E).compareTo(value) !== 0) {
            this.decompressNode()
        }
        let Quadrant = this.getOctant(x, y, z)
        // console.log("Is termination node")
        // console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow))
        if (Math.abs(this.yHigh - this.yLow) === this.unitLength && Math.abs(this.xHigh - this.xLow) === this.unitLength && Math.abs(this.zHigh - this.zLow) === this.unitLength) {
            if (Quadrant === -1) {
                // console.log("No Quadrient")
                return;
            } if (Quadrant === 0 && this.c0 === undefined) {
                this.c0 = new OctreeLeaf<E>(this.xLow, this.yLow, this.zLow, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 1 && this.c1 === undefined) {
                this.c1 = new OctreeLeaf<E>(this.xHigh, this.yLow, this.zLow, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 2 && this.c2 === undefined) {
                this.c2 = new OctreeLeaf<E>(this.xLow, this.yHigh, this.zLow, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 3 && this.c3 === undefined) {
                this.c3 = new OctreeLeaf<E>(this.xHigh, this.yHigh, this.zLow, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 4 && this.c4 === undefined) {
                this.c4 = new OctreeLeaf<E>(this.xLow, this.yLow, this.zHigh, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 5 && this.c5 === undefined) {
                this.c5 = new OctreeLeaf<E>(this.xHigh, this.yLow, this.zHigh, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 6 && this.c6 === undefined) {
                this.c6 = new OctreeLeaf<E>(this.xLow, this.yHigh, this.zHigh, value)
                this.quadCount += 1;
                this.nodeCount += 1
            } else if (Quadrant === 7 && this.c7 === undefined) {
                this.c7 = new OctreeLeaf<E>(this.xHigh, this.yHigh, this.zHigh, value)
                this.quadCount += 1;
                this.nodeCount += 1
            }
            this.compressNode()
            return;
        }
        if (Quadrant === -1) {
            console.error("No Quad")
            return;
        } else if (Quadrant === 0) {
            if (this.c0 === undefined) {
                this.c0 = new Octree(
                    this.xLow,
                    this.yLow,
                    this.zLow,
                    this.xLow + this.splitX - this.unitLength,
                    this.yLow + this.splitY - this.unitLength,
                    this.zLow + this.splitZ - this.unitLength,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c0 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 1) {
            if (this.c1 === undefined) {
                // Shift one over to the right on the x-axis
                this.c1 = new Octree(
                    this.xLow + this.splitX,
                    this.yLow,
                    this.zLow,
                    this.xHigh,
                    this.yLow + this.splitY - this.unitLength,
                    this.zLow + this.splitZ - this.unitLength,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c1 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 2) {
            if (this.c2 === undefined) {
                // Shift one up on the y-axis.
                this.c2 = new Octree(
                    this.xLow,
                    this.splitY + this.yLow,
                    this.zLow,
                    this.xLow + this.splitX - this.unitLength,
                    this.yHigh,
                    this.zLow + this.splitZ - this.unitLength,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c2 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 3) {
            if (this.c3 === undefined) {
                // shift on x and y axis
                this.c3 = new Octree(
                    this.splitX + this.xLow,
                    this.splitY + this.yLow,
                    this.zLow,
                    this.xHigh,
                    this.yHigh,
                    this.zLow + this.splitZ - this.unitLength,
                    this.unitLength, this
                )
                this.quadCount += 1;
            }
            (this.c3 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 4) {
            if (this.c4 === undefined) {
                // shift on z
                this.c4 = new Octree(
                    this.xLow,
                    this.yLow,
                    this.zLow + this.splitZ,
                    this.xLow + this.splitX - this.unitLength,
                    this.yLow + this.splitY - this.unitLength,
                    this.zHigh,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c4 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 5) {
            if (this.c5 === undefined) {
                this.c5 = new Octree(
                    this.xLow + this.splitX,
                    this.yLow,
                    this.zLow + this.splitZ,
                    this.xHigh,
                    this.yLow + this.splitY - this.unitLength,
                    this.zHigh,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c5 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 6) {
            if (this.c6 === undefined) {
                this.c6 = new Octree(
                    this.xLow,
                    this.splitY + this.yLow,
                    this.zLow + this.splitZ,
                    this.xLow + this.splitX - this.unitLength,
                    this.yHigh,
                    this.zHigh,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c6 as Octree<E>).addCoordinate(x, y, z, value)
        } else if (Quadrant === 7) {
            if (this.c7 === undefined) {
                this.c7 = new Octree(
                    this.splitX + this.xLow,
                    this.splitY + this.yLow,
                    this.zLow + this.splitZ,
                    this.xHigh,
                    this.yHigh,
                    this.zHigh,
                    this.unitLength, this)
                this.quadCount += 1;
            }
            (this.c7 as Octree<E>).addCoordinate(x, y, z, value)
        }
        // console.log("Running compress node")
        this.compressNode()
        this.nodeCount += 1
    }
    /**
     * The iteration function loops through the Octree and passes Octree volumes to the callback
     * 
     * @param callback A Function that accepts a Octree<E> or OctreeLeaf<E> as the first arguement
     * @param onlyLeafNodes A boolean that specifies if only leaf volumes get passed to the call back (true) or all volumes get passed (false).
     */
    iteration(callback: Function, onlyLeafNodes: boolean): void {
        if (this.c0) {
            if (!onlyLeafNodes || this.c0.isLeafNode) {
                callback(this.c0)
            }
        }
        if (this.c1) {
            if (!onlyLeafNodes || this.c1.isLeafNode) {
                callback(this.c1)
            }
        }
        if (this.c2) {
            if (!onlyLeafNodes || this.c2.isLeafNode) {
                callback(this.c2)
            }
        }
        if (this.c3) {
            if (!onlyLeafNodes || this.c3.isLeafNode) {
                callback(this.c3)
            }
        }
        if (this.c4) {
            if (!onlyLeafNodes || this.c4.isLeafNode) {
                callback(this.c4)
            }
        }
        if (this.c5) {
            if (!onlyLeafNodes || this.c5.isLeafNode) {
                callback(this.c5)
            }
        }
        if (this.c6) {
            if (!onlyLeafNodes || this.c6.isLeafNode) {
                callback(this.c6)
            }
        }
        if (this.c7) {
            if (!onlyLeafNodes || this.c7.isLeafNode) {
                callback(this.c7)
            }
        }
    }
    doesTriangleIntersect(polygon: Triangle3D<E>): boolean {
      
    }
}