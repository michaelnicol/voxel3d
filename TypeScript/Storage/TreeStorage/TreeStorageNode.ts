import { ValidObject } from "../../Meshes/ValidObject.js";
import { AVLTree } from "../AVL/AVLTree.js";
import { AVLTreeNode } from "../AVL/AVLTreeNode.js";
import { TreeStorageNodeComparator } from "./TreeStorageNodeComparator.js";
import { Point } from "../../Points/Point.js";
import { cloneable } from "../../Interfaces/cloneable.js";

export class TreeStorageNode implements ValidObject {
   coordinateDate: number = 0;
   binarySubtree: AVLTree<TreeStorageNode> = new AVLTree<TreeStorageNode>(undefined, new TreeStorageNodeComparator());
   constructor(coordinateDate: number) {
      this.coordinateDate = coordinateDate
   }
   getBinarySubTreeRoot(): AVLTreeNode<TreeStorageNode> | undefined {
      return this.binarySubtree.getRoot();
   }

   removeItem(coordinateDate: number): AVLTreeNode<TreeStorageNode> | undefined {
      return this.binarySubtree.removeItem(new TreeStorageNode(coordinateDate));
   }

   addItem(coordinateDate: number): AVLTreeNode<TreeStorageNode> {
      return this.binarySubtree.addItem(new TreeStorageNode(coordinateDate));
   }

   getItem(coordinateDate: number): AVLTreeNode<TreeStorageNode> | undefined {
      return this.binarySubtree.getItem(new TreeStorageNode(coordinateDate));
   }

   hasItem(coordinateDate: number): boolean {
      return this.binarySubtree.hasItem(new TreeStorageNode(coordinateDate));
   }

   getBinarySubTree(): AVLTree<TreeStorageNode> {
      return this.binarySubtree;
   }

   getData(): number {
      return this.coordinateDate;
   }

   preHash(): number {
      return this.coordinateDate;
   }
   toPrint(): string {
      return `Data: ${this.toPrint()}, SubNodes: ${this.binarySubtree.size(true)}`
   }
}
