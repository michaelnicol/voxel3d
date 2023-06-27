import { AVLTree } from "./AVLTree.js";
import { Point } from "./Point.js";
import { Point2D } from "./Point2D.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";

/**
 * The Pythagorean Map is designed to analyze the dimension ranges of an VoxelStorage and group stored coordinates. This grouping will compact and project the VoxelStorage tree down by one dimension.
 * 
 * Projected coordinates are then sorted by it's distance from (0,0...) in the projected dimension.
 * 
 * This data structure is not designed to be dynamic and does not update whenever the tree recieves or removes a coordinate.
 * 
 * This analysis is used for Polygon rasterization
 * 
 */
export class DimensionalAnalyzer<E extends Point, K extends Point> {
   #tree!: VoxelStorage<E>;
   keyDimension: number = -1;
   storageMap: Map<number, K[]> = new Map<number, K[]>()
   dimensionFactoryMethod!: Function
   dimensionLowerFactoryMethod!: Function
   isSorted: boolean = false
   usedSortMethod: number | undefined;
   sortMethodMeta: any;
   constructor(tree: VoxelStorage<E>) {
      this.dimensionLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.getMaxDimensions()-1)
      this.dimensionFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.getMaxDimensions())
      this.#tree = tree;
   }
   generateStorageMap(keyDimension: number, useSort: boolean, sortMethod: number | undefined = undefined, sortMethodMeta: any): Map<number, K[]> {
      if (this.#tree.getCoordinateCount() > 0) {
         this.keyDimension = keyDimension;
         this.storageMap = new Map<number, K[]>()
         let points: number[][] = this.#tree.getCoordinateList(false, false) as number[][];
         for (let point of points) {
            if (this.storageMap.get(point[this.keyDimension]) === undefined) {
               this.storageMap.set(point[this.keyDimension], []);
            }
            (this.storageMap.get(point[this.keyDimension]) as K[]).push(this.dimensionLowerFactoryMethod(point.filter((v, i) => i != this.keyDimension)) as K)
         }
         if (useSort) {
            this.storageMap.forEach((v: K[]) => v.sort((a: K, b: K) => {
               if (sortMethod === 0) {
                  return DimensionalAnalyzer.pythagoreanSort(a, b, sortMethodMeta as K)
               } else if (sortMethod === 1) {
                  return DimensionalAnalyzer.polarSort(a, b, sortMethodMeta as K)
               }
               throw new Error("No Sort Method Found For: "+sortMethod)
            }))
         }
      }
      this.isSorted = useSort
      this.usedSortMethod = sortMethod;
      this.sortMethodMeta = sortMethodMeta
      return this.storageMap;
   }
   static pythagoreanSort<K extends Point>(a: K, b: K, referencePoint: K) {
      return Utilities.pythagorean(referencePoint, b) - Utilities.pythagorean(referencePoint, a)
   }
   static #radToDegConstant = 180 / Math.PI
   static polarSort<K extends Point>(a: K, b: K, referencePoint: K) {
      let angle1 = Math.atan2((a.arr[1] - referencePoint.arr[1]), (a.arr[0] - referencePoint.arr[0])) * DimensionalAnalyzer.#radToDegConstant;
      angle1 += angle1 < 0 ? 360 : 0
      let angle2 = Math.atan2((b.arr[1] - referencePoint.arr[1]), (b.arr[0] - referencePoint.arr[0])) * DimensionalAnalyzer.#radToDegConstant;
      angle2 += angle2 < 0 ? 360 : 0
      return angle1 - angle2
   }
}