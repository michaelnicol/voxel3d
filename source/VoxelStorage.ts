import { BinaryTreeNode } from "./BinaryTreeNode.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";
import { Point } from "./Point.js";
import { BinaryTree } from "./BinaryTree.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";
import { Point3D } from "./Point3D.js";
import { Corners3D } from "./Corners3D.js";

export class VoxelStorage<E extends Point> implements ValidObject {

   dimensionRange: Map<number, number[]> = new Map();
   root: BinaryTree<VoxelStorageNode> = new BinaryTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   private maxDepth: number = -1;
   constructor(maxDepth: number) {
      if (maxDepth < 1) {
         throw new Error("Invalid Depth: Can not be less than 1")
      }
      this.maxDepth = maxDepth;
      for (let i = 0; i < this.maxDepth; i++) {
         this.dimensionRange.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
      }
   }

   getDepth() {
      let depth = 0;
      let current: BinaryTreeNode<VoxelStorageNode> | undefined = this.root.getRoot();
      while (current != undefined) {
         depth++;
         if (current.getValue() === undefined) {
            return depth
         }
         current = (current.getValue() as VoxelStorageNode).getBinarySubTreeRoot();
      }
      return depth;
   }

   private findRangeRecursiveCall(currentNode: BinaryTreeNode<VoxelStorageNode>, range: Map<number, number[]>, depth: number, limitingDepth: number, useInclusiveRanges: boolean, inclusiveRanges?: number[]) {
      if (!useInclusiveRanges || depth === (inclusiveRanges as number[])[(inclusiveRanges as number[]).length - 1]) {
         if (useInclusiveRanges) {
            // n is the length of the initial inclusiveRanges aray
            // Removing from end of array is o(1), so o(n) for all range values;
            // Instead of shift that will be o(n^2).
            inclusiveRanges?.pop();
         }
         const amount: number = currentNode.getAmount();
         const currentValue: number[] = range.get(depth) as number[];
         if (amount < currentValue[0]) {
            currentValue[0] = amount;
            currentValue[1] = 1;
         }
         if (amount === currentValue[0]) {
            currentValue[1] += 1;
         }
         if (amount > currentValue[2]) {
            currentValue[2] = amount;
            currentValue[3] = 1;
         }
         if (amount === currentValue[2]) {
            currentValue[3] += 1;
         }
      }
      if (currentNode.hasRight()) {
         let rightSubTree = currentNode.getRight() as BinaryTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(rightSubTree, range, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
      }
      if (currentNode.hasLeft()) {
         let leftSubTree = currentNode.getLeft() as BinaryTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(leftSubTree, range, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
      }
      if (depth < limitingDepth) {
         let downwardSubTree = (currentNode.getValue() as VoxelStorageNode).getBinarySubTreeRoot() as BinaryTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(downwardSubTree, range, ++depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
      }
   }

   findRangeInclusive(inclusiveRange: number[], range?: Map<number, number[]>): Map<number, number[]> {
      return this.#findRange(true, inclusiveRange, -1, range);
   }
   findRangeExclusive(maxDepth: number, range?: Map<number, number[]>): Map<number, number[]> {
      return this.#findRange(true, [], maxDepth, range);
   }


   #findRange(useInclusive: boolean,
      inclusiveRange: number[],
      exclusiveDepth: number,
      range?: Map<number, number[]>): Map<number, number[]> {
      if (exclusiveDepth > this.maxDepth) {
         throw new Error(`Invalid tree height for range call: ${exclusiveDepth} greater than this.maxDepth ${this.maxDepth}`);
      }
      range = range === undefined ? new Map() : range;
      if (!useInclusive) {
         for (let i = 0; i < exclusiveDepth; i++) {
            range.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
         }
      } else {
         inclusiveRange = inclusiveRange?.sort((a, b) => b - a);
         if ((inclusiveRange as number[])[0] > this.maxDepth) {
            throw new Error(`Inclusive Ranges depth too large: ${JSON.stringify(range)}`)
         }
         for (let i = 0; i < (inclusiveRange as number[]).length; i++) {
            let rangeNumber = (inclusiveRange as number[])[i];
            range.set(rangeNumber, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
         }
      }
      this.findRangeRecursiveCall(this.root.getRoot() as BinaryTreeNode<VoxelStorageNode>, range, 0, exclusiveDepth, useInclusive, inclusiveRange);
      return range;
   }
   getMaxDepth(): number {
      return this.maxDepth;
   }
   hasCoordinate(coordinate: E): boolean {
      const { arr } = coordinate;
      let nodeToFind = new VoxelStorageNode(arr[0]);
      if (!this.root.hasItem(nodeToFind)) {
         return false;
      }
      let currentTree: VoxelStorageNode = (this.root.getItem(nodeToFind) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
      for (let i = 1; i < arr.length; i++) {
         if (currentTree.hasItem(arr[i])) {
            currentTree = ((currentTree.getItem(arr[i]) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode);
         } else {
            return false;
         }
      }
      return true;
   }

   addCoordinate(coordinate: E): void {
      const { arr } = coordinate;
      var currentNode: VoxelStorageNode | undefined;
      for (let i = 0; i < arr.length; i++) {
         const range: number[] = this.dimensionRange.get(i) as number[];
         if (i < range[0]) {
            range[0] = i;
            range[1] = 1;
         }
         if (i === range[0]) {
            range[1] += 1;
         }
         if (i > range[2]) {
            range[2] = i;
            range[3] = 1;
         }
         if (i === range[2]) {
            range[3] += 1;
         }
         const nodeToAdd: VoxelStorageNode = new VoxelStorageNode(arr[i]);
         if (i == 0) {
            this.root.addItem(nodeToAdd);
            currentNode = (this.root.getItem(nodeToAdd) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
         } else {
            (currentNode as VoxelStorageNode).addItem(arr[i]);
            currentNode = ((currentNode as VoxelStorageNode).getItem(arr[i]) as BinaryTreeNode<VoxelStorageNode>).getValue();
         }
      }
      if (!this.root.hasItem(new VoxelStorageNode(arr[0]))) {
         throw new Error("Internal Error")
      }
   }

   removeCoordinate(coordinate: E): void {
      if (!this.hasCoordinate(coordinate)) {
         throw new Error("Coordinate does not exist");
      }
      const { arr } = coordinate;
      const rangeList = [];
      let nodeToFind = new VoxelStorageNode(arr[0]);
      let nodeToReduce: BinaryTreeNode<VoxelStorageNode> = this.root.getItem(nodeToFind) as BinaryTreeNode<VoxelStorageNode>;
      if (nodeToReduce.getAmount() === 1) {
         rangeList.push(0);
      }
      let currentTree: VoxelStorageNode = (this.root.removeItem(nodeToFind) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
      for (let i = 1; i < arr.length; i++) {
         nodeToReduce = currentTree.getItem(arr[i]) as BinaryTreeNode<VoxelStorageNode>
         if (nodeToReduce.getAmount() === 1) {
            rangeList.push(i);
         }
         currentTree = ((currentTree.removeItem(arr[i]) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode);
      }
      if (rangeList.length > 0) {
         this.findRangeInclusive(rangeList, this.dimensionRange);
      }
   }
   /**
    * @TODO fix the allCoordinates.push with constructor
    * @param currentNode 
    * @param currentCoordinate 
    * @param allCoordinates 
    * @param depth 
    * @returns 
    */
   #getCoordinatesRecursiveCall(currentNode: BinaryTreeNode<VoxelStorageNode>, currentCoordinate: number[], allCoordinates: E[], depth: number) {
      if (currentNode.hasRight()) {
         let rightSubTree = currentNode.getRight() as BinaryTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(rightSubTree, [...currentCoordinate], allCoordinates, depth)
      }
      if (currentNode.hasLeft()) {
         let leftSubTree = currentNode.getLeft() as BinaryTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(leftSubTree, [...currentCoordinate], allCoordinates, depth)
      }
      if (depth >= this.maxDepth) {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         for (let i = currentNode.getAmount(); i > 0; i--) {
            // allCoordinates.push((new this.construct(...currentCoordinate)));
         }
         return;
      } else {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         let downwardSubTree: BinaryTreeNode<VoxelStorageNode> = (currentNode.getValue() as VoxelStorageNode).getBinarySubTreeRoot() as BinaryTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(downwardSubTree, [...currentCoordinate], allCoordinates, ++depth)
      }
   }

   getCoordinateList(): E[] {
      if (this.root.getRoot() === undefined) {
         return [];
      }
      let allCoordinates: E[] = [];
      this.#getCoordinatesRecursiveCall(this.root.getRoot() as BinaryTreeNode<VoxelStorageNode>, [], allCoordinates, 1);
      return allCoordinates
   }

   getBoundingBox(): Corners3D {
      if (this.maxDepth < 3) {
         throw new Error("Storage tree depth is less than 3: "+this.maxDepth);
      }
      let xRange = this.dimensionRange.get(0) as number[];
      let yRange = this.dimensionRange.get(1) as number[];
      let zRange = this.dimensionRange.get(2) as number[];
      return {
         "0": new Point3D(xRange[0], yRange[0], zRange[0]),
         "1": new Point3D(xRange[2], yRange[0], zRange[0]),
         "2": new Point3D(xRange[0], yRange[2], zRange[0]),
         "3": new Point3D(xRange[2], yRange[2], zRange[0]),
         "4": new Point3D(xRange[0], yRange[0], zRange[2]),
         "5": new Point3D(xRange[2], yRange[0], zRange[2]),
         "6": new Point3D(xRange[0], yRange[2], zRange[2]),
         "7": new Point3D(xRange[2], yRange[2], zRange[2])
      }
   }

   preHash(): VoxelStorage<E> {
      return this;
   }
   toPrint(): string {
      return "";
   }
}