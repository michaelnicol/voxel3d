import { AVLTree } from "./AVLTree.js";
import { ValidObject } from "./ValidObject.js";
import { AVLTreeNode } from "./AVLTreeNode.js";
import { VoxelStorageComparator } from "./VoxelStorageComparator.js";

export class VoxelStorageNode implements ValidObject {
   data: number;
   binarySubtree: AVLTree<VoxelStorageNode> = new AVLTree<VoxelStorageNode>(undefined, new VoxelStorageComparator());
   constructor(data: number) {
      this.data = data;
   }
   getBinarySubTreeRoot(): AVLTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.getRoot();
   }

   removeItem(numberToRemove: number): AVLTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.removeItem(new VoxelStorageNode(numberToRemove));
   }

   addItem(numberToAdd: number): AVLTreeNode<VoxelStorageNode> {
      return this.binarySubtree.addItem(new VoxelStorageNode(numberToAdd));
   }

   getItem(numberToCheck: number): AVLTreeNode<VoxelStorageNode> | undefined {
      return this.binarySubtree.getItem(new VoxelStorageNode(numberToCheck));
   }

   hasItem(numberToCheck: number): boolean {
      return this.binarySubtree.hasItem(new VoxelStorageNode(numberToCheck));
   }

   getBinarySubTree(): AVLTree<VoxelStorageNode> {
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
