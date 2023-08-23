import { HashStorageNode } from "./HashStorageNode.js";
import { PointFactoryMethods } from "../../Points/PointFactoryMethods.js";
export class HashStorage {
    hashMap = new Map;
    uniqueCoordinateCount = 0;
    allCoordinateCount = 0;
    dimensionCount;
    dimensionalRanges = new Map();
    outdatedDimensionRanges = new Map();
    pointFactoryMethod;
    constructor(dimensionCount) {
        if (dimensionCount < 1) {
            throw new Error("Invalid Depth: Can not be less than 1: " + dimensionCount);
        }
        this.dimensionCount = dimensionCount;
        for (let i = 0; i < this.dimensionCount; i++) {
            this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            this.outdatedDimensionRanges.set(i, false);
        }
        this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount);
    }
    reset() {
        this.hashMap = new Map;
        this.uniqueCoordinateCount = 0;
        this.allCoordinateCount = 0;
        this.outdatedDimensionRanges = new Map();
        this.dimensionalRanges = new Map();
        return this;
    }
    #findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, currentDepth, currentNode) {
        if (useInclusive && inclusiveRange.indexOf(currentDepth) === -1) {
            for (let [key, value] of currentNode.hashMap) {
                this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, currentDepth + 1, value);
            }
        }
        else {
            for (let [key, value] of currentNode.hashMap) {
                const coordinateValue = value.getValue();
                const workingRange = this.dimensionalRanges.get(currentDepth);
                if (coordinateValue < workingRange[0]) {
                    workingRange[0] = coordinateValue;
                    workingRange[1] = value.getAmount();
                }
                else if (coordinateValue > workingRange[2]) {
                    workingRange[2] = coordinateValue;
                    workingRange[3] = value.getAmount();
                }
                else if (coordinateValue === workingRange[0]) {
                    workingRange[1] += value.getAmount();
                }
                else if (coordinateValue === workingRange[3]) {
                    workingRange[3] += value.getAmount();
                }
                this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, currentDepth + 1, value);
            }
        }
    }
    #findRange(inclusiveRange, maxDimensions, useInclusive) {
        if (useInclusive) {
            for (let i = 0; i < inclusiveRange.length; i++) {
                this.dimensionalRanges.set(inclusiveRange[i], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            }
        }
        else {
            for (let i = 0; i < maxDimensions; i++) {
                this.dimensionalRanges.set(inclusiveRange[i], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
            }
        }
        let rootNode = new HashStorageNode(-1);
        rootNode.hashMap = this.hashMap;
        this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, 0, rootNode);
    }
    findRangeInclusive(inclusiveRange) {
        this.#findRange(inclusiveRange, -1, true);
        return this.dimensionalRanges;
    }
    findRangeExclusive(maxDimensions) {
        this.#findRange([], maxDimensions, false);
        return this.dimensionalRanges;
    }
    removeCoordinates(coordinates, calculateRange) {
        let rangesToCalculate = [];
        for (let coordinate of coordinates) {
            let result = this.removeCoordinate(coordinate, false);
            for (let x of result) {
                if (rangesToCalculate.indexOf(x) === -1) {
                    rangesToCalculate.push(x);
                }
            }
        }
        if (calculateRange) {
            this.findRangeInclusive(rangesToCalculate);
        }
        return rangesToCalculate;
    }
    removeCoordinate(coordinate, calculateRange) {
        const { arr } = coordinate;
        let hasCoordinate = this.hasCoordinate(coordinate);
        if (!hasCoordinate[0]) {
            return [];
        }
        if (hasCoordinate[1] === 1) {
            this.uniqueCoordinateCount -= 1;
            this.allCoordinateCount -= 1;
        }
        else {
            this.allCoordinateCount -= 1;
        }
        var workingMap = this.hashMap;
        let rangesToCalculate = [];
        for (let i = 0; i < arr.length; i++) {
            let workingRange = this.dimensionalRanges.get(i);
            if (arr[i] === workingRange[0]) {
                workingRange[1] -= 1;
            }
            if (arr[i] === workingRange[2]) {
                workingRange[3] -= 1;
            }
            if (workingRange[1] === 0 || workingRange[3] === 0) {
                this.outdatedDimensionRanges.set(i, true);
                rangesToCalculate.push(i);
            }
            let workingNode = workingMap.get(arr[i]);
            workingNode.decreaseAmount();
            if (workingNode.getAmount() === 0) {
                workingNode.getHashMap().delete(arr[i]);
                if (calculateRange) {
                    this.findRangeInclusive(rangesToCalculate);
                }
                return rangesToCalculate;
            }
            workingMap = workingNode.getHashMap();
        }
        return [];
    }
    hasCoordinate(p) {
        var workingMap = this.hashMap;
        var amount = 0;
        for (let i = 0; i < p.arr.length; i++) {
            let j = p.arr[i];
            if (workingMap.has(j)) {
                amount = workingMap.get(j).getAmount();
                workingMap = workingMap.get(j).getHashMap();
            }
            else {
                return [false, 0];
            }
        }
        return [true, amount];
    }
    addCoordinates(coordinates, allowDuplicates) {
        for (let point of coordinates) {
            this.addCoordinate(point, allowDuplicates);
        }
    }
    addCoordinate(p, allowDuplicates) {
        if (this.hasCoordinate(p)[0] && !allowDuplicates) {
            return;
        }
        if (!this.hasCoordinate(p)[0]) {
            this.uniqueCoordinateCount += 1;
            this.allCoordinateCount += 1;
        }
        else {
            this.allCoordinateCount += 1;
        }
        var workingMap = this.hashMap;
        const { arr } = p;
        for (let i = 0; i < arr.length; i++) {
            const range = this.dimensionalRanges.get(i);
            // Calculates the range as each dimension is traversed to prevent needing to call findRange
            if (arr[i] < range[0]) {
                range[0] = arr[i];
                range[1] = 1;
            }
            else if (arr[i] === range[0]) {
                range[1] += 1;
            }
            if (arr[i] > range[2]) {
                range[2] = arr[i];
                range[3] = 1;
            }
            else if (arr[i] === range[2]) {
                range[3] += 1;
            }
            if (workingMap.has(arr[i])) {
                let targetNode = workingMap.get(arr[i]);
                targetNode.increaseAmount();
                workingMap = targetNode.getHashMap();
            }
            else {
                workingMap = workingMap.set(arr[i], new HashStorageNode(arr[i]));
                workingMap = workingMap.get(arr[i]).getHashMap();
            }
        }
    }
    #getCoordinatesListRecursiveCall(currentNode, currentCoordinate, coordinateList, depth, duplicates, instances) {
        currentCoordinate.push(currentNode.getValue());
        if (depth === this.dimensionCount) {
            for (let i = 0; i < currentNode.amount; i++) {
                if (instances) {
                    coordinateList.push(this.pointFactoryMethod(currentCoordinate));
                }
                else {
                    coordinateList.push([...currentCoordinate]);
                }
                if (!duplicates) {
                    break;
                }
            }
        }
        else {
            for (let [key, value] of currentNode.getHashMap()) {
                this.#getCoordinatesListRecursiveCall(value, [...currentCoordinate], coordinateList, depth + 1, duplicates, instances);
            }
        }
    }
    getSortedRange() {
        // Each element is a [dimensionNumber, dimensionSpan]
        let list = [];
        // For each range in the hashmap
        for (let [key, value] of this.dimensionalRanges) {
            // Calculate the span of that dimension. Difference between min and max. 
            let r = Math.abs(value[0] - value[2]);
            // Add the [dimensionNumber: span] to the list.
            list.push([key, r]);
        }
        // Sort from highest to lowest dimension.
        list.sort((a, b) => b[1] - a[1]);
        // Then return that.
        return list;
    }
    correctOutdatedRanges() {
        let ranges = [];
        for (let [key, value] of this.outdatedDimensionRanges) {
            if (value) {
                ranges.push(key);
            }
        }
        return this.findRangeInclusive(ranges);
    }
    hasOutdatedRanges() {
        for (let [key, value] of this.outdatedDimensionRanges) {
            if (value) {
                return true;
            }
        }
        return false;
    }
    clone() {
        const newStorage = new HashStorage(this.dimensionCount);
        const coordinates = this.getCoordinates(true, true);
        coordinates.forEach(value => newStorage.addCoordinate(value.clone(), true));
        return newStorage;
    }
    getCoordinates(allowDuplicates, instances) {
        let coordinateList = [];
        for (let [key, value] of this.hashMap) {
            this.#getCoordinatesListRecursiveCall(value, [], coordinateList, 1, allowDuplicates, instances);
        }
        return coordinateList;
    }
    preHash() {
        return this;
    }
    toPrint() {
        return JSON.stringify(this.getCoordinates(true, false));
    }
}
