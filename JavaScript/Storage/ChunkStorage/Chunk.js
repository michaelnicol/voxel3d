import { HashStorage } from "../HashStorage/HashStorage.js";
import { TreeStorage } from "../TreeStorage/TreeStorage.js";
export class Chunk {
    arr = [];
    storage;
    type = 0;
    /**
     *
     * @param dimensionCount The amount of dimensions of this chunk
     * @param center The center of this chunk
     */
    constructor(dimensionCount, center, type) {
        this.type = type;
        if (type === 0) {
            this.storage = new HashStorage(dimensionCount);
        }
        else if (type === 1) {
            this.storage = new TreeStorage(dimensionCount);
        }
        this.arr = [...center];
    }
    clone() {
        let storage = new Chunk(this.dimensionCount(), this.arr, this.type);
        storage.storage = this.storage.clone();
        return storage;
    }
    factoryMethod(dimensionValues) {
        return new Chunk(0, [], this.type);
    }
    dimensionCount() {
        return this.arr.length;
    }
    toPrint() {
        return JSON.stringify(this.storage.getCoordinates(true, false));
    }
    preHash() {
        return JSON.stringify(this.storage.getCoordinates(true, false));
    }
}
