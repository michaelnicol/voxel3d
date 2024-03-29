import { Comparator } from "../../Interfaces/Comparator.js"
import { ValidObject } from "../../Meshes/ValidObject.js";
import { cloneable } from "../../Interfaces/cloneable.js";
import { TreeStorageNode } from "./TreeStorageNode.js";


export class TreeStorageNodeComparator<V extends ValidObject & cloneable<V>> implements Comparator<TreeStorageNode> {
  compare(o1: TreeStorageNode, o2: TreeStorageNode): number {
      if (o1.coordinateDate < o2.coordinateDate) {
        return -1;
      }
      if (o1.coordinateDate > o2.coordinateDate) {
        return 1;
      }
      return 0;
  }
}
