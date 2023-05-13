import { BinaryTreeNode } from "./BinaryTreeNode";
import { ValidObject } from "./ValidObject";
import { VoxelStorageNode } from "./VoxelStorageNode";
import { Point } from "./Point";
export class VoxelStorage implements ValidObject {

   root: VoxelStorageNode | undefined;

   constructor() {}

   hasNumber(coordinate: Point): boolean {
      if (this.root === undefined) {
         return false;
      }
      const { arr } = coordinate;
      let currentDem: VoxelStorageNode = this.root as VoxelStorageNode;
      for (let i = 0; i < arr.length; i++) {
         const value = arr[i];
         if (currentDem.getItem(value) === undefined) {
            return false
         }
      }
      return true;
   }

   addNumber(coordinate: Point): void {
      const { arr } = coordinate;
      let currentDem: VoxelStorageNode | undefined = this.root;
      for (let i = 0; i < arr.length; i++) {
         const value = arr[i];
         if (i == 0 && currentDem === undefined) {
            this.root = new VoxelStorageNode(value);
         }
         let assertedCurrentDem = currentDem as VoxelStorageNode;
         currentDem = assertedCurrentDem.addItem(value).getValue();
      }
   }

   removeNumber(coordinate: Point): void {
      const { arr } = coordinate;
      let currentDem: VoxelStorageNode | undefined = this.root;
      for (let i = 0; i < arr.length; i++) {
         const value = arr[i];
         let assertedCurrentDem = currentDem as VoxelStorageNode;
         currentDem = (assertedCurrentDem.removeItem(value) as BinaryTreeNode<VoxelStorageNode>).getValue();
      }
   }

   preHash() {
      return this;
   }
   toPrint(): string {
       return "";
   }
}