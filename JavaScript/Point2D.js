export class Point2D {
    arr;
    constructor(x, y) {
        this.arr = [x, y];
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
        return new Point2D(dimensionValues[0], dimensionValues[1]);
    }
    clone() {
        return new Point2D(this.arr[0], this.arr[1]);
    }
}
