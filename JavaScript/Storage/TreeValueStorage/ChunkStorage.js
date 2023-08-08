// import { AVLTreeNode } from "../AVLTreeNode.js"
// import { ValidObject } from "../../ValidObject.js";
// import { TreeStorageNode } from "../TreeStorage/TreeStorageNode.js"
// import { Point } from "../../Point.js";
// import { AVLTree } from "../AVLTree.js";
// import { TreeStorageNodeComparator } from "../TreeStorage/TreeStorageNodeComparator.js"
// import { Point3D } from "../../Point3D.js";
// // import { BoundingBox3D } from "./BoundingBox3D.js";
// import { Utilities } from "../../Utilities.js";
// import { PointFactoryMethods } from "../../PointFactoryMethods.js";
// import { cloneable } from "../../cloneable.js";
// import { PointStorage } from "../PointStorage.js";
// import { DimensionalRanges } from "../PointStorage.js";
// import { TreeStorage } from "../TreeStorage/TreeStorage.js";
// import { ChunkLeafNode } from "./ChunkLeafNode.js";
// import { Chunk } from "../ChunkStorage/Chunk.js";
export {};
// export type PointChunkTransfer = [Point, Chunk<Point, PointStorage<Point>>]
// export class ChunkStorage<E extends Point, S extends PointStorage<E>> implements ValidObject {
//    uniqueCoordinateCount: number = 0;
//    dimensionalRanges: DimensionalRanges = new Map<number, number[]>()
//    outdatedDimensionRanges: Map<number, boolean> = new Map<number, boolean>()
//    dimensionCount!: number;
//    root: AVLTree<TreeStorageNode> = new AVLTree<TreeStorageNode>(undefined, new TreeStorageNodeComparator());
//    pointFactoryMethod!: Function
//    constructor(dimensionCount: number) {
//       this.dimensionCount = dimensionCount
//       for (let i = 0; i < this.dimensionCount; i++) {
//          this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
//          this.outdatedDimensionRanges.set(i, false)
//       }
//       this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount)
//    }
//    /**
//    * Private recursive method for calculating the range of dimensions within the tree.
//    * 
//    * @param currentNode The current Node the call stack is checking
//    * @param depth The current depth of the tree. Zero is for the x (or first) dimension.
//    * @param limitingDepth If the parameter specifies useInclusiveRanges, then stop after this depth
//    * @param useInclusiveRanges  If the program should use a list of target dimensions to calculate the range for verse calculating ranges up to a depth
//    * @param inclusiveRanges Otherwise, without a limiting depth, only re-calculate ranges for this depth.
//    */
//    #findRangeRecursiveCall(currentNode: AVLTreeNode<TreeStorageNode>, depth: number, limitingDepth: number, useInclusiveRanges: boolean, inclusiveRanges?: number[]) {
//       if (!useInclusiveRanges || depth === (inclusiveRanges as number[])[(inclusiveRanges as number[]).length - 1]) {
//          if (useInclusiveRanges) {
//             // n is the length of the initial inclusiveRanges array
//             // Removing from end of array is o(1), so o(n) for all range values;
//             // Instead of shift that will be o(n^2).
//             inclusiveRanges?.pop();
//          }
//          const amount: number = currentNode.getAmount();
//          const currentValue: number[] = this.dimensionalRanges.get(depth) as number[];
//          // [minValue, minAmount, maxValue, maxAmount]
//          if (amount < currentValue[0]) {
//             currentValue[0] = amount;
//             currentValue[1] = 1;
//          }
//          if (amount === currentValue[0]) {
//             currentValue[1] += amount
//          }
//          if (amount > currentValue[2]) {
//             currentValue[2] = amount;
//             currentValue[3] = 1;
//          }
//          if (amount === currentValue[2]) {
//             currentValue[3] += amount
//          }
//       }
//       if (currentNode.hasRight()) {
//          let rightSubTree = currentNode.getRight() as AVLTreeNode<TreeStorageNode>;
//          this.#findRangeRecursiveCall(rightSubTree, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
//       }
//       if (currentNode.hasLeft()) {
//          let leftSubTree = currentNode.getLeft() as AVLTreeNode<TreeStorageNode>;
//          this.#findRangeRecursiveCall(leftSubTree, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
//       }
//       if (depth < (!useInclusiveRanges ? limitingDepth : this.dimensionCount - 1)) {
//          let downwardSubTree = (currentNode.getValue() as TreeStorageNode).getBinarySubTreeRoot() as AVLTreeNode<TreeStorageNode>;
//          this.#findRangeRecursiveCall(downwardSubTree, ++depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
//       }
//    }
//    /**
//     * Re-calculates the internal range hash map.
//     * 
//     * @param useInclusive If the program should use a list of target dimensions to calculate the range for verse calculating ranges up to a depth
//     * @param inclusiveRange Only calculate the ranges for these dimensions
//     * @param exclusiveDepth Otherwise, only calculate up to this depth
//     * @returns The dimension range object
//     */
//    #findRange(useInclusive: boolean,
//       inclusiveRange: number[],
//       exclusiveDepth: number): Map<number, number[]> {
//       if (exclusiveDepth > this.dimensionCount) {
//          throw new Error(`Invalid tree height for range call: ${exclusiveDepth} greater than this.dimensionCount ${this.dimensionCount}`);
//       }
//       const range = this.dimensionalRanges === undefined ? new Map() : this.dimensionalRanges;
//       if (!useInclusive) {
//          for (let i = 0; i < exclusiveDepth; i++) {
//             this.outdatedDimensionRanges.set(i, false)
//             range.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
//          }
//       } else {
//          inclusiveRange = inclusiveRange?.sort((a, b) => b - a);
//          if ((inclusiveRange as number[])[0] > this.dimensionCount) {
//             throw new Error(`Inclusive Ranges depth too large: ${JSON.stringify(range)}`)
//          }
//          for (let i = 0; i < (inclusiveRange as number[]).length; i++) {
//             let rangeNumber = (inclusiveRange as number[])[i];
//             this.outdatedDimensionRanges.set(rangeNumber, false)
//             range.set(rangeNumber, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
//          }
//       }
//       if (this.uniqueCoordinateCount === 0) {
//          return range;
//       }
//       this.#findRangeRecursiveCall(this.root.getRoot() as AVLTreeNode<TreeStorageNode>, 0, exclusiveDepth, useInclusive, inclusiveRange);
//       return range;
//    }
//    /**
//     * @param inclusiveRange Re-calculate the range at only these dimensions
//     * @returns The current dimension range hashmap
//     */
//    findRangeInclusive(inclusiveRange: number[]): Map<number, number[]> {
//       return this.#findRange(true, inclusiveRange, -1);
//    }
//    /**
//     * @param maxDimensions  Re-calculate the range up to these dimensions
//     * @returns 
//     */
//    findRangeExclusive(maxDimensions: number): Map<number, number[]> {
//       return this.#findRange(true, [], maxDimensions);
//    }
//    hasItem(coordinate: E): [boolean, Chunk<E,S> | undefined] {
//       const { arr } = coordinate;
//       let nodeToFind = new TreeStorageNode((arr[0]));
//       if (!this.root.hasItem(nodeToFind)) {
//          return [false, undefined];
//       }
//       var value: Chunk<E,S> | undefined
//       var currentTree: TreeStorageNode = (this.root.getItem(nodeToFind) as AVLTreeNode<TreeStorageNode>).getValue() as TreeStorageNode;
//       for (let i = 1; i < arr.length; i++) {
//          let currentTreeItem = currentTree.getItem(arr[i])
//          if (currentTreeItem !== undefined) {
//             currentTree = ((currentTree.getItem(arr[i]) as AVLTreeNode<TreeStorageNode>).getValue() as TreeStorageNode);
//             if (currentTree instanceof ChunkLeafNode) {
//                value = currentTree.value
//             }
//          } else {
//             return [false, undefined];
//          }
//       }
//       return [true, value];
//    }
//    /**
//     * Adds a coordinate to the tree.
//     * 
//     * @param coordinate The coordinate instance to add.
//     * @param allowDuplicates If this coordinate already exists in this tree, specify true to ignore it or false to increase the amount of that coordinate.
//     * @returns 
//     */
//    addCoordinate(pointChunkTransfer: PointChunkTransfer): void {
//       const { arr } = pointChunkTransfer[0];
//       var currentNode: TreeStorageNode | undefined;
//       const hasItem: boolean = this.hasItem(pointChunkTransfer[0] as E)[0]
//       if (hasItem) {
//          return;
//       } 
//       this.uniqueCoordinateCount += 1;
//       for (let i = 0; i < arr.length; i++) {
//          const range: number[] = this.dimensionalRanges.get(i) as number[];
//          // Calculates the range as each dimension is traversed to prevent needing to call findRange
//          if (arr[i] < range[0]) {
//             range[0] = arr[i];
//             range[1] = 1;
//          }
//          else if (arr[i] === range[0]) {
//             range[1] += 1;
//          }
//          if (arr[i] > range[2]) {
//             range[2] = arr[i];
//             range[3] = 1;
//          }
//          else if (arr[i] === range[2]) {
//             range[3] += 1;
//          }
//          const nodeToAdd: TreeStorageNode = i+1 === arr.length ? new TreeStorageNode(arr[i]) : new ChunkLeafNode(arr[i], pointChunkTransfer[1]);
//          if (i == 0) {
//             this.root.addItem(nodeToAdd);
//             currentNode = (this.root.getItem(nodeToAdd) as AVLTreeNode<TreeStorageNode>).getValue() as TreeStorageNode;
//          } else {
//             (currentNode as TreeStorageNode).addItem(arr[i]);
//             currentNode = ((currentNode as TreeStorageNode).getItem(arr[i]) as AVLTreeNode<TreeStorageNode>).getValue();
//          }
//       }
//       if (!this.root.hasItem(new TreeStorageNode(arr[0]))) {
//          throw new Error("Internal Error")
//       }
//    }
//    addCoordinates(pointChunkTransfers: PointChunkTransfer[]): void {
//       for (let i = 0; i < pointChunkTransfers.length; i++) {
//          this.addCoordinate(pointChunkTransfers[i])
//       }
//    }
//    removeCoordinates(coordinates: E[], calculateRange: boolean): number[] {
//       let rangeList: number[] = []
//       for (let coord of coordinates) {
//          let ranges = this.removeCoordinate(coord, false);
//          for (let v of ranges) {
//             if (rangeList.indexOf(v) === -1) {
//                rangeList.push(v);
//             }
//          }
//       }
//       if (calculateRange && rangeList.length > 0) {
//          this.findRangeInclusive(rangeList);
//       }
//       return rangeList;
//    }
//    /**
//     * Removes a coordinate of type E from the tree.
//     * 
//     * @param coordinate Coordinate instance to remove
//     * @param calculateRange If the dimension ranges should be re-calculated.
//     * @returns 
//     */
//    removeCoordinate(coordinate: E, calculateRange: boolean): number[] {
//       const hasItem = this.hasItem(coordinate) as [boolean, Chunk<E,S> | undefined]
//       if (!hasItem[0]) {
//          return []
//       }
//       // Grab the list of dimension values from the coordinate
//       const { arr } = coordinate;
//       /**
//       * The range list contains the dimension numbers that ranges needs to be re-calculated. This is because, if a y coordinate is removed
//       * and it was the min or the max of that y-coordinate range, then a new one must be found.
//       */
//       const rangeList: number[] = [];
//       let nodeToFind = new TreeStorageNode(arr[0]);
//       // Find the node that needs to be reduced
//       let nodeToReduce: AVLTreeNode<TreeStorageNode> = this.root.getItem(nodeToFind) as AVLTreeNode<TreeStorageNode>;
//       let nodeToReduceValue = (nodeToReduce.getValue() as TreeStorageNode).getData() as number
//       let dimensionEntry = this.dimensionalRanges.get(0) as number[]
//       // If the node to reduce amount is equal to one, this node and its sub-branch is removed from the tree.
//       if (nodeToReduce.getAmount() === 1) {
//          // If the reduced value is the min of the entire range for that dimension
//          if (nodeToReduceValue === dimensionEntry[0]) {
//             // And it is the only number that is that min
//             if (dimensionEntry[1] === 1) {
//                // That range needs to be re-calculated.
//                rangeList.push(0)
//             } else {
//                // Otherwise, just reduce the amount of numbers that are the min of that dimension
//                dimensionEntry[1] -= 1;
//             }
//             // Same applies with the max
//          } else if (nodeToReduceValue === dimensionEntry[1]) {
//             if (dimensionEntry[3] === 1) {
//                rangeList.push(0)
//             } else {
//                dimensionEntry[3] -= 1;
//             }
//          }
//          // Otherwise, this number is inbetween the min and the max, and the range does not need to be recalculated.
//       }
//       // The value of each TreeStorageNode is another tree, and grab that tree.
//       let currentTree: TreeStorageNode = (this.root.removeItem(nodeToFind) as AVLTreeNode<TreeStorageNode>).getValue() as TreeStorageNode;
//       // Start at the second dimension, work your way into all subsequente dimensions.
//       for (let i = 1; i < arr.length; i++) {
//          nodeToReduce = currentTree.getItem(arr[i]) as AVLTreeNode<TreeStorageNode>
//          nodeToReduceValue = (nodeToReduce.getValue() as TreeStorageNode).getData()
//          dimensionEntry = this.dimensionalRanges.get(i) as number[]
//          // If the node to reduce amount is equal to one, this node and its sub-branch is removed from the tree.
//          if (nodeToReduce.getAmount() === 1) {
//             // If the reduced value is the min of the entire range for that dimension
//             if (nodeToReduceValue === dimensionEntry[0]) {
//                // And it is the only number that is that min
//                if (dimensionEntry[1] === 1) {
//                   // That range needs to be re-calculated.
//                   this.outdatedDimensionRanges.set(i, true)
//                   rangeList.push(i)
//                } else {
//                   // Otherwise, just reduce the amount of numbers that are the min of that dimension
//                   dimensionEntry[1] -= 1;
//                }
//                // Same applies with the max
//             } else if (nodeToReduceValue === dimensionEntry[1]) {
//                if (dimensionEntry[3] === 1) {
//                   this.outdatedDimensionRanges.set(i, true)
//                   rangeList.push(i)
//                } else {
//                   dimensionEntry[3] -= 1;
//                }
//             }
//             // Otherwise, this number is between the min and the max, and the range does not need to be recalculated.
//          }
//          currentTree = ((currentTree.removeItem(arr[i]) as AVLTreeNode<TreeStorageNode>).getValue() as TreeStorageNode);
//       }
//       if (calculateRange && rangeList.length > 0) {
//          this.findRangeInclusive(rangeList);
//       } else {
//       }
//       return rangeList;
//    }
//    /**
//     * Private recursive call for collecting the coordinates in the tree.
//     * 
//     * @param currentNode 
//     * @param currentCoordinate 
//     * @param allCoordinates Uses a reference to an external list rather than returning that list
//     * @param depth 
//     * @returns 
//     */
//    #getCoordinatesRecursiveCall(pointChunkTransfers: PointChunkTransfer[], currentNode: AVLTreeNode<TreeStorageNode>, currentCoordate: number[], depth: number): void {
//    }
//    getCoordinates(): PointChunkTransfer[] {
//       return []
//    }
//    /**
//      * @returns Within the dimensionRange, dimensions are stored zero through n (key) and the min and maxes are stored (value). The span is the difference between the min and the max of each dimension.
//      * This function will return a list of [dimensionNumber, dimensionSpan] elements sorted by span.
//    */
//    getSortedRange(): number[][] {
//       // Each element is a [dimensionNumber, dimensionSpan]
//       let list: number[][] = []
//       // For each range in the hashmap
//       for (let [key, value] of this.dimensionalRanges) {
//          // Calculate the span of that dimension. Difference between min and max. 
//          let r = Math.abs(value[0] - value[2])
//          // Add the [dimensionNumber: span] to the list.
//          list.push([key, r])
//       }
//       // Sort from highest to lowest dimension.
//       list.sort((a, b) => b[1] - a[1])
//       // Then return that.
//       return list;
//    }
//    correctOutdatedRanges(): DimensionalRanges {
//       let ranges: number[] = []
//       for (let [key, value] of this.outdatedDimensionRanges) {
//          if (value) {
//             ranges.push(key)
//          }
//       }
//       return this.findRangeInclusive(ranges)
//    }
//    hasOutdatedRanges(): boolean {
//       for (let [key, value] of this.outdatedDimensionRanges) {
//          if (value) {
//             return true;
//          }
//       }
//       return false;
//    }
//    reset(): ChunkStorage<E,S> {
//       this.root = new AVLTree<TreeStorageNode>(undefined, new TreeStorageNodeComparator());
//       for (let i = 0; i < this.dimensionCount; i++) {
//          this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
//          this.outdatedDimensionRanges.set(i, false)
//       }
//       this.uniqueCoordinateCount = 0;
//       return this;
//    }
//    clone(): ChunkStorage<E,S> {
//       return new ChunkStorage<E,S>(this.dimensionCount)
//    }
//    preHash(): ChunkStorage<E,S> {
//       return this;
//    }
//    toPrint(): string {
//       return JSON.stringify(this.getCoordinates())
//    }
// }
