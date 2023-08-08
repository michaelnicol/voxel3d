// import { HashStorage } from "../HashStorage/HashStorage.js";
// import { Point } from "../../Point.js";
// import { Point3D } from "../../Point3D.js";
// import { PointStorage } from "../PointStorage.js";
// import { TreeStorage } from "../TreeStorage/TreeStorage.js";
// import { ValidObject } from "../../ValidObject.js";
// import { cloneable } from "../../cloneable.js";

// export class Chunk<E extends Point, S extends PointStorage<E>> implements Point, ValidObject, cloneable<Chunk<E, S>> {
//     arr: number[] = []
//     storage!: PointStorage<E>
//     type: number = 0
//     /**
//      * 
//      * @param dimensionCount The amount of dimensions of this chunk
//      * @param center The center of this chunk
//      */
//     constructor(dimensionCount: number, center: number[], type: number) {
//         this.type = type;
//         if (type === 0) {
//             this.storage = new HashStorage<E>(dimensionCount)
//         } else if (type === 1) {
//             this.storage = new TreeStorage<E>(dimensionCount)
//         }
//         this.arr = [...center]
//     }
//     clone(): Chunk<E, S> {
//         let storage = new Chunk<E, S>(this.dimensionCount(), this.arr, this.type)
//         storage.storage = this.storage.clone()
//         return storage
//     }
//     factoryMethod(dimensionValues: number[]): Point {
//         return new Chunk(0, [], this.type)
//     }
//     dimensionCount(): number {
//         return this.arr.length
//     }
//     toPrint() {
//         return JSON.stringify(this.storage.getCoordinates(true, false))
//     }
//     preHash() {
//         return JSON.stringify(this.storage.getCoordinates(true, false))
//     }
// }