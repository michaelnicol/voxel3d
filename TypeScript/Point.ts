import { ValidObject } from "./ValidObject.js";
import { cloneable } from "./cloneable.js";

export interface Point extends ValidObject, cloneable<Point> {
   arr: number[];
   dimensionCount(): number;
   factoryMethod(dimensionValues: number[]): Point;
   clone(): Point
}