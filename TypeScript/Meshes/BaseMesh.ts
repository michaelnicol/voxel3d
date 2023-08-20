import { Comparable } from "../Interfaces/Comparable.js";
import { Octree } from "../Storage/Octree/Octree.js";
import { ValidObject } from "./ValidObject.js";

export interface BaseMesh<E extends Comparable<E>> extends ValidObject {
    voxelStorage: Octree<E>
}