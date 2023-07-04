import { ValidObject } from "./ValidObject.js";
import { cloneable } from "./cloneable.js";

export interface Point extends ValidObject, cloneable<Point> {
   dimensions: Map<string, number>;
   arr: number[];
   dimensionCount(): number;
   factoryMethod(dimensionValues: number[]): Point;
   getCoordinateValue(key: string): number | undefined
   clone(): Point
}