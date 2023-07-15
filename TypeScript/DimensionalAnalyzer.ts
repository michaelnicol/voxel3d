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
   constructor(tree: VoxelStorage<E>) {
      this.dimensionLowerFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.getMaxDimensions() - 1)
      this.dimensionFactoryMethod = PointFactoryMethods.getFactoryMethod(tree.getMaxDimensions())
      this.#tree = tree;
   }
   generateStorageMap(keyDimension: number): Map<number, K[]> {
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
      }
      return this.storageMap;
   }
}