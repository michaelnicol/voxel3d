
// import { BinaryTree } from "./build/BinaryTree.js"
// import { NumberComparator } from "./build/NumberComparator.js"
// import { NumberWrapper } from "./build/NumberWrapper.js"
// import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BaseObject } from "./build/BaseObject.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"

let tree1 = new BaseObject(3, new Point3D().factoryMethod);

tree1.addVoxels([new Point3D(0,0,0)])

let tree2 = new BaseObject(3, new Point3D().factoryMethod);

tree2.addVoxels([new Point3D(0,0,1)])

console.log(BasicSetOperations.UNION([tree1, tree2], true))





// console.log(tree.root.getItem(new VoxelStorageNode(1)).root);

// console.log(tree)