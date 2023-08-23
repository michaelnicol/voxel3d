import { Point2D } from "../Points/Point2D.js";
import { Utilities } from "./Utilities.js";
export class BoundingBox2D {
    /**
     * X-Low, Y-Low
     */
    #BL;
    /**
     * X-High, Y-Low
     */
    #BR;
    /**
     * X-Low, Y-High
     */
    #UL;
    /**
     * X-High, Y-High
     */
    #UR;
    center;
    translation = new Point2D(0, 0);
    xRange;
    yRange;
    area;
    gap;
    constructor(UL, UR, BL, BR, gap) {
        this.#UL = UL.clone();
        this.#UR = UR.clone();
        this.#BL = BL.clone();
        this.#BR = BR.clone();
        this.gap = gap;
        this.cornersHaveChanged();
    }
    getUL() {
        let ul = this.#UL.clone();
        ul.arr[0] -= (this.gap);
        ul.arr[1] += (this.gap);
        ul.arr[0] += this.translation.arr[0];
        ul.arr[1] += this.translation.arr[1];
        return ul;
    }
    getUR() {
        let ur = this.#UR.clone();
        ur.arr[0] += (this.gap);
        ur.arr[1] += (this.gap);
        ur.arr[0] += this.translation.arr[0];
        ur.arr[1] += this.translation.arr[1];
        return ur;
    }
    getBL() {
        let bl = this.#BL.clone();
        bl.arr[0] -= (this.gap);
        bl.arr[1] -= (this.gap);
        bl.arr[0] += this.translation.arr[0];
        bl.arr[1] += this.translation.arr[1];
        return bl;
    }
    getBR() {
        let br = this.#BR.clone();
        br.arr[0] += (this.gap);
        br.arr[1] -= (this.gap);
        br.arr[0] += this.translation.arr[0];
        br.arr[1] += this.translation.arr[1];
        return br;
    }
    setUL(ul) {
        this.#UL = ul.clone();
    }
    setUR(ur) {
        this.#UR = ur.clone();
    }
    setBL(bl) {
        this.#BL = bl.clone();
    }
    setBR(br) {
        this.#BR = br.clone();
    }
    static createFromExtremes(points, gap) {
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
                maxY = y;
            }
            if (y < minY) {
                minY = y;
            }
        }
        return new BoundingBox2D(new Point2D(minX, maxY), new Point2D(maxX, maxY), new Point2D(minX, minY), new Point2D(maxX, minY), gap);
    }
    cornersHaveChanged() {
        // Center does not need to account for the gap
        this.center = Utilities.pointCenter([this.#BL, this.#BR, this.#UL, this.#UR]);
        this.xRange = Math.abs(this.getUR().arr[0] - this.getUL().arr[0]);
        this.yRange = Math.abs(this.getUL().arr[1] - this.getBL().arr[1]);
        this.area = Utilities.pythagorean(this.getUL(), this.getUR()) * Utilities.pythagorean(this.getBL(), this.getUL());
    }
    translateBoundingBox(translation) {
        this.translation = translation.clone();
    }
    toPrint() {
        return `[${this.getUL().toPrint()}, ${this.getUR().toPrint()}, ${this.getBL().toPrint()}, ${this.getBR().toPrint()}]`;
    }
    getCoordinateList() {
        return [this.getUL(), this.getUR(), this.getBL(), this.getBR()];
    }
    canDimensionsFit(box) {
        return (this.getUL().arr[0] + box.xRange <= this.getUR().arr[0]) && (this.getBL().arr[1] + box.yRange <= this.getUL().arr[1]);
    }
    clone() {
        return new BoundingBox2D(this.#UL, this.#UR, this.#BL, this.#BR, this.gap);
    }
    preHash() {
        return this.toPrint();
    }
}
