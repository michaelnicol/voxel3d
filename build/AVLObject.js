import { VoxelStorage } from "./VoxelStorage.js";
import { Point2D } from "./Point2D.js";
import { Utilities } from "./Utilities.js";
export class AVLObject {
    internalStorage;
    pointFactoryMethod;
    maxDimensions;
    constructor(maxDimensions, pointFactoryMethod) {
        this.maxDimensions = maxDimensions;
        this.pointFactoryMethod = pointFactoryMethod;
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
    static getSortedRange(internalStorage) {
        let rangeCoordinates = new Map();
        let points = internalStorage.getCoordinateList(false);
        let storageRange = internalStorage.dimensionRange;
        let longestRangeKeys = internalStorage.getSortedRangeIndices();
        let longestRangeKey = longestRangeKeys[0];
        // needs to be a sorted list. Maybe range should produce it.
        let longestRangeSize = 0;
        for (let i = storageRange.get(longestRangeKey)[0]; i <= storageRange.get(longestRangeKey)[2]; i++) {
            rangeCoordinates.set(i, []);
        }
        // Storage best case is O(0.66N) = O(N), worst case is still O(N)
        for (let coord of points) {
            const { arr } = coord;
            if (longestRangeKey === 0) {
                rangeCoordinates.get(arr[0]).push(new Point2D(arr[1], arr[2]));
            }
            else if (longestRangeKey === 1) {
                rangeCoordinates.get(arr[1]).push(new Point2D(arr[0], arr[2]));
            }
            else if (longestRangeKey === 2) {
                rangeCoordinates.get(arr[2]).push(new Point2D(arr[0], arr[1]));
            }
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
