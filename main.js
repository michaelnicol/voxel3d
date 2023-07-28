import * as voxel3d from "./JavaScript/voxel3d.js"

let p1 = new voxel3d.AVLPolygon([new voxel3d.Point3D(0,0,0),new voxel3d.Point3D(5,0,0),new voxel3d.Point3D(5,5,5)], 3)

let p2 = new voxel3d.AVLPolygon([new voxel3d.Point3D(0,0,20),new voxel3d.Point3D(5,0,30),new voxel3d.Point3D(5,5,50)], 3)

p1.createEdges()
p1.fillPolygon(1, true)
p2.createEdges()
p2.fillPolygon(1, true)

console.log(p1)