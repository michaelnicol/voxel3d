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
    parent;
    /**
     * xLow, yLow, zLow
     */
    c0;
    isLeafNode;
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
    constructor(xLow, yLow, zLow, xHigh, yHigh, zHigh, parent) {
        console.log("\nCreating");
        console.log(xLow, yLow, zLow, xHigh, yHigh, zHigh);
        this.parent = parent;
        this.xLow = xLow;
        this.yLow = yLow;
        this.zLow = zLow;
        this.xHigh = xHigh;
        this.yHigh = yHigh;
        this.zHigh = zHigh;
        this.midX = Math.round((xHigh - xLow) / 2);
        this.midY = Math.round((yHigh - yLow) / 2);
        this.midZ = Math.round((zHigh - zLow) / 2);
        console.log("Mid");
        console.log(this.midX, this.midY, this.midZ);
        if (!(this.midX == this.midY &&
            this.midX == this.midZ &&
            this.midY == this.midZ)) {
            throw new Error();
        }
        console.log("Lengths");
        console.log(Math.abs(this.yHigh - this.yLow), Math.abs(this.xHigh - this.xLow), Math.abs(this.zHigh - this.zLow));
        if (Math.abs(this.yHigh - this.yLow) === 1 && Math.abs(this.xHigh - this.xLow) === 1 && Math.abs(this.zHigh - this.zLow) === 1) {
            console.log("is a leaf node");
            this.isLeafNode = true;
        }
        else {
            console.log("Is not a leaf node");
            this.isLeafNode = false;
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
        return -1;
    }
    hasCoordinate(point) {
        switch (this.getOctant(point)) {
            case -1:
                return false;
            case 0:
                return this.c0 === undefined ? false : this.c0.isLeafNode ? true : this.c0.hasCoordinate(point);
            default:
                return false;
        }
    }
    addCoordinate(point) {
        console.log('Add coordinate running');
        console.log(this);
        if (this.isLeafNode) {
            console.log("Is leaf node, returning");
            return;
        }
        console.log(this.isLeafNode);
        console.log("Quadrant: " + this.getOctant(point));
        // Find which octant this point falls in
        let Quadrant = this.getOctant(point);
        switch (Quadrant) {
            case -1:
                throw new Error("Wrong Quadrient");
            case 0:
                if (this.c0 === undefined) {
                    this.c0 = new Octree(this.xLow, this.yLow, this.zLow, this.xLow + this.midX, this.yLow + this.midY, this.zLow + this.midZ, this);
                }
                if (!this.c0.isLeafNode) {
                    this.c0.addCoordinate(point);
                }
                return;
            default:
                throw new Error("Wrong Quadrient");
        }
    }
}
