import { Point } from "./Point.js";

export class Point2D implements Point {
  public dimensions: Map<string, number> = new Map<string, number>;
  public arr: number[];
  constructor(x: number, y: number) {
    this.dimensions.set("x", x);
    this.dimensions.set("y", y);
    this.arr = [x, y];
  }
  getCoordinateValue(key: string): number | undefined {
    return this.dimensions.get(key.toLowerCase());
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