import { PointFactoryMethods } from "./PointFactoryMethods.js";
/**
 * The DimensionalAnalyzer Map is designed to analyze the dimension ranges of an TreeStorage and group stored coordinates. This grouping will compact and project the TreeStorage tree down by one dimension.
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
    constructor(tree) {
        this.dimensionLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.dimensionCount - 1);
        this.dimensionFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.dimensionCount);
        this.#tree = tree;
    }
    generateStorageMap(keyDimension) {
        if (this.#tree.allCoordinateCount > 0) {
            this.keyDimension = keyDimension;
            this.storageMap = new Map();
            let points = this.#tree.getCoordinates(false, false);
            for (let point of points) {
                if (this.storageMap.get(point[this.keyDimension]) === undefined) {
                    this.storageMap.set(point[this.keyDimension], []);
                }
                this.storageMap.get(point[this.keyDimension]).push(this.dimensionLowerFactoryMethod(point.filter((v, i) => i != this.keyDimension)));
            }
        }
        return this.storageMap;
    }
}
