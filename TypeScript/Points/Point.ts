import { ValidObject } from "../Meshes/ValidObject.js";
import { cloneable } from "../Interfaces/cloneable.js";

export interface Point extends ValidObject, cloneable<Point> {
   arr: number[];
   dimensionCount(): number;
   factoryMethod(dimensionValues: number[]): Point;
   clone(): Point
}