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
   constructor(pointFactoryMethod: Function, v: E[]) {
      super(3, pointFactoryMethod)
      for (let coord of v) {
         this.vertices.push(coord.clone())
         this.internalStorage.addCoordinate(coord, false)
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
      let x = [...p2d.arr];
      x.splice(insertionIndex, 0, insertionValue)
      return this.pointFactoryMethod(x)
   }

   fillPolygon(): AVLPolygon3D<E> {
      let rangeCoordinates: [Map<number, Point2D[]>, number[]] = AVLObject.getSortedRange(this.internalStorage);
      let TS_REF = this;
      // Just for laughs, here is the entire 3D polygon rasterization interface in one line 
      return rangeCoordinates[0].forEach(function (value, key) { value.length >= 2 ? TS_REF.addCoordinates((Utilities.brensenham(value[0], value[value.length-1], 0) as Point2D[]).reduce<E[]>(function (accumulator: E[], currentValue: Point2D): E[] { return accumulator.push(TS_REF.convert2Dto3D(currentValue, rangeCoordinates[1][0], key)), accumulator; }, []), false) : value.length === 1 ? TS_REF.internalStorage.addCoordinate(TS_REF.convert2Dto3D(value[0], rangeCoordinates[1][0], key), false) : null; }), this;
   }
}