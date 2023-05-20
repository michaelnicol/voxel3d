import { AVLTreeNode } from "./AVLTreeNode.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";
import { Point } from "./Point.js";
import { AVLTree } from "./AVLTree.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";
import { Point3D } from "./Point3D.js";
import { Corners3D } from "./Corners3D.js";

export class VoxelStorage<E extends Point> implements ValidObject {

   dimensionRange: Map<number, number[]> = new Map();
   root: AVLTree<VoxelStorageNode> = new AVLTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   private maxDimensions: number = -1;
   coordinateCount: number = 0;
   pointFactoryMethod!: Function;
   constructor(maxDimensions: number, pointFactoryMethod: Function) {
      if (maxDimensions < 1) {
         throw new Error("Invalid Depth: Can not be less than 1")
      }
      this.maxDimensions = maxDimensions;
      for (let i = 0; i < this.maxDimensions; i++) {
         this.dimensionRange.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
      }
      this.pointFactoryMethod = pointFactoryMethod;
   }

   getMaxDimensions(): number {
      return this.maxDimensions;
   }

   getCoordinateCount(): number {
      return this.coordinateCount;
   }

   getDepth() {
      let depth = 0;
      let current: AVLTreeNode<VoxelStorageNode> | undefined = this.root.getRoot();
      while (current != undefined) {
         depth++;
         if (current.getValue() === undefined) {
            return depth
         }
         current = (current.getValue() as VoxelStorageNode).getBinarySubTreeRoot();
      }
      return depth;
   }

   private findRangeRecursiveCall(currentNode: AVLTreeNode<VoxelStorageNode>, range: Map<number, number[]>, depth: number, limitingDepth: number, useInclusiveRanges: boolean, inclusiveRanges?: number[]) {
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
         let rightSubTree = currentNode.getRight() as AVLTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(rightSubTree, range, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
      }
      if (currentNode.hasLeft()) {
         let leftSubTree = currentNode.getLeft() as AVLTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(leftSubTree, range, depth, limitingDepth, useInclusiveRanges, inclusiveRanges)
      }
      if (depth < (!useInclusiveRanges ? limitingDepth : this.maxDimensions - 1)) {
         let downwardSubTree = (currentNode.getValue() as VoxelStorageNode).getBinarySubTreeRoot() as AVLTreeNode<VoxelStorageNode>;
         this.findRangeRecursiveCall(downwardSubTree, range, ++depth, limitingDepth, useInclusiveRanges, inclusiveRanges);
      }
   }

   findRangeInclusive(inclusiveRange: number[], range?: Map<number, number[]>): Map<number, number[]> {
      return this.#findRange(true, inclusiveRange, -1, range);
   }
   findRangeExclusive(maxDimensions: number, range?: Map<number, number[]>): Map<number, number[]> {
      return this.#findRange(true, [], maxDimensions, range);
   }


