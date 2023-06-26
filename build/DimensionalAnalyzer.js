import { Utilities } from "./Utilities.js";
/**
 * The Pythagorean Map is designed to analyze the dimension ranges of an VoxelStorage and group stored coordinates. This grouping will compact and project the VoxelStorage tree down by one dimension.
 *
 * Projected coordinates are then sorted by it's distance from (0,0...) in the projected dimension.
 *
 * This data structure is not designed to be dynamic and does not update whenever the tree recieves or removes a coordinate.
 *
 * This analysis is used for Polygon rasterization
 *
 */
export class DimensionalAnalyzer {
    #tree;
    keyDimension = -1;
    storageMap = new Map();
    dimensionFactoryMethod;
    dimensionLowerFactoryMethod;
    isSorted = false;
    constructor(dimensionFactoryMethod, dimensionLowerFactoryMethod, tree) {
        this.dimensionLowerFactoryMethod = dimensionLowerFactoryMethod;
        this.dimensionFactoryMethod = dimensionFactoryMethod;
        this.#tree = tree;
    }
    generateStorageMap(keyDimension, useSort) {
        if (this.#tree.getCoordinateCount() > 0) {
            this.keyDimension = keyDimension;
            this.storageMap = new Map();
            let points = this.#tree.getCoordinateList(false, false);
            for (let point of points) {
                if (this.storageMap.get(point[this.keyDimension]) === undefined) {
                    this.storageMap.set(point[this.keyDimension], []);
                }
                this.storageMap.get(point[this.keyDimension]).push(this.dimensionLowerFactoryMethod(point.filter((v, i) => i != this.keyDimension)));
            }
            const referencePoint = this.dimensionLowerFactoryMethod(new Array(this.#tree.getMaxDimensions() - 1).fill(0));
            if (useSort) {
                this.storageMap.forEach((v) => v.sort((a, b) => Utilities.pythagorean(referencePoint, b) - Utilities.pythagorean(referencePoint, a)));
            }
            this.isSorted = useSort;
        }
        return this.storageMap;
    }
}
