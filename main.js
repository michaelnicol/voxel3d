
// import { BinaryTree } from "./build/BinaryTree.js"
// import { NumberComparator } from "./build/NumberComparator.js"
// import { NumberWrapper } from "./build/NumberWrapper.js"
// import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"

let tree = new VoxelStorage(3);

let point = new Point3D(1,2,3);
let point3 = new Point3D(4,5,6);
let point4 = new Point3D(7,8,9);

tree.addCoordinate(point);
tree.addCoordinate(point3);
tree.addCoordinate(point4);


// console.log(tree.root.getItem(new VoxelStorageNode(1)).root);

// console.log(tree)