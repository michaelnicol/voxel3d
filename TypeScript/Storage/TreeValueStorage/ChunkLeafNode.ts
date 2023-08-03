import { ValidObject } from "../../ValidObject.js";
import { AVLTree } from "../AVLTree.js";
import { AVLTreeNode } from "../AVLTreeNode.js";
import { TreeStorageNodeComparator } from "../TreeStorage/TreeStorageNodeComparator.js"
import { Point } from "../../Point.js";
import { cloneable } from "../../cloneable.js";
import { TreeStorageNode } from "../TreeStorage/TreeStorageNode.js";
import { Chunk } from "../ChunkStorage/Chunk.js";
import { PointStorage } from "../PointStorage.js";

export class ChunkLeafNode<E extends Point, S extends PointStorage<E>> extends TreeStorageNode {
   value!: Chunk<E,S>
   constructor(coordinateDate: number, value: Chunk<E,S>) {
      super(coordinateDate)
      this.value = value
   }
}
