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
import { cloneable } from "./cloneable.js";

export type PolygonEdgeDirectory = Record<string, Point[]>

/**
 * E is the dimension of the polygon, K is the one less.
 */
export class AVLPolygon<E extends Point, K extends Point> extends AVLObject<E> implements cloneable<AVLPolygon<E, K>> {
   vertices: E[] = []
   #storageMap!: DimensionalAnalyzer<E, K>;
   passes: number = -1;
   useSort: boolean = false;
   pointLowerFactoryMethod!: Function;
   pointFactoryMethod!: Function;
   hasEdges: boolean = false
   edgeStorage: PolygonEdgeDirectory = {}
   hasFill: boolean = false
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
      this.internalStorage.addCoordinates(this.vertices, false)
      this.useSort = false
      this.passes = -1;
      this.hasEdges = false
      this.hasFill = false
      this.edgeStorage = {}
      return this;
   }
   verticesHaveMutated(): AVLPolygon<E,K> {
      this.internalStorage.reset()
      this.edgeStorage = {}
      this.internalStorage.addCoordinates(this.vertices, false)
      if (this.hasEdges) {
         this.createEdges()
      }
      if (this.hasFill) {
         this.fillPolygon(this.passes, this.useSort)
      }
      return this;
   }
   createEdges(): AVLPolygon<E, K> {
      this.edgeStorage = {}
      this.internalStorage.reset()
      this.useSort = false
      this.passes = -1;
      this.hasEdges = true;
      this.hasFill = false
      for (let i = 0; i < this.vertices.length; i++) {
         if (i + 1 === this.vertices.length) {
            let coords = Utilities.bresenham(this.vertices[i], this.vertices[0], 0) as E[]
            this.edgeStorage[`V${i}V0`] = coords
            this.addCoordinates(coords, false)
         } else {
            let coords = Utilities.bresenham(this.vertices[i], this.vertices[i + 1], 0) as E[]
            this.edgeStorage[`V${i}V${i+1}`] = coords
            this.addCoordinates(coords, false)
         }
      }
      return this;
   }

   fillPolygon(passes: number, useSort: boolean): AVLPolygon<E, K> {
      if (passes > this.maxDimensions) {
         throw new Error("Passes is greater than max dimensions")
      }
      this.hasFill = true;
      this.passes = passes;
      this.useSort = useSort;
      this.internalStorage.findRangeOutdatedRanges()
      let sortedSpans = this.internalStorage.getSortedRange();
      let referencePoint = this.pointLowerFactoryMethod(new Array(this.maxDimensions - 1).fill(0))
      for (let i = 0; i < passes; i++) {
         this.#storageMap.generateStorageMap(sortedSpans[i][0])
         this.#storageMap.storageMap.forEach((value, key) => {
            value = Utilities.pythagoreanSort(value, referencePoint) as K[]
            if (useSort) {
               let startingValue: E = Utilities.convertDimensionHigher(value[0], this.#storageMap.keyDimension, key, this.maxDimensions - 1) as E
               let endingValue: E = Utilities.convertDimensionHigher(value[value.length - 1], this.#storageMap.keyDimension, key, this.maxDimensions - 1) as E
               this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0) as E[], false)
            } else {
               for (let j = 0; j < value.length - 1; j++) {
                  let startingValue: E = Utilities.convertDimensionHigher(value[j], this.#storageMap.keyDimension, key, this.maxDimensions - 1) as E;
                  let endingValue: E = Utilities.convertDimensionHigher(value[j + 1], this.#storageMap.keyDimension, key, this.maxDimensions - 1) as E;
                  this.internalStorage.addCoordinates(Utilities.bresenham(startingValue, endingValue, 0) as E[], false);

               }
            }
         })
      }
      return this;
   }
   clone(): AVLPolygon<E, K> {
      let polygon = new AVLPolygon<E, K>([...this.vertices].reduce((accumulator, value) => {
         return accumulator.push(value as E), accumulator;
      }, [] as E[]), this.maxDimensions)
      if (this.hasEdges) {
         polygon.createEdges()
      }
      if (this.hasFill) {
         polygon.fillPolygon(this.passes, this.useSort)
      }
      return polygon;
   }
}