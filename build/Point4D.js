export class Point4D {
    x;
    y;
    z;
    t;
    arr;
    constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
        this.arr = [x, y, z, t];
    }
    preHash() {
        return this.arr.join(",");
    }
    toPrint() {
        return this.arr.join(",");
    }
    dimensionCount() {
        return this.arr.length;
    }
}
