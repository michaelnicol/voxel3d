import { Point2D } from "./Point2D.js";
import { Utilities } from "./Utilities.js";
import { ValidObject } from "./ValidObject.js";
import { cloneable } from "./cloneable.js";

export class BoundingBox2D implements ValidObject, cloneable<BoundingBox2D> {
   /**
    * X-Low, Y-Low
    */
   BL!: Point2D;
   /**
    * X-High, Y-Low
    */
   BR!: Point2D
   /**
    * X-Low, Y-High
    */
   UL!: Point2D
   /**
    * X-High, Y-High
    */
   UR!: Point2D
   center!: Point2D
   xRange!: number
   yRange!: number
   constructor(UL: Point2D, UR: Point2D, BL: Point2D, BR: Point2D) {
      this.UL = UL.clone();
      this.UR = UR.clone();
      this.BL = BL.clone();
      this.BR = BR.clone();
      this.center = Utilities.pointCenter([this.BL, this.BR, this.UL, this.UR])
      this.xRange = Math.abs(UR.arr[0] - UL.arr[0])
      this.yRange = Math.abs(UL.arr[1] - BL.arr[1])
   }
   toPrint(): string {
      return `[${this.UL.toPrint()}, ${this.UR.toPrint()}, ${this.BL.toPrint()}, ${this.BR.toPrint()}]`
   }
   getCoordinateList(): Point2D[] {
      return [this.UL.clone(), this.UR.clone(), this.BL.clone(), this.BR.clone()]
   }
   canDimensionsFit(box: BoundingBox2D): boolean {
      return (this.UL.arr[0] + box.xRange <= this.UR.arr[0]) && (this.UL.arr[1] + box.yRange <= this.BL.arr[1])
   }
   area(): number {
      return Utilities.pythagorean(this.UL, this.UR) * Utilities.pythagorean(this.BL, this.BR)
   }
   clone(): BoundingBox2D {
      return new BoundingBox2D(this.UL, this.UR, this.BL, this.BR)
   }
   preHash(): string {
      return this.toPrint();
   }
}