import { Point2D } from "./Point2D.js";
import { Utilities } from "./Utilities.js";
import { ValidObject } from "./ValidObject.js";
import { cloneable } from "./cloneable.js";

export class BoundingBox2D implements ValidObject, cloneable<BoundingBox2D> {
   /**
    * X-Low, Y-Low
    */
   #BL!: Point2D;
   /**
    * X-High, Y-Low
    */
   #BR!: Point2D
   /**
    * X-Low, Y-High
    */
   #UL!: Point2D
   /**
    * X-High, Y-High
    */
   #UR!: Point2D
   center!: Point2D
   translation: Point2D = new Point2D(0, 0)
   xRange!: number
   yRange!: number
   area!: number
   gap!: number
   constructor(UL: Point2D, UR: Point2D, BL: Point2D, BR: Point2D, gap: number) {
      this.#UL = UL.clone();
      this.#UR = UR.clone();
      this.#BL = BL.clone();
      this.#BR = BR.clone();
      this.gap = gap;
      this.cornersHaveChanged()
   }
   getUL(): Point2D {
      let ul = this.#UL.clone()
      ul.arr[0] -= (this.gap);
      ul.arr[1] += (this.gap);
      ul.arr[0] += this.translation.arr[0]
      ul.arr[1] += this.translation.arr[1]
      return ul
   }
   getUR(): Point2D {
      let ur = this.#UR.clone()
      ur.arr[0] += (this.gap);
      ur.arr[1] += (this.gap);
      ur.arr[0] += this.translation.arr[0]
      ur.arr[1] += this.translation.arr[1]
      return ur
   }
   getBL(): Point2D {
      let bl = this.#BL.clone()
      bl.arr[0] -= (this.gap);
      bl.arr[1] -= (this.gap);
      bl.arr[0] += this.translation.arr[0]
      bl.arr[1] += this.translation.arr[1]
      return bl
   }
   getBR(): Point2D {
      let br = this.#BR.clone()
      br.arr[0] += (this.gap);
      br.arr[1] -= (this.gap);
      br.arr[0] += this.translation.arr[0]
      br.arr[1] += this.translation.arr[1]
      return br
   }
   setUL(ul: Point2D) {
      this.#UL = ul.clone()
   }
   setUR(ur: Point2D) {
      this.#UR = ur.clone()
   }
   setBL(bl: Point2D) {
      this.#BL = bl.clone()
   }
   setBR(br: Point2D) {
      this.#BR = br.clone()
   }
   static createFromExtremes(points: Point2D[], gap: number): BoundingBox2D {
      let maxY: number = -Number.MAX_VALUE
      let minY: number = Number.MAX_VALUE
      let maxX: number = -Number.MAX_VALUE
      let minX: number = Number.MAX_VALUE
      for (let point of points) {
         let x = point.arr[0]
         let y = point.arr[1]
         if (x > maxX) {
            maxX = x;
         }
         if (x < minX) {
            minX = x;
         }
         if (y > maxY) {
            maxY = y;
         }
         if (y < minY) {
            minY = y;
         }
      }
      return new BoundingBox2D(new Point2D(minX, maxY), new Point2D(maxX, maxY), new Point2D(minX, minY), new Point2D(maxX, minY), gap)
   }
   cornersHaveChanged() {
      // Center does not need to account for the gap
      this.center = Utilities.pointCenter([this.#BL, this.#BR, this.#UL, this.#UR])
      this.xRange = Math.abs(this.getUR().arr[0] - this.getUL().arr[0])
      this.yRange = Math.abs(this.getUL().arr[1] - this.getBL().arr[1])
      this.area = Utilities.pythagorean(this.getUL(), this.getUR()) * Utilities.pythagorean(this.getBL(), this.getUL())
   }
   translateBoundingBox(translation: Point2D) {
      this.translation = translation.clone()
   }
   toPrint(): string {
      return `[${this.getUL().toPrint()}, ${this.getUR().toPrint()}, ${this.getBL().toPrint()}, ${this.getBR().toPrint()}]`
   }
   getCoordinateList(): Point2D[] {
      return [this.getUL(), this.getUR(), this.getBL(), this.getBR()]
   }
   canDimensionsFit(box: BoundingBox2D): boolean {
      return (this.getUL().arr[0] + box.xRange <= this.getUR().arr[0]) && (this.getBL().arr[1] + box.yRange <= this.getUL().arr[1])
   }
   clone(): BoundingBox2D {
      return new BoundingBox2D(this.#UL, this.#UR, this.#BL, this.#BR, this.gap)
   }
   preHash(): string {
      return this.toPrint();
   }
}