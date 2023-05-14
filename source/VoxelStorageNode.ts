import { BinaryTree } from "./BinaryTree.js";
import { ValidObject } from "./ValidObject.js";
import { BinaryTreeNode } from "./BinaryTreeNode.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";

export class VoxelStorageNode implements ValidObject {
   data: number;
   binarySubtree: BinaryTree<VoxelStorageNode> = new BinaryTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   constructor(data: number) {
      this.data = data;
   }
   getBinarySubTreeRoot(): BinaryTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.getRoot();
   }

   removeItem(numberToRemove: number): BinaryTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.removeItem(new VoxelStorageNode(numberToRemove));
   }

   addItem(numberToAdd: number): BinaryTreeNode<VoxelStorageNode> {
      return this.binarySubtree.addItem(new VoxelStorageNode(numberToAdd));
   }

   getItem(numberToCheck: number): BinaryTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.getItem(new VoxelStorageNode(numberToCheck));
   }

   hasItem(numberToCheck: number): boolean {
      return this.binarySubtree.hasItem(new VoxelStorageNode(numberToCheck));
   }

   getBinarySubTree(): BinaryTree<VoxelStorageNode> {
      return this.binarySubtree;
   }

   getData(): number {
      return this.data;
   }

   preHash(): number {
      return this.data;
   }
   toPrint(): string {
       return `Data: ${this.data}, SubNodes: ${this.binarySubtree.size()}`
   }
}
