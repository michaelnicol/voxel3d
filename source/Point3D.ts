import { Point } from "./Point";

export class Point3D implements Point {
   public x: number;
   public y: number;
   public z: number;
   public arr: number[];
   constructor(x: number, y: number, z: number) {
     this.x = x;
     this.y = y;
     this.z = z;
     this.arr = [x,y,z];
   }
   preHash(): string {
       return this.arr.join(",");
   }
   toPrint(): string {
       return this.arr.join(",");
   }
 }