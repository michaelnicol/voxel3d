
import { AVLTree } from "./build/AVLTree.js"
import { NumberComparator } from "./build/NumberComparator.js"
import { NumberWrapper } from "./build/NumberWrapper.js"
import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"
import { HashStorage } from "./build/HashStorage.js"


let amounts = []
let hash = []
let voxel = []

for (let i = 0; i < 2500000; i+=10000) {
   amounts.push(i)
}

for (let i = 0; i < amounts.length; i++) {

   let amount = amounts[i]

   let simple = new HashStorage(3, new Point3D().factoryMethod);

   let start = (new Date()).getTime();

   for (let i = 0; i < amount; i++) {
      simple.addCoordinate(new Point3D(i, i, i))
   }

   let d = ((new Date()).getTime() - start);

   // console.log("Hash | " + (d) + (" ".repeat(8-(""+d).length)) + " | " + amount)
   hash.push(d);

   let base = new VoxelStorage(3, new Point3D().factoryMethod);

   start = (new Date()).getTime();

   for (let i = 0; i < amount; i++) {
      base.addCoordinate(new Point3D(i, i, i), true)
   }
   d = ((new Date()).getTime() - start);
   // console.log("AVL  | " + (d) + (" ".repeat(8-(""+d).length)) + " | " + amount)
   voxel.push(d);

}

// console.log(JSON.stringify(amounts)+"\n\n")
// console.log(JSON.stringify(hash)+"\n\n")
// console.log(JSON.stringify(voxel)+"\n\n")
