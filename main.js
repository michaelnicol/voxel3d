import { Point3D } from "../voxel3d/JavaScript/Point3D.js"
import { Octree } from "../voxel3d/JavaScript/Storage/Octree/Octree.js"
import { TestStorageValue } from "../voxel3d/JavaScript/Storage/Octree/TestStorageValue.js"

// tree.addCoordinate(new Point3D(0, 32, 0))
// tree.addCoordinate(new Point3D(1, 1, 1))

const x = 5
const y = 5
const z = 5
// for (let x = 0; x < 16; x++) {
let tree = new Octree(0, 0, 0, Math.pow(2, x)-1, Math.pow(2, y)-1, Math.pow(2, z)-1, 1)
// tree.addCoordinate(new Point3D(0,0,2), new TestStorageValue(0))
const startTime = new Date().getTime()
// tree.addCoordinate(new Point3D(0,1,0), new TestStorageValue(0))
for (let i = 0; i <= Math.pow(2, x)-1; i++) {
    let endTime = new Date().getTime()
    console.log("--> " + tree.nodeCount + ": " + (endTime - startTime) / 1000)
    for (let j = 0; j <= Math.pow(2, y)-1; j++) {
        for (let k = 0; k <= Math.pow(2, z) -1; k++) {
            tree.addCoordinate(new Point3D(i, j, k), new TestStorageValue(0))
        }
    }
}
console.log((tree))

let endTime = new Date().getTime()
console.log("--> " + tree.nodeCount + ": " + (endTime - startTime) / 1000)

// console.log(tree.hasCoordinate(new Point3D(3, 3, 3)))