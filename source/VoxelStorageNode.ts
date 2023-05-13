import { BinaryTree } from "./BinaryTree";
import { ValidObject } from "./ValidObject";
import { BinaryTreeNode } from "./BinaryTreeNode";
import { VoxelStorageComparator } from "./VoxelStorageComparator";

export class VoxelStorageNode implements ValidObject {
   data: number;
   binarySubtree: BinaryTree<VoxelStorageNode> = new BinaryTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   constructor(data: number) {
      this.data = data;
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

   preHash() {
       this.data;
   }
   toPrint(): string {
       return `${this.data}, SubNodes: ${this.binarySubtree.size()}`
   }
}
