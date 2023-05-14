import { BinaryTreeNode } from "./BinaryTreeNode.js";
import { ValidObject } from "./ValidObject.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";
import { Point } from "./Point.js";
import { BinaryTree } from "./BinaryTree.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";
export class VoxelStorage<E extends Point> implements ValidObject {

   root: BinaryTree<VoxelStorageNode> = new BinaryTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   private maxDepth: number = -1;
   constructor(maxDepth: number) {
      if (maxDepth < 1) {
         throw new Error("Invalid Depth: Can not be less than 1")
      }
      this.maxDepth = maxDepth;
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
      let nodeToFind = new VoxelStorageNode(arr[0]);
      let currentTree: VoxelStorageNode = (this.root.removeItem(nodeToFind) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode;
      for (let i = 1; i < arr.length; i++) {
         currentTree = ((currentTree.removeItem(arr[i]) as BinaryTreeNode<VoxelStorageNode>).getValue() as VoxelStorageNode);
      }
   }

   private getCoordinatesRecursiveCall(currentNode: BinaryTreeNode<VoxelStorageNode>, currentCoordinate: number[], allCoordinates: number[][], depth: number) {
      console.log("On Current Node: "+currentNode.toPrint()+" | "+depth);
      console.log("Current Coordinate: "+JSON.stringify(currentCoordinate)+" | "+depth)
      if (currentNode.hasRight()) {
         let rightSubTree = currentNode.getRight() as BinaryTreeNode<VoxelStorageNode>;
         console.log("-Going Rightwards"+" | "+depth)
         this.getCoordinatesRecursiveCall(rightSubTree, [...currentCoordinate], allCoordinates, depth)
      }
      if (currentNode.hasLeft()) {
         let leftSubTree = currentNode.getLeft() as BinaryTreeNode<VoxelStorageNode>;
         console.log("-Going leftwards"+" | "+depth)
         this.getCoordinatesRecursiveCall(leftSubTree, [...currentCoordinate], allCoordinates, depth)
      }
      if (depth >= this.maxDepth) {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         for (let i = currentNode.getAmount(); i > 0; i--) {
            allCoordinates.push([...currentCoordinate]);
         }
         console.log("-Depth is greater, returning: "+(JSON.stringify(currentCoordinate))+" | "+depth)
         return;
      } else {
         currentCoordinate.push((currentNode.getValue() as VoxelStorageNode).getData())
         let downwardSubTree: BinaryTreeNode<VoxelStorageNode> = (currentNode.getValue() as VoxelStorageNode).getBinarySubTreeRoot() as BinaryTreeNode<VoxelStorageNode>;
         console.log("-Going Downwards | "+depth)
         this.getCoordinatesRecursiveCall(downwardSubTree, [...currentCoordinate], allCoordinates, ++depth)
      }
   }

   getCoordinateList(): number[][] {
      if (this.root.getRoot() === undefined) {
         return [];
      }
      let allCoordinates: number[][] = [];
      this.getCoordinatesRecursiveCall(this.root.getRoot() as BinaryTreeNode<VoxelStorageNode>, [], allCoordinates, 1);
      return allCoordinates
   }

   preHash(): VoxelStorage<E> {
      return this;
   }
   toPrint(): string {
      return "";
   }
}