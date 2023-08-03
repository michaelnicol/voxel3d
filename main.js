// import * as voxel3d from "./JavaScript/voxel3d.js"

// let p1 = new voxel3d.Polygon([new voxel3d.Point3D(0,0,0),new voxel3d.Point3D(5,0,0),new voxel3d.Point3D(5,5,5)], 3)

// let p2 = new voxel3d.Polygon([new voxel3d.Point3D(0,0,20),new voxel3d.Point3D(5,0,30),new voxel3d.Point3D(5,5,50)], 3)

// p1.createEdges()
// p1.fillPolygon(1, true)
// p2.createEdges()
// p2.fillPolygon(1, true)

// console.log(p1)

import { HashStorage } from "./JavaScript/HashStorage.js";
import { Point3D } from "./JavaScript/Point3D.js";
import { PointFactoryMethods } from "./JavaScript/PointFactoryMethods.js";
import { TreeStorage } from "./JavaScript/TreeStorage.js"
import { ChunkManager } from "./JavaScript/ChunkManager.js"

let current = 0;
let storage = new ChunkManager(3, new Point3D(5,5,5), 1)
let factoryMethod = PointFactoryMethods.getFactoryMethod(3)
const startTime = new Date().getTime()
while (true) {
    try {
        let point = []
        for (let j = 0; j < 3; j++) {
            point.push(current)
        }
        storage.addCoordinate(factoryMethod(point), false)
        current += 1
        if (current % 100000 === 0) {
            const currentTime = new Date().getTime()
            const time = (currentTime - startTime)
            console.log(current+" | "+(time)+" ms | "+Math.floor(time/1000)+" s"+" | "+storage.allCoordinateCount+" | "+storage.chunks.size)
        }
    } catch (e) {
        console.log(e)
        console.log("Current: " + current)
        console.log("Coordinate Count: " + storage.allCoordinateCount)
    }
}

console.log(storage.toPrint())
console.log("Finished")

// let storage = new HashStorage(3)
// storage.addCoordinate(new Point3D(0,0,0), false)
// console.log(storage.uniqueCoordinateCount)

// console.log(storage.getCoordinates(true, false))

// Internal hashes
// 64 x 64 x 64 = 5.7 million max storage
// 100 x 100 x 100 = 5.7 million max storage
// 5 x 5 x 5 = 4.5 million max storage