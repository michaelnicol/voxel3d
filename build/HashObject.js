import { HashStorage } from "./HashStorage.js";
export class HashObject {
    internalStorage;
    pointFactoryMethod;
    maxDimensions;
    constructor(maxDimensions, pointFactoryMethod) {
        this.maxDimensions = maxDimensions;
        this.pointFactoryMethod = pointFactoryMethod;
        this.internalStorage = new HashStorage(maxDimensions, pointFactoryMethod);
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
        for (let c of coordinatesToRemove) {
            this.internalStorage.removeCoordinate(c);
        }
        return this;
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
