import { VoxelStorage } from "./VoxelStorage.js";
class BaseObject {
    voxelStorage;
    constructor(dimensionCount) {
        this.voxelStorage = new VoxelStorage(dimensionCount);
    }
    preHash() {
        return this;
    }
    toPrint() {
        return JSON.stringify(this.voxelStorage.getCoordinateList());
    }
}
