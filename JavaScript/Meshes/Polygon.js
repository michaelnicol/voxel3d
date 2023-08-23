// import { Octree } from "../Storage/Octree/Octree.js";
// import { BaseMesh } from "./BaseMesh.js";
// import { Comparable } from "../Interfaces/Comparable.js";
// import { TreeStorage } from "../Storage/TreeStorage/TreeStorage.js";
// import { Point } from "../Points/Point.js";
// import { Point3D } from "../Points/Point3D.js";
export {};
// export type PolygonEdgeDirectory = Record<string, Point[]>
// /**
//  * Generates a 3D voxel polygon.
//  * 
//  * The storage of voxels is split up between three storage data structures for optimizations.
//  */
// export class Polygon3D<E extends Comparable<E>> implements BaseMesh<E> {
//     /**
//      * Stores all of the voxels for the fill of the shape.
//      * 
//      * The voxelStorage will not store any voxels until the fill has been generated. If only the vertices or edges are generated,
//      * it will be stored in the edgeStorage or vertices.
//      */
//     voxelStorage!: Octree<E>;
//     edgeStorage: PolygonEdgeDirectory = {}
//     vertices: Point3D[] = []
//     constructor(vertices: Point3D[]) {
//         for (let i = 0; i < vertices.length; i++) {
//             this.vertices.push(vertices[i].clone())
//         }
//     }
// }
