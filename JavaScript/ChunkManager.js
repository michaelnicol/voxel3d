import { Chunk } from "./Chunk.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
export class ChunkManager {
    chunks = new Map();
    dimensionCount = 0;
    allCoordinateCount = 0;
    uniqueCoordinateCount = 0;
    chunkSize;
    constructor(dimensionCount, chunkSize) {
        this.dimensionCount = dimensionCount;
        this.chunkSize = chunkSize;
    }
    addCoordinate(coordinate, allowDuplicates) {
        let chunkKey = [];
        const { arr } = coordinate;
        for (let i = 0; i < arr.length; i++) {
            chunkKey.push(Math.floor(arr[i] / this.chunkSize.arr[i]));
        }
        const chunkKeyString = JSON.stringify(chunkKey);
        if (this.chunks.has(chunkKeyString)) {
            this.allCoordinateCount += 1;
            const userChunk = this.chunks.get(chunkKeyString);
            userChunk.hashStorage.addCoordinate(coordinate, allowDuplicates);
        }
        else {
            this.allCoordinateCount += 1;
            this.uniqueCoordinateCount += 1;
            const userChunk = new Chunk(this.dimensionCount, PointFactoryMethods.getFactoryMethod(this.dimensionCount)(chunkKey));
            this.chunks.set(chunkKeyString, userChunk);
            userChunk.hashStorage.addCoordinate(coordinate, allowDuplicates);
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
            let coords = value.hashStorage.getCoordinates(true, true);
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
        let newManager = new ChunkManager(this.dimensionCount, this.chunkSize);
        for (let [key, value] of this.chunks) {
            for (let coord of value.hashStorage.getCoordinates(true, true)) {
                newManager.addCoordinate(coord, true);
            }
        }
        return newManager;
    }
}
