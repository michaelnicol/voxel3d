import { ValidObject } from "./ValidObject.js";

export interface Point extends ValidObject{
   arr: number[];
   dimensionCount(): number;
}