import { Point } from "./Point.js";

export class Point3D implements Point {
  public arr: number[];
  constructor(x: number, y: number, z: number) {
    this.arr = [x, y, z];
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
  factoryMethod(dimensionValues: number[]): Point3D {
    return new Point3D(dimensionValues[0], dimensionValues[1], dimensionValues[2])
  }
  clone(): Point3D {
    return new Point3D(this.arr[0], this.arr[1], this.arr[2]);
  }
}