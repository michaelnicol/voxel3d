
import { AVLTree } from "./build/AVLTree.js"
import { NumberComparator } from "./build/NumberComparator.js"
import { NumberWrapper } from "./build/NumberWrapper.js"
import { DoublyLinkedList } from "./build/DoublyLinkedList.js"
import { VoxelStorageNode } from "./build/VoxelStorageNode.js"
import { VoxelStorage } from "./build/VoxelStorage.js"
import { Point3D } from "./build/Point3D.js"
import { BasicSetOperations } from "./build/BasicSetOperations.js"
import { HashStorage } from "./build/HashStorage.js"
import { AVLPolygon3D } from "./build/AVLPolygon3D.js"

let vertices = [new Point3D(0,0,0), new Point3D(50,0,0), new Point3D(50,50,0), new Point3D(0,50,0)]

let polygon = new AVLPolygon3D(new Point3D().factoryMethod, vertices)
polygon.createEdges();
polygon.fillPolygon();
console.log(polygon.toPrint())


