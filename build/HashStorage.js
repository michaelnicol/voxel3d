import { HashStorageNode } from "./HashStorageNode.js";
export class HashStorage {
    hashMap = new Map;
    maxDimensions;
    pointFactoryMethod;
    coordinateCount = 0;
    constructor(maxDimensions, pointFactoryMethod) {
        if (maxDimensions < 1 || maxDimensions === undefined) {
            throw new Error("Invalid Depth: Can not be less than 1 or undefined: " + maxDimensions);
        }
        this.maxDimensions = maxDimensions;
        this.pointFactoryMethod = pointFactoryMethod;
    }
    reset() {
        this.hashMap = new Map;
        this.coordinateCount = 0;
    }
    removeCoordinate(p) {
        if (!this.hasCoordinate(p)) {
            return;
        }
        this.coordinateCount -= 1;
        var workingMap = this.hashMap;
        for (let i = 0; i < p.arr.length; i++) {
            let j = p.arr[i];
            let workingNode = workingMap.get(j);
            workingNode.decreaseAmount();
            if (workingNode.getAmount() === 0) {
                workingNode.getHashMap().delete(j);
                return;
            }
            workingMap = workingNode.getHashMap();
        }
    }
    hasCoordinate(p) {
        var workingMap = this.hashMap;
        for (let i = 0; i < p.arr.length; i++) {
            let j = p.arr[i];
            if (workingMap.has(j)) {
                workingMap = workingMap.get(j).getHashMap();
            }
            else {
                return false;
            }
        }
        return true;
    }
    addCoordinate(p, allowDuplicates) {
        if (this.hasCoordinate(p) && !allowDuplicates) {
            return;
        }
        if (!this.hasCoordinate(p)) {
            this.coordinateCount += 1;
        }
        var workingMap = this.hashMap;
        for (let i = 0; i < p.arr.length; i++) {
            if (workingMap.has(p.arr[i])) {
                let targetNode = this.hashMap.get(p.arr[i]);
                targetNode.increaseAmount();
                workingMap = targetNode.getHashMap();
            }
            else {
                workingMap = workingMap.set(p.arr[i], new HashStorageNode(p.arr[i]));
                workingMap = workingMap.get(p.arr[i]).getHashMap();
            }
        }
    }
    #getCoordinateListRecursiveCall(currentNode, currentCoordinate, coordinateList, depth, duplicates) {
        currentCoordinate.push(currentNode.getValue());
        if (depth === this.maxDimensions) {
            if (duplicates) {
                for (let i = 0; i < currentNode.amount; i++) {
                    coordinateList.push(this.pointFactoryMethod(currentCoordinate));
                }
            }
            else {
                coordinateList.push(this.pointFactoryMethod(currentCoordinate));
            }
        }
        else {
            for (let [key, value] of currentNode.getHashMap()) {
                this.#getCoordinateListRecursiveCall(value, currentCoordinate, coordinateList, ++depth, duplicates);
            }
        }
    }
    getCoordinateList(allowDuplicates) {
        let coordinateList = [];
        for (let [key, value] of this.hashMap) {
            this.#getCoordinateListRecursiveCall(value, [], coordinateList, 1, allowDuplicates);
        }
        return coordinateList;
    }
    preHash() {
        return this;
    }
    toPrint() {
        return "" + this.getCoordinateList(true);
    }
    getCoordinateCount() {
        return this.coordinateCount;
    }
}
