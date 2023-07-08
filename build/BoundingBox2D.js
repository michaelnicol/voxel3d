import { Point2D } from "./Point2D.js";
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
    area;
    constructor(UL, UR, BL, BR) {
        this.UL = UL.clone();
        this.UR = UR.clone();
        this.BL = BL.clone();
        this.BR = BR.clone();
        this.cornersHaveChanged();
    }
    createCorners(points) {
        let maxY = -Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let minX = Number.MAX_VALUE;
        for (let point of points) {
            let x = point.arr[0];
            let y = point.arr[1];
            if (x > maxX) {
                maxX = x;
            }
            if (x < minX) {
                minX = x;
            }
            if (y > maxY) {
                maxX = y;
            }
            if (y < minY) {
                minX = y;
            }
        }
        this.BL = new Point2D(minX, minY);
        this.BR = new Point2D(maxX, minY);
        this.UL = new Point2D(minX, maxY);
        this.UR = new Point2D(maxX, maxY);
        this.cornersHaveChanged();
    }
    cornersHaveChanged() {
        this.center = Utilities.pointCenter([this.BL, this.BR, this.UL, this.UR]);
        this.xRange = Math.abs(this.UR.arr[0] - this.UL.arr[0]);
        this.yRange = Math.abs(this.UL.arr[1] - this.BL.arr[1]);
        this.area = Utilities.pythagorean(this.UL, this.UR) * Utilities.pythagorean(this.BL, this.BR);
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
    clone() {
        return new BoundingBox2D(this.UL, this.UR, this.BL, this.BR);
    }
    preHash() {
        return this.toPrint();
    }
}
