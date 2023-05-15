
// import { BinaryTree } from "./build/BinaryTree.js"
// import { NumberComparator } from "./build/NumberComparator.js"
// import { NumberWrapper } from "./build/NumberWrapper.js"
// import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"

let tree = new VoxelStorage(3);

const min = 10;
const max = 0;

for (let i = 0; i < 100000; i++) {
   tree.addCoordinate(new Point3D(Math.floor(Math.random() * (max - min) + min), Math.floor(Math.random() * (max - min) + min), Math.floor(Math.random() * (max - min) + min)))
}

console.log(JSON.stringify(tree.getCoordinateList()))

// console.log(tree.root.getItem(new VoxelStorageNode(1)).root);

// console.log(tree)