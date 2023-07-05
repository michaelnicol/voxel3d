import { Point } from "./Point.js";

export class Point2D implements Point {
  public arr: number[];
  constructor(x: number, y: number) {
    this.arr = [x, y];
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
  factoryMethod(dimensionValues: number[]): Point2D {
    return new Point2D(dimensionValues[0], dimensionValues[1])
  }
  clone(): Point2D {
    return new Point2D(this.arr[0], this.arr[1]);
  }
}