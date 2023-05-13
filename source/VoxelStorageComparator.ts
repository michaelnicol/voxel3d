import { Comparator } from "./Comparator";
import { VoxelStorageNode } from "./VoxelStorageNode";


export class VoxelStorageComparator implements Comparator<VoxelStorageNode> {
  compare(o1: VoxelStorageNode, o2: VoxelStorageNode): number {
      if (o1.data < o2.data) {
        return -1;
      }
      if (o1.data > o2.data) {
        return 1;
      }
      return 0;
  }
}
