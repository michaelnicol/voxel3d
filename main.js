import { Point3D } from "../voxel3d/JavaScript/Point3D.js"
import { Octree } from "../voxel3d/JavaScript/Storage/Octree/Octree.js"
import { TestStorageValue } from "../voxel3d/JavaScript/Storage/Octree/TestStorageValue.js"

// tree.addCoordinate(new Point3D(0, 32, 0))
// tree.addCoordinate(new Point3D(1, 1, 1))

const x = 1
// for (let x = 0; x < 16; x++) {
let tree = new Octree(0, 0, 0, Math.pow(2, x)-1, Math.pow(2, x)-1, Math.pow(2, x)-1, 1)
const startTime = new Date().getTime()
for (let i = 0; i <= Math.pow(2, x)-1; i++) {
    for (let j = 0; j <= Math.pow(2, x)-1; j++) {
        const endTime = new Date().getTime()
        console.log("--> " + tree.nodeCount + ": " + (endTime - startTime) / 1000)
        for (let k = 0; k <= Math.pow(2, x) -1; k++) {
            console.log("Coord")
            console.log(i,j,k)
            tree.addCoordinate(new Point3D(i, j, k), new TestStorageValue(0))
        }
    }
}

// tree.compressNode()
console.log(JSON.stringify(tree, null, 4))


// console.log(tree.hasCoordinate(new Point3D(3, 3, 3)))