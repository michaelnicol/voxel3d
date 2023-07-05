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
   constructor(UL: Point2D, UR: Point2D, BL: Point2D, BR: Point2D) {
      this.UL = UL.clone();
      this.UR = UR.clone();
      this.BL = BL.clone();
      this.BR = BR.clone();
      this.center = Utilities.pointCenter([this.BL, this.BR, this.UL, this.UR])
   }
   toPrint(): string {
       return `[${this.UL.toPrint()}, ${this.UR.toPrint()}, ${this.BL.toPrint()}, ${this.BR.toPrint()}]`
   }
   clone(): BoundingBox2D {
      return new BoundingBox2D(this.UL, this.UR, this.BL, this.BR)
   }
   preHash(): string {
      return this.toPrint();
   }
}