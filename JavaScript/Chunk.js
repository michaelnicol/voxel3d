import { HashStorage } from "./HashStorage.js";
export class Chunk {
    center;
    hashStorage;
    dimensionCount = 0;
    /**
     *
     * @param dimensionCount The amount of dimensions of this chunk
     * @param center The center of this chunk
     */
    constructor(dimensionCount, center) {
        this.dimensionCount = dimensionCount;
        this.hashStorage = new HashStorage(dimensionCount);
        this.center = center.clone();
    }
    clone() {
        let storage = new Chunk(this.dimensionCount, this.center.clone());
        storage.hashStorage = this.hashStorage.clone();
        return storage;
    }
    toPrint() {
        return JSON.stringify(this.hashStorage.getCoordinates(true, false));
    }
    preHash() {
        return JSON.stringify(this.hashStorage.getCoordinates(true, false));
    }
}
