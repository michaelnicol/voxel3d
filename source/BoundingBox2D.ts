import { Point2D } from "./Point2D.js";
import { ValidObject } from "./ValidObject.js";

export type BoundingBox2D = {
   /**
    * X-Low, Y-LoW
    */
   "0": Point2D;
   /**
    * X-High, Y-Low
    */
   "1": Point2D
   /**
    * X-Low, Y-High
    */
   "2": Point2D
   /**
    * X-High, Y-High
    */
   "3": Point2D
}