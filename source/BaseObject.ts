import { Point } from "./Point.js";
import { HashStorage } from "./HashStorage.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorage } from "./VoxelStorage.js";

export interface BaseObject<E extends Point> extends ValidObject {
     voxelStorage: VoxelStorage<E> | HashStorage<E>;
     pointFactoryMethod: Function;
    setStorage(newStorage : VoxelStorage<E> | HashStorage<E>): void

    hasCoordinate(p: E): boolean

    getFactoryMethod(): Function 

    getMaxDimensions(): number 

    getCoordinateCount(): number 

    getCoordinateList(duplicates: boolean): E[]

    addCoordinates(coordinatesToAdd: E[], allowDuplicates: boolean): BaseObject<E>

    removeVoxels(coordinatesToRemove: E[]): void;
}