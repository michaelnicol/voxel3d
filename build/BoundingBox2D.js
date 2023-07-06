import { Utilities } from "./Utilities.js";
export class BoundingBox2D {
    /**
     * X-Low, Y-Low
     */
    BL;
    /**
     * X-High, Y-Low
     */
    BR;
    /**
     * X-Low, Y-High
     */
    UL;
    /**
     * X-High, Y-High
     */
    UR;
    center;
    xRange;
    yRange;
    constructor(UL, UR, BL, BR) {
        this.UL = UL.clone();
        this.UR = UR.clone();
        this.BL = BL.clone();
        this.BR = BR.clone();
        this.center = Utilities.pointCenter([this.BL, this.BR, this.UL, this.UR]);
        this.xRange = Math.abs(UR.arr[0] - UL.arr[0]);
        this.yRange = Math.abs(UL.arr[1] - BL.arr[1]);
    }
    toPrint() {
        return `[${this.UL.toPrint()}, ${this.UR.toPrint()}, ${this.BL.toPrint()}, ${this.BR.toPrint()}]`;
    }
    getCoordinateList() {
        return [this.UL.clone(), this.UR.clone(), this.BL.clone(), this.BR.clone()];
    }
    canDimensionsFit(box) {
        return (this.UL.arr[0] + box.xRange <= this.UR.arr[0]) && (this.UL.arr[1] + box.yRange <= this.BL.arr[1]);
    }
    area() {
        return Utilities.pythagorean(this.UL, this.UR) * Utilities.pythagorean(this.BL, this.BR);
    }
    clone() {
        return new BoundingBox2D(this.UL, this.UR, this.BL, this.BR);
    }
    preHash() {
        return this.toPrint();
    }
}
