
import { AVLTree } from "./build/AVLTree.js"
import { NumberComparator } from "./build/NumberComparator.js"
import { NumberWrapper } from "./build/NumberWrapper.js"
import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"
import { HashStorage } from "./build/HashStorage.js"
import { AVLPolygon } from "./build/AVLPolygon.js"
import { Point2D } from "./build/Point2D.js"

// let vertices = [new Point3D(2,0,0),new Point3D(0,2,0),new Point3D(2,2,0)]

// let polygon = new AVLPolygon(new Point3D().factoryMethod, new Point2D().factoryMethod, vertices)

// polygon.createEdges();
// polygon.fillPolygon();

let tree = new AVLTree(undefined, new NumberComparator())

let amount = 100000

for (let i = 0; i < amount; i++) {
   // console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ")
   // console.log(" --- Adding node: "+i+" --- ")
   tree.addItem(new NumberWrapper(i))
   // console.log(tree.toPrint())
   tree.confirmRotations()
   // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n")
}

console.log("Final Tree")
console.log(tree.toPrint())

for (let i = 0; i < amount; i++) {
   // console.log("\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ")
   // console.log(" --- Deleting node: "+i+" --- ")
   tree.removeItem(new NumberWrapper(i))
   // console.log("Printing Tree")
   // console.log(tree.toPrint())
   tree.confirmRotations()
   // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n\n")
}

console.log(tree.toPrint())

