import { VoxelStorage } from "./VoxelStorage.js";
import { Utilities } from "./Utilities.js";
export class AVLObject {
    internalStorage;
    pointFactoryMethod;
    dimensionLowerFactoryMethod;
    maxDimensions;
    constructor(maxDimensions, pointFactoryMethod, dimensionLowerFactoryMethod) {
        this.maxDimensions = maxDimensions;
        this.pointFactoryMethod = pointFactoryMethod;
        this.dimensionLowerFactoryMethod = dimensionLowerFactoryMethod;
        this.internalStorage = new VoxelStorage(maxDimensions, pointFactoryMethod);
    }
    setStorage(newStorage) {
        this.internalStorage = newStorage;
    }
    hasCoordinate(p) {
        return this.internalStorage.hasCoordinate(p);
    }
    getFactoryMethod() {
        return this.pointFactoryMethod;
    }
    getMaxDimensions() {
        return this.maxDimensions;
    }
    getCoordinateCount() {
        return this.internalStorage.getCoordinateCount();
    }
    getCoordinateList(duplicates) {
        return this.internalStorage.getCoordinateList(duplicates);
    }
    addCoordinates(coordinatesToAdd, allowDuplicates) {
        for (let c of coordinatesToAdd) {
            this.internalStorage.addCoordinate(c, allowDuplicates);
        }
        return this;
    }
    removeVoxels(coordinatesToRemove) {
        let removeRanges = [];
        for (let c of coordinatesToRemove) {
            removeRanges.push(...this.internalStorage.removeCoordinate(c, false));
        }
        this.internalStorage.findRangeInclusive(removeRanges, this.internalStorage.dimensionRange);
        return this;
    }
    getSortedRange(targetDimension) {
        let rangeCoordinates = new Map();
        let points = this.internalStorage.getCoordinateList(false);
        let storageRange = this.internalStorage.dimensionRange;
        let longestRangeKeys = this.internalStorage.getSortedRangeIndices();
        let longestRangeKey = longestRangeKeys[targetDimension];
        // needs to be a sorted list. Maybe range should produce it.
        for (let i = storageRange.get(longestRangeKey)[0]; i <= storageRange.get(longestRangeKey)[2]; i++) {
            rangeCoordinates.set(i, []);
        }
        // Storage best case is O(0.5N) = O(N), worst case is still O(N)
        for (let coord of points) {
            rangeCoordinates.get(coord.arr[longestRangeKey]).push(this.dimensionLowerFactoryMethod([...coord.arr].filter((v, i) => i != longestRangeKey)));
        }
        for (let [key, value] of rangeCoordinates) {
            value.sort((a, b) => Utilities.pythagorean(a, b));
        }
        return [rangeCoordinates, longestRangeKeys];
    }
    getRanges() {
        let mapToReturn = new Map();
        for (let [key, value] of this.internalStorage.dimensionRange) {
            mapToReturn.set(key, [...value]);
        }
        return mapToReturn;
    }
    preHash() {
        return this;
    }
    toPrint() {
        let list = this.internalStorage.getCoordinateList(true);
        let str = "[";
        for (let i = 0; i < list.length; i++) {
            str += list[i].toPrint();
            if (i + 1 != list.length) {
                str += ",";
            }
        }
        return str + "]";
    }
}
