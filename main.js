import { Point3D } from "../voxel3d/JavaScript/Point3D.js"
import { Octree } from "../voxel3d/JavaScript/Storage/Octree/Octree.js"

let tree = new Octree(0, 0, 0, 32, 32, 32)

tree.addCoordinate(new Point3D(0, 0, 0))
// for (let i = 0; i < 32; i++) {
//     console.log(i,i,i)
//     tree.addCoordinate(new Point3D(i, i, i))
// }

console.log(JSON.stringify(tree, null, 4))
// console.log(tree.hasCoordinate(new Point3D(3, 3, 3)))