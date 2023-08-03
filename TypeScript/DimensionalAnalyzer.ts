import { AVLTree } from "./Storage/AVLTree.js";
import { Point } from "./Point.js";
import { Point2D } from "./Point2D.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";
import { Utilities } from "./Utilities.js";
import { TreeStorage } from "./Storage/TreeStorage/TreeStorage.js";
import { TreeStorageNode } from "./Storage/TreeStorage/TreeStorageNode.js";

/**
 * The DimensionalAnalyzer Map is designed to analyze the dimension ranges of an TreeStorage and group stored coordinates. This grouping will compact and project the TreeStorage tree down by one dimension.
 * 
 * This data structure is not designed to be dynamic and does not update whenever the tree recieves or removes a coordinate.
 * 
 * This analysis is used for Polygon rasterization
 * 
 */
export class DimensionalAnalyzer<E extends Point, K extends Point> {
   #tree!: TreeStorage<E>;
   keyDimension: number = -1;
   storageMap: Map<number, K[]> = new Map<number, K[]>()
   dimensionFactoryMethod!: Function
   dimensionLowerFactoryMethod!: Function
   constructor(tree: TreeStorage<E>) {
      this.dimensionLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.dimensionCount - 1)
      this.dimensionFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.dimensionCount)
      this.#tree = tree;
   }
   generateStorageMap(keyDimension: number): Map<number, K[]> {
      if (this.#tree.allCoordinateCount > 0) {
         this.keyDimension = keyDimension;
         this.storageMap = new Map<number, K[]>()
         let points: number[][] = this.#tree.getCoordinates(false, false) as number[][];
         for (let point of points) {
            if (this.storageMap.get(point[this.keyDimension]) === undefined) {
               this.storageMap.set(point[this.keyDimension], []);
            }
            (this.storageMap.get(point[this.keyDimension]) as K[]).push(this.dimensionLowerFactoryMethod(point.filter((v, i) => i != this.keyDimension)) as K)
         }
      }
      return this.storageMap;
   }
}