import { Point } from "./Point.js";

export class Point1D implements Point {
  public arr: number[];
  constructor(x: number) {
    this.arr = [x];
  }
  preHash(): string {
    return this.arr.join(",");
  }
  toPrint(): string {
    return "["+this.arr.join(",")+"]";
  }
  dimensionCount(): number {
    return this.arr.length;
  }
  factoryMethod(dimensionValues: number[]): Point1D {
    return new Point1D(dimensionValues[0])
  }
  clone(): Point1D {
    return new Point1D(this.arr[0]);
  }
}