   #findRange(useInclusive: boolean,
      inclusiveRange: number[],
      exclusiveDepth: number,
      range?: Map<number, number[]>): Map<number, number[]> {
      if (exclusiveDepth > this.maxDimensions) {
         throw new Error(`Invalid tree height for range call: ${exclusiveDepth} greater than this.maxDimensions ${this.maxDimensions}`);
      }
      range = range === undefined ? new Map() : range;
      if (!useInclusive) {
         for (let i = 0; i < exclusiveDepth; i++) {
            range.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
         }
      } else {
         inclusiveRange = inclusiveRange?.sort((a, b) => b - a);
         if ((inclusiveRange as number[])[0] > this.maxDimensions) {
            throw new Error(`Inclusive Ranges depth too large: ${JSON.stringify(range)}`)
         }
         for (let i = 0; i < (inclusiveRange as number[]).length; i++) {
            let rangeNumber = (inclusiveRange as number[])[i];
            range.set(rangeNumber, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
         }
      }
      if (this.coordinateCount === 0) {
         return range;
      }
      this.findRangeRecursiveCall(this.root.getRoot() as AVLTreeNode<VoxelStorageNode>, range, 0, exclusiveDepth, useInclusive, inclusiveRange);
      return range;
   }
   getmaxDimensions(): number {
      return this.maxDimensions;
   }
   hasCoordinate(coordinate: E): boolean {
      const { arr } = coordinate;
      let nodeToFind = new VoxelStorageNode(arr[0]);
      if (!this.root.hasItem(nodeToFind)) {
         return false;
      }
      let currentTree: VoxelStorageNode = (this.root.getItem(nodeToFind) as AVLTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
      for (let i = 1; i < arr.length; i++) {
         if (currentTree.hasItem(arr[i])) {
            currentTree = ((currentTree.getItem(arr[i]) as AVLTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode);
         } else {
            return false;
         }
      }
      return true;
   }

   addCoordinate(coordinate: E, allowDuplicates: boolean): void {
      if (!allowDuplicates && this.hasCoordinate(coordinate)) {
         return;
      }
      this.coordinateCount += 1;
      const { arr } = coordinate;
      var currentNode: VoxelStorageNode | undefined;
      for (let i = 0; i < arr.length; i++) {
         const range: number[] = this.dimensionRange.get(i) as number[];
         if (arr[i] < range[0]) {
            range[0] = arr[i];
            range[1] = 1;
         }
         else if (arr[i] === range[0]) {
            range[1] += 1;
         }
         if (arr[i] > range[2]) {
            range[2] = arr[i];
            range[3] = 1;
         }
         else if (arr[i] === range[2]) {
            range[3] += 1;
         }
         const nodeToAdd: VoxelStorageNode = new VoxelStorageNode(arr[i]);
         if (i == 0) {
            this.root.addItem(nodeToAdd);
            currentNode = (this.root.getItem(nodeToAdd) as AVLTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
         } else {
            (currentNode as VoxelStorageNode).addItem(arr[i]);
            currentNode = ((currentNode as VoxelStorageNode).getItem(arr[i]) as AVLTreeNode<VoxelStorageNode>).getValue();
         }
      }
      if (!this.root.hasItem(new VoxelStorageNode(arr[0]))) {
         throw new Error("Internal Error")
      }
   }

   removeCoordinate(coordinate: E, calculauteRange: boolean = true): number[] {
      this.coordinateCount -= 1;
      if (!this.hasCoordinate(coordinate)) {
         throw new Error("Coordinate does not exist");
      }
      const { arr } = coordinate;
      const rangeList = [];
      let nodeToFind = new VoxelStorageNode(arr[0]);
      let nodeToReduce: AVLTreeNode<VoxelStorageNode> = this.root.getItem(nodeToFind) as AVLTreeNode<VoxelStorageNode>;
      if (nodeToReduce.getAmount() === 1) {
         rangeList.push(0);
      }
      let currentTree: VoxelStorageNode = (this.root.removeItem(nodeToFind) as AVLTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
      for (let i = 1; i < arr.length; i++) {
         nodeToReduce = currentTree.getItem(arr[i]) as AVLTreeNode<VoxelStorageNode>
         if (nodeToReduce.getAmount() === 1) {
            rangeList.push(i);
         }
         currentTree = ((currentTree.removeItem(arr[i]) as AVLTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode);
      }
      if (calculauteRange && rangeList.length > 0) {
         this.findRangeInclusive(rangeList, this.dimensionRange);
      }
      return rangeList;
   }
   /**
    * @param currentNode 
    * @param currentCoordinate 
    * @param allCoordinates 
    * @param depth 
    * @returns 
    */
   #getCoordinatesRecursiveCall(currentNode: AVLTreeNode<VoxelStorageNode>, currentCoordinate: number[], allCoordinates: E[], depth: number, duplicates: boolean) {
      if (currentNode.hasRight()) {
         let rightSubTree = currentNode.getRight() as AVLTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(rightSubTree, [...currentCoordinate], allCoordinates, depth, duplicates)
      }
      if (currentNode.hasLeft()) {
         let leftSubTree = currentNode.getLeft() as AVLTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(leftSubTree, [...currentCoordinate], allCoordinates, depth, duplicates)
      }
      if (depth >= this.maxDimensions) {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         if (duplicates) {
            for (let i = currentNode.getAmount(); i > 0; i--) {
               allCoordinates.push(this.pointFactoryMethod(currentCoordinate) as E);
            }
         } else {
            allCoordinates.push(this.pointFactoryMethod(currentCoordinate) as E);
         }
         return;
      } else {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         let downwardSubTree: AVLTreeNode<VoxelStorageNode> = (currentNode.getValue() as VoxelStorageNode).getBinarySubTreeRoot() as AVLTreeNode<VoxelStorageNode>;
         this.#getCoordinatesRecursiveCall(downwardSubTree, [...currentCoordinate], allCoordinates, ++depth, duplicates)
      }
   }

   getCoordinateList(duplicates: boolean): E[] {
      if (this.root.getRoot() === undefined) {
         return [];
      }
      let allCoordinates: E[] = [];
      this.#getCoordinatesRecursiveCall(this.root.getRoot() as AVLTreeNode<VoxelStorageNode>, [], allCoordinates, 1, duplicates);
      return allCoordinates
   }

   getBoundingBox3D(): Corners3D {
      if (this.maxDimensions < 3) {
         throw new Error("Storage tree depth is less than 3: " + this.maxDimensions);
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