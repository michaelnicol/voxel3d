import { AVLObject } from "./AVLObject.js";
import { HashObject } from "./HashObject.js";
import { HashStorage } from "./HashStorage.js";
import { Point } from "./Point.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";

export class AVLPolygon3D<E extends Point3D> extends AVLObject<E> {
   vertices: Point3D[] = []
   constructor(pointFactoryMethod: Function, v: Point3D[]) {
      super(3, pointFactoryMethod)
      for (let coord of v) {
         this.vertices.push(coord.clone())
      }
   }
   createEdges(): AVLPolygon3D<E> {
      this.internalStorage = new VoxelStorage<E>(3, this.pointFactoryMethod)
      for (let i = 0; i < this.vertices.length; i++) {
         if (i + 1 === this.vertices.length) {
            this.internalStorage, this.addCoordinates(Utilities.brensenham(this.vertices[i], this.vertices[0], 0) as E[], false)
         } else {
            this.internalStorage, this.addCoordinates(Utilities.brensenham(this.vertices[i], this.vertices[i + 1], 0) as E[], false)
         }
      }
      return this;
   }

   convert2Dto3D(p2d: Point2D, insertionIndex: number, insertionValue: number) {
      return this.pointFactoryMethod([...p2d.arr].splice(insertionIndex, 0, insertionValue))
   }

   fillPolygon(): AVLPolygon3D<E> {
      let rangeCoordinates: [Map<number, Point2D[]>, number] = AVLObject.getSortedRange(this.internalStorage);
      let sortedCoordinates = rangeCoordinates[0]
      let largestDepth = rangeCoordinates[1];
      let TS_REF = this;
      for (let [key, value] of sortedCoordinates) {
         if (value.length >= 2) {
            this.addCoordinates((Utilities.brensenham(value[0], value[1], 0) as Point2D[]).reduce<E[]>(function (accumulator: E[], currentValue: Point2D): E[] {
               return accumulator.push(TS_REF.convert2Dto3D(currentValue, largestDepth, key)), accumulator;
            }, []), false)
         } else if (value.length === 1) {
            this.internalStorage.addCoordinate(TS_REF.convert2Dto3D(value[0], largestDepth, key), false)
         }
      }
      return this;
   }
}