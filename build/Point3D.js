export class Point3D {
    dimensions = new Map;
    arr;
    constructor(x, y, z) {
        this.dimensions.set("x", x);
        this.dimensions.set("y", x);
        this.dimensions.set("z", x);
        this.arr = [x, y, z];
    }
    getCoordinateValue(key) {
        return this.dimensions.get(key.toLowerCase());
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
    clone() {
        return new Point3D(this.arr[0], this.arr[1], this.arr[2]);
    }
}
