// import { HashObject } from "./HashObject.js";
// import { ValidObject } from "./ValidObject.js";
// import { Point } from "./Point.js";
// import { TreeStorage } from "./TreeStorage.js";
// import { AVLObject } from "./AVLObject.js";
// import { BaseObject } from "./PointStorageManager.js";
export {};
// export class BasicSetOperations {
//    constructor() {throw new Error("Can not extend or instance this class")}
//    static INTERSECTION(objs: BaseObject<Point>[], returnList: boolean): Point[] | TreeStorage<Point> {
//       const points: Point[] = []
//       const treeStorage: TreeStorage<Point> = new TreeStorage<Point>(objs[0].getMaxDimensions());
//       let smallestObject: BaseObject<Point> = objs[0];
//       let smallestObjectIndex = 0;
//       for (let i = 0; i < objs.length; i++) {
//          let o: BaseObject<Point> = objs[i]
//          if (o.getCoordinateCount() < smallestObject.getCoordinateCount()) {
//             smallestObject = o;
//             smallestObjectIndex = i;
//          }
//       }
//       let coordinates: Point[] = smallestObject.getCoordinateList(false, false) as Point[];
//       coordinateLoop: for (let coord of coordinates) {
//          for (let i = 0; i < objs.length; i++) {
//             if (i != smallestObjectIndex && !objs[i].hasCoordinate(coord)) {
//                continue coordinateLoop;
//             }
//          }
//          if (returnList) {
//             points.push(coord)
//          } else {
//             treeStorage.addCoordinate(coord, false)
//          }
//       }
//       if (returnList) {
//          return points;
//       }
//       return treeStorage;
//    }
//    static UNION(objs: BaseObject<Point>[], returnList: boolean): Point[] | TreeStorage<Point> {
//       const points: Point[] = []
//       const treeStorage: TreeStorage<Point> = new TreeStorage<Point>(objs[0].internalStorage.dimensionCount);
//       let smallestObject: BaseObject<Point> = objs[0];
//       let smallestObjectIndex = 0;
//       for (let i = 0; i < objs.length; i++) {
//          let o: BaseObject<Point> = objs[i]
//          if (o.internalStorage.uniqueCoordinateCount < smallestObject.internalStorage.uniqueCoordinateCount) {
//             smallestObject = o;
//             smallestObjectIndex = i;
//          }
//       }
//       for (let o of objs) {
//          let coordinates = o.internalStorage.getCoordinates(false, false) as Point[];
//          for (let coord of coordinates) {
//             treeStorage.addCoordinate(coord, false)
//          }
//       }
//       return returnList ? (treeStorage.getCoordinates(false, false) as Point[]) : treeStorage;
//    }
//    /**
//     * Computes A - B
//     * 
//     * @param a Set A
//     * @param b Set B
//     * @param returnList 
//     * @returns 
//     */
//    static SUBTRACTION(a: BaseObject<Point>, b: BaseObject<Point>, returnList: boolean): Point[] | TreeStorage<Point> {
//       if (a.internalStorage.dimensionalCount != b.internalStorage.dimensionalCount) {
//          throw new Error("Can not subtract varying dimensions")
//       }
//       const points: Point[] = []
//       const treeStorage: TreeStorage<Point> = new TreeStorage<Point>(a.getMaxDimensions());
//       const coordinates: Point[] = b.getCoordinateList(false, false) as Point[];
//       for (let coord of coordinates) {
//          if (!a.hasCoordinate(coord)) {
//             if (returnList) {
//                points.push(coord)
//             } else {
//                treeStorage.addCoordinate(coord, false)
//             }
//          }
//       }
//       if (returnList) {
//          return points;
//       } else {
//          return treeStorage;
//       }
//    }
//    static COMPLIMENT(a: BaseObject<Point>, universalSet: BaseObject<Point>[], returnList: boolean): Point[] | TreeStorage<Point> {
//       const points: Point[] = []
//       const treeStorage: TreeStorage<Point> = new TreeStorage<Point>(a.getMaxDimensions());
//       for (let o of universalSet) {
//          if (o != a) {
//             let currentCoordinates: Point[] = o.getCoordinateList(false, false) as Point[];
//             for (let coord of currentCoordinates) {
//                if (!a.hasCoordinate(coord)) {
//                   if (returnList) {
//                      points.push(coord)
//                   } else { 
//                      treeStorage.addCoordinate(coord, false); 
//                   }
//                }
//             }
//          }
//       }
//       if (returnList) {
//          return points;
//       }
//       return treeStorage;
//    }
// }
