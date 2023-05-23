
import { AVLTree } from "./build/AVLTree.js"
import { NumberComparator } from "./build/NumberComparator.js"
import { NumberWrapper } from "./build/NumberWrapper.js"
import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"
import { HashStorage } from "./build/HashStorage.js"

let tree = new AVLTree(undefined, new NumberComparator())

for (let i = 0; i < 100; i++) {
   console.log("\n ----- adding item: "+i+" ------ \n")
   console.log("> Before: \n"+tree.toPrint())
   tree.addItem(new NumberWrapper(i))
   console.log("> After: \n"+tree.toPrint())
   console.log("\n ----------- \n")
}

for (let i = 0; i < 100; i++) {
   console.log("\n---- Deleting ----\n")
   console.log("Before \n"+tree.toPrint())
   console.log(i)
   tree.removeItem(new NumberWrapper(i))
   console.log("After \n"+tree.toPrint())
}
