export class PointStorageManager {
    maxDimensions = 0;
    isUsingTreeStorage = false;
    treeStorage;
    hashStorage;
    cutOff = 5000000;
    constructor(cutOff) {
        this.cutOff = cutOff;
    }
    toPrint() {
        if (this.isUsingTreeStorage) {
            return JSON.stringify(this.treeStorage.getCoordinates(true, false));
        }
        else {
            return JSON.stringify(this.hashStorage.getCoordinates(true, false));
        }
    }
    preHash() {
        return this;
    }
}
