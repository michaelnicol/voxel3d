
import { AVLTree } from "./build/AVLTree.js"
import { NumberComparator } from "./build/NumberComparator.js"
import { NumberWrapper } from "./build/NumberWrapper.js"
import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BaseObject } from "./build/BaseObject.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"

let tree = new AVLTree(undefined, new NumberComparator());

for (let i = 0; i < 500; i++) {
   tree.addItem(new NumberWrapper(i))
}


console.log("Final tree: \n"+tree.toPrint())

// console.log(tree)




// console.log(tree.root.getItem(new VoxelStorageNode(1)).root);

// console.log(tree)