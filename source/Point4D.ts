import { Point } from "./Point.js";

export class Point4D implements Point {
   public x: number;
   public y: number;
   public z: number;
   public t: number
   public arr: number[];
   constructor(x: number, y: number, z: number, t:number) {
     this.x = x;
     this.y = y;
     this.z = z;
     this.t = t;
     this.arr = [x,y,z,t];
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
 }