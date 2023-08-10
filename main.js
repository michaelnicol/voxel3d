import { Point3D } from "../voxel3d/JavaScript/Point3D.js"
import { Octree } from "../voxel3d/JavaScript/Storage/Octree/Octree.js"

let tree = new Octree(0, 0, 0, 32, 32, 32)

tree.addCoordinate(new Point3D(0,0,0))

// for (let i = 0; i < 32; i++) {
//     tree.addCoordinate(new Point3D(i, i, i))
// }