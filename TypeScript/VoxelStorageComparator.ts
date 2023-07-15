import { Comparator } from "./Comparator.js";
import { VoxelStorageNode } from "./VoxelStorageNode.js";


export class VoxelStorageComparator implements Comparator<VoxelStorageNode> {
  compare(o1: VoxelStorageNode, o2: VoxelStorageNode): number {
    // // console.log("Comparing o1: "+o1.toPrint());
    // // console.log("Comparing o2: "+o2.toPrint());
      if (o1.data < o2.data) {
        return -1;
      }
      if (o1.data > o2.data) {
        return 1;
      }
      return 0;
  }
}
