import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorage } from "./VoxelStorage.js";

class BaseObject<E extends Point> implements ValidObject {
   voxelStorage!: VoxelStorage<E>;
   constructor(dimensionCount: number) {
      this.voxelStorage = new VoxelStorage<E>(dimensionCount)
   }
   preHash() {
       return this;
   }
   toPrint(): string {
       return JSON.stringify(this.voxelStorage.getCoordinateList());
   }
}