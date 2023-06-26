import { AVLObject } from "./AVLObject.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";
import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js";
/**
 * E is the dimension of the polygon, K is the one less.
 */
export class AVLPolygon extends AVLObject {
    vertices = [];
    #storageMap;
    constructor(v) {
        super(3, new Point3D(0, 0, 0).factoryMethod, new Point2D(0, 0).factoryMethod);
        for (let coord of v) {
            this.vertices.push(coord.clone());
            this.internalStorage.addCoordinate(coord, false);
        }
        this.#storageMap = new DimensionalAnalyzer(this.pointFactoryMethod, this.dimensionLowerFactoryMethod, this.internalStorage);
    }
    createEdges() {
        this.internalStorage.reset();
        for (let i = 0; i < this.vertices.length; i++) {
            if (i + 1 === this.vertices.length) {
                this.internalStorage, this.addCoordinates(Utilities.bresenham(this.vertices[i], this.vertices[0], 0), false);
            }
            else {
                this.internalStorage, this.addCoordinates(Utilities.bresenham(this.vertices[i], this.vertices[i + 1], 0), false);
            }
        }
        return this;
    }
    #convertDimensionHigher(p, insertionIndex, insertionValue) {
        let x = [...p.arr];
        x.splice(insertionIndex, 0, insertionValue);
        return this.pointFactoryMethod(x);
    }
    fillPolygon(passes, useSort) {
        if (passes > this.maxDimensions) {
            throw new Error("Passes is greater than max dimensions");
        }
        this.internalStorage.findRangeOutdatedRanges();
        let sortedSpans = this.internalStorage.getSortedRangeIndices();
        for (let i = 0; i < passes; i++) {
            this.#storageMap.generateStorageMap(sortedSpans[i][0], useSort);
            this.#storageMap.storageMap.forEach((value, key) => {
                if (useSort) {
                    let startingValue = this.#convertDimensionHigher(value[0], this.#storageMap.keyDimension, key);
                    let endingValue = this.#convertDimensionHigher(value[value.length - 1], this.#storageMap.keyDimension, key);
                    this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0), false);
                }
                else {
                    for (let j = 0; j < value.length - 1; j++) {
                        let startingValue = this.#convertDimensionHigher(value[j], this.#storageMap.keyDimension, key);
                        let endingValue = this.#convertDimensionHigher(value[j + 1], this.#storageMap.keyDimension, key);
                        this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0), false);
                    }
                }
            });
        }
        return this;
    }
}
