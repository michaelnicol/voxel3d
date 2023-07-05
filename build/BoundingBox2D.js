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
    constructor(UL, UR, BL, BR) {
        this.UL = UL.clone();
        this.UR = UR.clone();
        this.BL = BL.clone();
        this.BR = BR.clone();
        this.center = Utilities.pointCenter([this.BL, this.BR, this.UL, this.UR]);
    }
    toPrint() {
        return `[${this.UL.toPrint()}, ${this.UR.toPrint()}, ${this.BL.toPrint()}, ${this.BR.toPrint()}]`;
    }
    clone() {
        return new BoundingBox2D(this.UL, this.UR, this.BL, this.BR);
    }
    preHash() {
        return this.toPrint();
    }
}
