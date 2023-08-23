export class Point1D {
    arr;
    constructor(x) {
        this.arr = [x];
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
        return new Point1D(dimensionValues[0]);
    }
    clone() {
        return new Point1D(this.arr[0]);
    }
}
