import { AVLTree } from "./AVLTree.js";
import { Point } from "./Point.js";
import { VoxelStorage } from "./VoxelStorage.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";

/**
 * The Pythagorean Map is designed to analyze the dimension ranges of an VoxelStorage and group stored coordinates. This grouping will compact VoxelStorage tree down by one dimension.
 * 
 * This data structure is not designed to be dynamic and does not update whenever the tree recieves or removes a coordinate.
 * 
 * This analysis is used for Polygon rasterization
 * 
 */
class PythagoreanMap<E extends Point, K extends Point> {
   #tree!: VoxelStorage<E>;
   keyDimension: number = -1;
   storageMap: Map<number, K[]> = new Map<number, K[]>()
   dimensionFactoryMethod!: Function
   dimensionLowerFactoryMethod!: Function
   constructor(dimensionFactoryMethod: Function, dimensionLowerFactoryMethod: Function, tree: VoxelStorage<E>) {
      this.dimensionLowerFactoryMethod = dimensionLowerFactoryMethod
      this.dimensionFactoryMethod = dimensionFactoryMethod
      this.#tree = tree;
   }
   generateStorageMap(keyDimension: number): Map<number, K[]> {
      this.keyDimension = keyDimension;
      this.storageMap = new Map<number, K[]>()
      let points: number[][] = this.#tree.getCoordinateList(false, true) as number[][];
      for (let point of points) {
         if (this.storageMap.get(point[this.keyDimension]) === undefined) {
            this.storageMap.set(point[this.keyDimension], []);
         }
         (this.storageMap.get(point[this.keyDimension]) as K[]).push(this.dimensionLowerFactoryMethod(point.filter((v, i) => i != this.keyDimension)) as K)
      }
      return this.storageMap;
   }
}