export class Point3D {
    x;
    y;
    z;
    arr;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.arr = [x, y, z];
    }
    preHash() {
        return this.arr.join(",");
    }
    toPrint() {
        return this.arr.join(",");
    }
}
