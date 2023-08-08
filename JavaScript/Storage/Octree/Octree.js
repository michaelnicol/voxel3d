export class Octree {
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
    isLeafNode;
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
    constructor(xLow, yLow, zLow, xHigh, yHigh, zHigh) {
        this.xLow = xLow;
        this.yLow = yLow;
        this.zLow = zLow;
        this.xHigh = xHigh;
        this.yHigh = yHigh;
        this.zHigh = zHigh;
        this.midX = Math.round((xHigh - xLow) / 2);
        this.midY = Math.round((yHigh - yLow) / 2);
        this.midZ = Math.round((zHigh - zLow) / 2);
        if (this.midX === 1 && this.midY === 1 && this.midZ === 1) {
            this.isLeafNode = true;
        }
    }
    getOctant(point) {
        const { arr } = point;
        const x = arr[0];
        const y = arr[1];
        const z = arr[2];
        if (x <= this.midX && y <= this.midY && z <= this.midZ) {
            return 0;
        }
        else if (x > this.midX && y <= this.midY && z <= this.midZ) {
            return 1;
        }
        else if (x <= this.midX && y > this.midY && z <= this.midZ) {
            return 2;
        }
        else if (x > this.midX && y > this.midY && z <= this.midZ) {
            return 3;
        }
        else if (x <= this.midX && y <= this.midY && z > this.midZ) {
            return 4;
        }
        else if (x > this.midX && y <= this.midY && z > this.midZ) {
            return 5;
        }
        else if (x <= this.midX && y > this.midY && z > this.midZ) {
            return 6;
        }
        else if (x > this.midX && y > this.midY && z > this.midZ) {
            return 7;
        }
        else {
            return -1;
        }
    }
    hasCoordinate(point) {
        switch (this.getOctant(point)) {
            case -1:
                return false;
            case 0:
                return this.c0 === undefined ? false : this.c0.isLeafNode ? true : this.c0.hasCoordinate(point);
            case 1:
                return this.c1 === undefined ? false : this.c1.isLeafNode ? true : this.c1.hasCoordinate(point);
            case 2:
                return this.c2 === undefined ? false : this.c2.isLeafNode ? true : this.c2.hasCoordinate(point);
            case 3:
                return this.c3 === undefined ? false : this.c3.isLeafNode ? true : this.c3.hasCoordinate(point);
            case 4:
                return this.c4 === undefined ? false : this.c4.isLeafNode ? true : this.c4.hasCoordinate(point);
            case 5:
                return this.c5 === undefined ? false : this.c5.isLeafNode ? true : this.c5.hasCoordinate(point);
            case 6:
                return this.c6 === undefined ? false : this.c6.isLeafNode ? true : this.c6.hasCoordinate(point);
            case 7:
                return this.c7 === undefined ? false : this.c7.isLeafNode ? true : this.c7.hasCoordinate(point);
            default:
                return false;
        }
    }
    addCoordinate(point) {
        if (this.isLeafNode) {
            return;
        }
        // Find which octant this point falls in
        switch (this.getOctant(point)) {
            case -1:
                return;
            case 0:
                if (this.c0 === undefined) {
                    this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ);
                    this.nodeCount += 1;
                }
                if (!this.c0.isLeafNode) {
                    this.c0.addCoordinate(point);
                }
            case 1:
                if (this.c1 === undefined) {
                    this.c1 = new Octree(this.xLow + this.midX, this.yLow, this.zLow, this.xHigh, this.yLow + this.midY, this.zLow + this.midZ);
                    this.nodeCount += 1;
                }
                if (!this.c1.isLeafNode) {
                    this.c1.addCoordinate(point);
                }
            case 2:
                if (this.c2 === undefined) {
                    this.c2 = new Octree(this.xLow, this.midY, this.zLow, this.xLow + this.midX, this.yHigh, this.zLow + this.midZ);
                    this.nodeCount += 1;
                }
                if (!this.c2.isLeafNode) {
                    this.c2.addCoordinate(point);
                }
            case 3:
                if (this.c3 === undefined) {
                    this.c3 = new Octree(this.midX, this.midY, this.zLow, this.xHigh, this.yHigh, this.zLow + this.midZ);
                    this.nodeCount += 1;
                }
                if (!this.c3.isLeafNode) {
                    this.c3.addCoordinate(point);
                }
            case 4:
                if (this.c4 === undefined) {
                    this.c4 = new Octree(this.xLow, this.yLow, this.midZ, this.xLow + this.midX, this.yLow + this.midY, this.zHigh);
                    this.nodeCount += 1;
                }
                if (!this.c4.isLeafNode) {
                    this.c4.addCoordinate(point);
                }
            case 5:
                if (this.c5 === undefined) {
                    this.c5 = new Octree(this.xLow + this.midX, this.yLow, this.midZ, this.xHigh, this.yLow + this.midY, this.zHigh);
                    this.nodeCount += 1;
                }
                if (!this.c5.isLeafNode) {
                    this.c5.addCoordinate(point);
                }
            case 6:
                if (this.c6 === undefined) {
                    this.c6 = new Octree(this.xLow, this.midY, this.midZ, this.xLow + this.midX, this.yHigh, this.zHigh);
                    this.nodeCount += 1;
                }
                if (!this.c6.isLeafNode) {
                    this.c6.addCoordinate(point);
                }
            case 7:
                if (this.c7 === undefined) {
                    this.c7 = new Octree(this.midX, this.midY, this.zLow, this.xHigh, this.yHigh, this.zHigh);
                    this.nodeCount += 1;
                }
                if (!this.c7.isLeafNode) {
                    this.c7.addCoordinate(point);
                }
        }
    }
}
