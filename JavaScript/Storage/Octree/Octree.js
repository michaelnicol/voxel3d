export class OctreeLeaf {
    value;
    isLeafNode = true;
    constructor(value) {
        this.value = value;
    }
}
export class Octree {
    unitLength;
    isLeafNode = false;
    value;
    xLow;
    yLow;
    zLow;
    xHigh;
    yHigh;
    zHigh;
    midX;
    midY;
    midZ;
    /**
     * xLow, yLow, zLow
     */
    c0;
    /**
     * xHigh, yLow, zLow
     */
    c1;
    /**
     * xLow, yHigh, zLow
     */
    c2;
    /**
     * xHigh, yHigh, zLow
     */
    c3;
    /**
     * xLow, yLow, zHigh
     */
    c4;
    /**
     * xHigh, yLow, zHigh
     */
    c5;
    /**
     * xLow, yHigh, zHigh
     */
    c6;
    /**
     * xHigh, yHigh, zHigh
     */
    c7;
    nodeCount = 0;
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
    constructor(xLow, yLow, zLow, xHigh, yHigh, zHigh, unitLength) {
        this.unitLength = unitLength;
        console.log("\nCreating");
        console.log(xLow, yLow, zLow, xHigh, yHigh, zHigh);
        this.xLow = xLow;
        this.yLow = yLow;
        this.zLow = zLow;
        this.xHigh = xHigh;
        this.yHigh = yHigh;
        this.zHigh = zHigh;
        this.midX = ((xHigh - xLow) / 2);
        this.midY = ((yHigh - yLow) / 2);
        this.midZ = ((zHigh - zLow) / 2);
        // Snap to a unit length once it becomes less than the tesselation
        this.midX = this.midX < unitLength ? 0 : this.midX;
        this.midY = this.midY < unitLength ? 0 : this.midY;
        this.midZ = this.midZ < unitLength ? 0 : this.midZ;
        console.log("Mid");
        console.log(this.midX, this.midY, this.midZ);
        console.log("Lengths");
        console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow));
    }
    getOctant(point) {
        const { arr } = point;
        const x = arr[0];
        const y = arr[1];
        const z = arr[2];
        if (x <= this.midX + this.xLow && y <= this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 0;
        }
        else if (x > this.midX + this.xLow && y <= this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 1;
        }
        else if (x <= this.midX + this.xLow && y > this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 2;
        }
        else if (x > this.midX + this.xLow && y > this.midY + this.yLow && z <= this.midZ + this.zLow) {
            return 3;
        }
        else if (x <= this.midX + this.xLow && y <= this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 4;
        }
        else if (x > this.midX + this.xLow && y <= this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 5;
        }
        else if (x <= this.midX + this.xLow && y > this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 6;
        }
        else if (x > this.midX + this.xLow && y > this.midY + this.yLow && z > this.midZ + this.zLow) {
            return 7;
        }
        else {
            return -1;
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
    compressNode() {
        if (this.c0 instanceof Octree) {
            this.c0.compressNode();
        }
        if (this.c1 instanceof Octree) {
            this.c1.compressNode();
        }
        if (this.c2 instanceof Octree) {
            this.c2.compressNode();
        }
        if (this.c3 instanceof Octree) {
            this.c3.compressNode();
        }
        if (this.c4 instanceof Octree) {
            this.c4.compressNode();
        }
        if (this.c5 instanceof Octree) {
            this.c5.compressNode();
        }
        if (this.c6 instanceof Octree) {
            this.c6.compressNode();
        }
        if (this.c7 instanceof Octree) {
            this.c7.compressNode();
        }
        console.log("Compressing");
        let sectors = [this.c0, this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7];
        let canBeCompressed = true;
        for (let sector of sectors) {
            if (sector === undefined || sector.value === undefined) {
                canBeCompressed = false;
                break;
            }
        }
        console.log("Can be compressed Initial: " + canBeCompressed);
        if (canBeCompressed) {
            let compressedValue = this.c0.value;
            for (let sector of sectors) {
                if (sector.value.compareTo(compressedValue) !== 0) {
                    canBeCompressed = false;
                    break;
                }
            }
        }
        console.log("Can be compressed: " + canBeCompressed);
        if (canBeCompressed) {
            this.value = this.c0.value;
            this.isLeafNode = true;
            this.c0 = undefined;
            this.c1 = undefined;
            this.c2 = undefined;
            this.c3 = undefined;
            this.c4 = undefined;
            this.c5 = undefined;
            this.c6 = undefined;
            this.c7 = undefined;
        }
    }
    decompressNode() {
        this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this.unitLength);
        this.c0.value = this.value;
        this.c1 = new Octree(this.xLow + this.midX, this.yLow, this.zLow, this.xHigh, this.yLow + this.midY, this.zLow + this.midZ, this.unitLength);
        this.c1.value = this.value;
        this.c2 = new Octree(this.xLow, this.midY + this.yLow, this.zLow, this.xLow + this.midX, this.yHigh, this.zLow + this.midZ, this.unitLength);
        this.c2.value = this.value;
        this.c3 = new Octree(this.midX + this.xLow, this.midY + this.yLow, this.zLow, this.xHigh, this.yHigh, this.zLow + this.midZ, this.unitLength);
        this.c3.value = this.value;
        this.c4 = new Octree(this.xLow, this.yLow, this.midZ + this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zHigh, this.unitLength);
        this.c4.value = this.value;
        this.c5 = new Octree(this.xLow + this.midX, this.yLow, this.midZ + this.zLow, this.xHigh, this.yLow + this.midY, this.zHigh, this.unitLength);
        this.c5.value = this.value;
        this.c6 = new Octree(this.xLow, this.midY + this.yLow, this.midZ + this.zLow, this.xLow + this.midX, this.yHigh, this.zHigh, this.unitLength);
        this.c6.value = this.value;
        this.c7 = new Octree(this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this.xHigh, this.yHigh, this.zHigh, this.unitLength);
        this.c7.value = this.value;
        this.isLeafNode = false;
        this.value = undefined;
        this.c0.isLeafNode = true;
        this.c1.isLeafNode = true;
        this.c2.isLeafNode = true;
        this.c3.isLeafNode = true;
        this.c4.isLeafNode = true;
        this.c5.isLeafNode = true;
        this.c6.isLeafNode = true;
        this.c7.isLeafNode = true;
    }
    addCoordinate(point, value) {
        // Find which octant this point falls in
        if (this.isLeafNode && this.value.compareTo(value) !== 0) {
            this.decompressNode();
        }
        let Quadrant = this.getOctant(point);
        console.log("Point: " + point.toPrint());
        console.log("Quadrant: " + Quadrant);
        // console.log("Is termination node")
        // console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow))
        if (Math.abs(this.yHigh - this.yLow) === this.unitLength && Math.abs(this.xHigh - this.xLow) === this.unitLength && Math.abs(this.zHigh - this.zLow) === this.unitLength) {
            if (Quadrant === -1) {
                // console.log("No Quadrient")
                return;
            }
            if (Quadrant === 0 && this.c0 === undefined) {
                this.c0 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 1 && this.c1 === undefined) {
                this.c1 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 2 && this.c2 === undefined) {
                this.c2 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 3 && this.c3 === undefined) {
                this.c3 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 4 && this.c4 === undefined) {
                this.c4 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 5 && this.c5 === undefined) {
                this.c5 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 6 && this.c6 === undefined) {
                this.c6 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            else if (Quadrant === 7 && this.c7 === undefined) {
                this.c7 = new OctreeLeaf(value);
                this.nodeCount += 1;
            }
            return;
        }
        if (Quadrant === -1) {
            // console.log("No Quadrient")
            return;
        }
        else if (Quadrant === 0) {
            if (this.c0 === undefined) {
                this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX - this.unitLength, this.yLow + this.midY - this.unitLength, this.zLow + this.midZ - this.unitLength, this.unitLength);
            }
            this.c0.addCoordinate(point, value);
        }
        else if (Quadrant === 1) {
            if (this.c1 === undefined) {
                // Shift one over to the right on the x-axis
                this.c1 = new Octree(this.xLow + this.midX, this.yLow, this.zLow, this.xHigh, this.yLow + this.midY - this.unitLength, this.zLow + this.midZ - this.unitLength, this.unitLength);
            }
            this.c1.addCoordinate(point, value);
        }
        else if (Quadrant === 2) {
            if (this.c2 === undefined) {
                // Shift one up on the y-axis.
                this.c2 = new Octree(this.xLow, this.midY + this.yLow, this.zLow, this.xLow + this.midX - this.unitLength, this.yHigh, this.zLow + this.midZ - this.unitLength, this.unitLength);
            }
            this.c2.addCoordinate(point, value);
        }
        else if (Quadrant === 3) {
            if (this.c3 === undefined) {
                // shift on x and y axis
                this.c3 = new Octree(this.midX + this.xLow, this.midY + this.yLow, this.zLow, this.xHigh, this.yHigh, this.zLow + this.midZ - this.unitLength, this.unitLength);
            }
            this.c3.addCoordinate(point, value);
        }
        else if (Quadrant === 4) {
            if (this.c4 === undefined) {
                // shift on z
                this.c4 = new Octree(this.xLow, this.yLow, this.zLow + this.midZ, this.xLow + this.midX - this.unitLength, this.yLow + this.midY - this.unitLength, this.zLow + this.midZ - this.unitLength, this.unitLength);
            }
            this.c4.addCoordinate(point, value);
        }
        else if (Quadrant === 5) {
            if (this.c5 === undefined) {
                this.c5 = new Octree(this.xLow + this.midX, this.yLow, this.zLow + this.midZ, this.xHigh, this.yLow + this.midY - this.unitLength, this.zHigh, this.unitLength);
            }
            this.c5.addCoordinate(point, value);
        }
        else if (Quadrant === 6) {
            if (this.c6 === undefined) {
                this.c6 = new Octree(this.xLow, this.midY + this.yLow, this.zLow + this.midZ, this.xLow + this.midX - this.unitLength, this.yHigh, this.zHigh, this.unitLength);
            }
            this.c6.addCoordinate(point, value);
        }
        else if (Quadrant === 7) {
            if (this.c7 === undefined) {
                this.c7 = new Octree(this.midX + this.xLow, this.midY + this.yLow, this.zLow + this.midZ, this.xHigh, this.yHigh, this.zHigh, this.unitLength);
            }
            this.c7.addCoordinate(point, value);
        }
        this.nodeCount += 1;
    }
}
