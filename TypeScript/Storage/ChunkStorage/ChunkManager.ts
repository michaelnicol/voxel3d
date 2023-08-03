import { Chunk } from "./Chunk.js";
import { HashStorage } from "../HashStorage/HashStorage.js";
import { Point } from "../../Point.js";
import { PointFactoryMethods } from "../../PointFactoryMethods.js";
import { PointStorage } from "../PointStorage.js";
import { TreeStorage } from "../TreeStorage/TreeStorage.js";
import { ValidObject } from "../../ValidObject.js";
import { cloneable } from "../../cloneable.js";

export class ChunkManager<E extends Point, S extends PointStorage<E>> implements ValidObject, cloneable<ChunkManager<E, S>> {
    chunks!: TreeStorage<Chunk<E,S>>
    dimensionCount: number = 0;
    allCoordinateCount: number = 0;
    uniqueCoordinateCount: number = 0;
    factoryMethod!: Function;
    chunkSize!: E
    type: number = 0
    constructor(dimensionCount: number, chunkSize: E, type: number) {
        this.type = type;
        this.dimensionCount = dimensionCount
        this.chunkSize = chunkSize;
        this.chunks = new TreeStorage<Chunk<E,S>>(this.dimensionCount)
        this.factoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount)
    }
    addCoordinate(coordinate: E, allowDuplicates: boolean): void {
        let chunkKey = [] as number[]
        const { arr } = coordinate
        for (let i = 0; i < arr.length; i++) {
            chunkKey.push(Math.floor(arr[i] / this.chunkSize.arr[i]))
        }
        let chunkCoordinate = this.factoryMethod(this.dimensionCount)
        if (this.chunks.hasCoordinate(chunkCoordinate)) {
            this.allCoordinateCount += 1;
            const userChunk: Chunk<E, S> = this.chunks.getCoordinate(chunkCoordinate) as Chunk<E, S>
            userChunk.storage.addCoordinate(coordinate, allowDuplicates)
        } else {
            this.allCoordinateCount += 1;
            this.uniqueCoordinateCount += 1;
            const userChunk: Chunk<E, S> = new Chunk<E, S>(this.dimensionCount, PointFactoryMethods.getFactoryMethod(this.dimensionCount)(chunkKey), this.type)
            this.chunks.set(chunkCoordinate, userChunk)
            userChunk.storage.addCoordinate(coordinate, allowDuplicates)
        }
    }
    addCoordinates(coordinates: E[], allowDuplicates: boolean): void {
        for (let coord of coordinates) {
            this.addCoordinate(coord, allowDuplicates)
        }
    }
    toPrint(): string {
        let str = ""
        for (let [key, value] of this.chunks) {
            let coords = value.storage.getCoordinates(true, true);
            for (let i = 0; i < coords.length; i++) {
                if (i !== 0 || str.endsWith("]")) {
                    str += ","
                }
                str += (coords[i] as E).toPrint()
            }
        }
        return "[" + str + "]"
    }
    preHash() {
        return this.toPrint()
    }
    clone(): ChunkManager<E, S> {
        let newManager = new ChunkManager<E, S>(this.dimensionCount, this.chunkSize, this.type)
        for (let [key, value] of this.chunks) {
            for (let coord of value.storage.getCoordinates(true, true)) {
                newManager.addCoordinate(coord as E, true)
            }
        }
        return newManager
    }
}