import { Chunk } from "./Chunk.js";
import { PointFactoryMethods } from "../../PointFactoryMethods.js";
import { TreeStorage } from "../TreeStorage/TreeStorage.js";
export class ChunkManager {
    chunks;
    dimensionCount = 0;
    allCoordinateCount = 0;
    uniqueCoordinateCount = 0;
    factoryMethod;
    chunkSize;
    type = 0;
    constructor(dimensionCount, chunkSize, type) {
        this.type = type;
        this.dimensionCount = dimensionCount;
        this.chunkSize = chunkSize;
        this.chunks = new TreeStorage(this.dimensionCount);
        this.factoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount);
    }
    addCoordinate(coordinate, allowDuplicates) {
        let chunkKey = [];
        const { arr } = coordinate;
        for (let i = 0; i < arr.length; i++) {
            chunkKey.push(Math.floor(arr[i] / this.chunkSize.arr[i]));
        }
        let chunkCoordinate = this.factoryMethod(this.dimensionCount);
        if (this.chunks.hasCoordinate(chunkCoordinate)) {
            this.allCoordinateCount += 1;
            const userChunk = this.chunks.getCoordinate(chunkCoordinate);
            userChunk.storage.addCoordinate(coordinate, allowDuplicates);
        }
        else {
            this.allCoordinateCount += 1;
            this.uniqueCoordinateCount += 1;
            const userChunk = new Chunk(this.dimensionCount, PointFactoryMethods.getFactoryMethod(this.dimensionCount)(chunkKey), this.type);
            this.chunks.set(chunkCoordinate, userChunk);
            userChunk.storage.addCoordinate(coordinate, allowDuplicates);
        }
    }
    addCoordinates(coordinates, allowDuplicates) {
        for (let coord of coordinates) {
            this.addCoordinate(coord, allowDuplicates);
        }
    }
    toPrint() {
        let str = "";
        for (let [key, value] of this.chunks) {
            let coords = value.storage.getCoordinates(true, true);
            for (let i = 0; i < coords.length; i++) {
                if (i !== 0 || str.endsWith("]")) {
                    str += ",";
                }
                str += coords[i].toPrint();
            }
        }
        return "[" + str + "]";
    }
    preHash() {
        return this.toPrint();
    }
    clone() {
        let newManager = new ChunkManager(this.dimensionCount, this.chunkSize, this.type);
        for (let [key, value] of this.chunks) {
            for (let coord of value.storage.getCoordinates(true, true)) {
                newManager.addCoordinate(coord, true);
            }
        }
        return newManager;
    }
}
