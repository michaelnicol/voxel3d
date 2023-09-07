import { Octree } from "../Storage/Octree/Octree.js";
import { BaseMesh } from "./BaseMesh.js";
import { Comparable } from "../Interfaces/Comparable.js";
import { TreeStorage } from "../Storage/TreeStorage/TreeStorage.js";
import { Point } from "../Points/Point.js";
import { Point3D } from "../Points/Point3D.js";
import { Utilities } from "../Utilites/Utilities.js";

export type PolygonEdgeDirectory = Record<string, Point[]>

/**
 * Generates a 3D voxel polygon.
*/
export class Triangle3D<E extends Comparable<E>> implements BaseMesh<E> {
   voxelStorage!: Octree<E>;
   v1!: Point3D;
   v2!: Point3D;
   v3!: Point3D;
   edgeDirectory: Record<string, Point3D[]> = {}
   constructor(v1: Point3D, v2: Point3D, v3: Point3D) {
      this.v1 = v1.clone();
      this.v2 = v2.clone();
      this.v3 = v3.clone();
   }
   generateEdges() {
      this.edgeDirectory["V1V2"] = Utilities.bresenham(this.v1, this.v2, 0) as Point3D[]
      this.edgeDirectory["V2V3"] = Utilities.bresenham(this.v2, this.v3, 0) as Point3D[]
      this.edgeDirectory["V3V1"] = Utilities.bresenham(this.v3, this.v1, 0) as Point3D[]
   }
   generateFill() {
      
   }
   toPrint(): string {
       return ""
   }
   preHash() {
       return this
   }
}