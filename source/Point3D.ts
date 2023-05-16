import { Point } from "./Point.js";

export class Point3D implements Point {
  public dimensions: Map<string, number> = new Map<string, number>;
  public arr: number[];
  constructor(x: number, y: number, z: number) {
    this.dimensions.set("x", x);
    this.dimensions.set("y", y);
    this.dimensions.set("z", z);
    this.arr = [x, y, z];
  }
  getCoordinateValue(key: string): number | undefined {
    return this.dimensions.get(key.toLowerCase());
  }
  preHash(): string {
    return this.arr.join(",");
  }
  toPrint(): string {
    return this.arr.join(",");
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