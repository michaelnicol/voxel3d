import { AVLObject } from "./AVLObject.js";
import { HashObject } from "./HashObject.js";
import { HashStorage } from "./HashStorage.js";
import { Point } from "./Point.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";

export class AVLPolygon<E extends Point, K extends Point> extends AVLObject<E, K> {
   vertices: E[] = []
   constructor(maxDimensions: number, pointFactoryMethod: Function, dimensionLowerFactoryMethod: Function, v: E[]) {
      super(maxDimensions, pointFactoryMethod, dimensionLowerFactoryMethod)
      for (let coord of v) {
         this.vertices.push(coord.clone() as E)
         this.internalStorage.addCoordinate(coord, false)
      }
   }
   createEdges(): AVLPolygon<E, K> {
      this.internalStorage = new VoxelStorage<E>(3, this.pointFactoryMethod)
      for (let i = 0; i < this.vertices.length; i++) {
         if (i + 1 === this.vertices.length) {
            this.internalStorage, this.addCoordinates(Utilities.bresenham(this.vertices[i], this.vertices[0], 0) as E[], false)
         } else {
            this.internalStorage, this.addCoordinates(Utilities.bresenham(this.vertices[i], this.vertices[i + 1], 0) as E[], false)
         }
      }
      return this;
   }

   convertDimensionHigher(p: K, insertionIndex: number, insertionValue: number): E {
      let x = [...p.arr];
      x.splice(insertionIndex, 0, insertionValue)
      return this.pointFactoryMethod(x)
   }

   fillPolygon(): AVLPolygon<E, K> {
      let rangeCoordinates: [Map<number, K[]>, number[]] = this.internalStorage.getSortedRange(0);
      let TS_REF = this;
      // Just for laughs, here is the entire 3D polygon rasterization interface in one line 
      return rangeCoordinates[0].forEach(
         function (value, key) { 
            value.length >= 2 ? TS_REF.addCoordinates((Utilities.bresenham(value[0], value[value.length-1], 0) as K[]).reduce<E[]>(
               function (accumulator: E[], currentValue: Point2D): E[] { 
                  return accumulator.push(TS_REF.convertDimensionHigher(currentValue as K, rangeCoordinates[1][0], key) as E), accumulator; 
               }, []), false) : value.length === 1 ? TS_REF.internalStorage.addCoordinate(TS_REF.convertDimensionHigher(value[0], rangeCoordinates[1][0], key) as E, false) : null; 
            }
         ), this;
   }
}