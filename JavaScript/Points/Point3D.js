export class Point3D {
    arr;
    constructor(x, y, z) {
        this.arr = [x, y, z];
    }
    preHash() {
        return this.arr.join(",");
    }
    toPrint() {
        return "[" + this.arr.join(",") + "]";
    }
    dimensionCount() {
        return this.arr.length;
    }
    factoryMethod(dimensionValues) {
        return new Point3D(dimensionValues[0], dimensionValues[1], dimensionValues[2]);
    }
    clone() {
        return new Point3D(this.arr[0], this.arr[1], this.arr[2]);
    }
}
