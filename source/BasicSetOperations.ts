import { HashObject } from "./HashObject.js";
import { ValidObject } from "./ValidObject.js";
import { Point } from "./Point.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { AVLObject } from "./AVLObject.js";
import { BaseObject } from "./BaseObject.js";

export class BasicSetOperations {
   constructor() {throw new Error("Can not extend or instance this class")}
   static INTERSECTION(objs: BaseObject<Point>[], returnList: boolean): Point[] | VoxelStorage<Point> {
      const points: Point[] = []
      const voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(objs[0].getMaxDimensions(), objs[0].getFactoryMethod());
      let smallestObject: BaseObject<Point> = objs[0];
      let smallestObjectIndex = 0;
      for (let i = 0; i < objs.length; i++) {
         let o: BaseObject<Point> = objs[i]
         if (o.getCoordinateCount() < smallestObject.getCoordinateCount()) {
            smallestObject = o;
            smallestObjectIndex = i;
         }
      }
      let coordinates: Point[] = smallestObject.getCoordinateList(false);
      coordinateLoop: for (let coord of coordinates) {
         for (let i = 0; i < objs.length; i++) {
            if (i != smallestObjectIndex && !objs[i].hasCoordinate(coord)) {
               continue coordinateLoop;
            }
         }
         if (returnList) {
            points.push(coord)
         } else {
            voxelStorage.addCoordinate(coord, false)
         }
      }
      if (returnList) {
         return points;
      }
      return voxelStorage;
   }
   static UNION(objs: BaseObject<Point>[], returnList: boolean): Point[] | VoxelStorage<Point> {
      const points: Point[] = []
      const voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(objs[0].getMaxDimensions(), objs[0].getFactoryMethod());
      let smallestObject: BaseObject<Point> = objs[0];
      let smallestObjectIndex = 0;
      for (let i = 0; i < objs.length; i++) {
         let o: BaseObject<Point> = objs[i]
         if (o.getCoordinateCount() < smallestObject.getCoordinateCount()) {
            smallestObject = o;
            smallestObjectIndex = i;
         }
      }

      for (let o of objs) {
         let coordinates = o.getCoordinateList(false);
         for (let coord of coordinates) {
            voxelStorage.addCoordinate(coord, false)
         }
      }
      return returnList ? voxelStorage.getCoordinateList(false) : voxelStorage;
   }
   /**
    * Computes A - B
    * 
    * @param a Set A
    * @param b Set B
    * @param returnList 
    * @returns 
    */
   static SUBTRACTION(a: BaseObject<Point>, b: BaseObject<Point>, returnList: boolean): Point[] | VoxelStorage<Point> {
      if (a.getMaxDimensions() != b.getMaxDimensions()) {
         throw new Error("Can not subtract varying dimensions")
      }
      const points: Point[] = []
      const voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(a.getMaxDimensions(), a.getFactoryMethod());
      const coordinates: Point[] = b.getCoordinateList(false);
      for (let coord of coordinates) {
         if (!a.hasCoordinate(coord)) {
            if (returnList) {
               points.push(coord)
            } else {
               voxelStorage.addCoordinate(coord, false)
            }
         }
      }
      if (returnList) {
         return points;
      } else {
         return voxelStorage;
      }
   }
   static COMPLIMENT(a: BaseObject<Point>, universalSet: BaseObject<Point>[], returnList: boolean): Point[] | VoxelStorage<Point> {
      const points: Point[] = []
      const voxelStorage: VoxelStorage<Point> = new VoxelStorage<Point>(a.getMaxDimensions(), a.getFactoryMethod());
      for (let o of universalSet) {
         if (o != a) {
            let currentCoordinates: Point[] = o.getCoordinateList(false);
            for (let coord of currentCoordinates) {
               if (!a.hasCoordinate(coord)) {
                  if (returnList) {
                     points.push(coord)
                  } else { 
                     voxelStorage.addCoordinate(coord, false); 
                  }
               }
            }
         }
      }
      if (returnList) {
         return points;
      }
      return voxelStorage;
   }
}