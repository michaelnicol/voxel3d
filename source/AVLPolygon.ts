import { AVLObject } from "./AVLObject.js";
import { HashObject } from "./HashObject.js";
import { HashStorage } from "./HashStorage.js";
import { Point } from "./Point.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { DimensionalAnalyzer } from "./DimensionalAnalyzer.js"
import { PointFactoryMethods } from "./PointFactoryMethods.js";

/**
 * E is the dimension of the polygon, K is the one less.
 */
export class AVLPolygon<E extends Point, K extends Point> extends AVLObject<E> {
   vertices: E[] = []
   #storageMap!: DimensionalAnalyzer<E, K>;
   passes: number = -1;
   useSort: boolean = false;
   pointLowerFactoryMethod!: Function;
   pointFactoryMethod!: Function;
   constructor(v: E[], maxDimensions: number) {
      super(maxDimensions)
      this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(maxDimensions)
      this.pointLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(maxDimensions - 1)
      for (let coord of v) {
         this.vertices.push(coord.clone() as E)
         this.internalStorage.addCoordinate(coord, false)
      }
      this.#storageMap = new DimensionalAnalyzer<E, K>(this.internalStorage)
   }
   changeVertices(v: E[]): AVLPolygon<E, K> {
      this.vertices = []
      this.internalStorage.reset()
      v.forEach((coord: E) => this.vertices.push(coord.clone() as E))
      this.useSort = false
      this.passes = -1;
      return this;
   }
   createEdges(): AVLPolygon<E, K> {
      this.internalStorage.reset()
      this.useSort = false
      this.passes = -1;
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

   fillPolygon(passes: number, useSort: boolean): AVLPolygon<E, K> {
      if (passes > this.maxDimensions) {
         throw new Error("Passes is greater than max dimensions")
      }
      this.passes = passes;
      this.useSort = useSort;
      this.internalStorage.findRangeOutdatedRanges()
      let sortedSpans = this.internalStorage.getSortedRange();
      let referencePoint = this.pointLowerFactoryMethod()
      for (let i = 0; i < passes; i++) {
         this.#storageMap.generateStorageMap(sortedSpans[i][0], useSort, 0, referencePoint)
         this.#storageMap.storageMap.forEach((value, key) => {
            if (useSort) {
               let startingValue: E = this.convertDimensionHigher(value[0], this.#storageMap.keyDimension, key) as E
               let endingValue: E = this.convertDimensionHigher(value[value.length - 1], this.#storageMap.keyDimension, key) as E
               this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0) as E[], false)
            } else {
               for (let j = 0; j < value.length - 1; j++) {
                  let startingValue: E = this.convertDimensionHigher(value[j], this.#storageMap.keyDimension, key) as E;
                  let endingValue: E = this.convertDimensionHigher(value[j + 1], this.#storageMap.keyDimension, key) as E;
                  this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0) as E[], false);

               }
            }
         })
      }
      return this;
   }
}