import { BaseObject } from "./BaseObject.js";
import { Point } from "./Point.js";
import { VoxelStorage } from "./VoxelStorage.js";

export class BasicSetOperations {
   static AND(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {
      const points: Point[] = []
      const voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(a.getMaxDimensions(), a.voxelStorage.factoryMethod);
      if (a.getCoordinateCount() < b.getCoordinateCount()) {

      } else {

      }
   }
   static OR(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {

   }
   static XOR(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {

   }
   static NOT(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {

   }
   static NAND(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {

   }
   static XNOR(a: BaseObject, b: BaseObject, returnList: boolean): Point[] | VoxelStorage<Point> {

   }
}