import { Point3D } from "./Point3D.js";
import { ValidObject } from "./ValidObject.js";

export type BoundingBox3D = {
   /**
    * X-Low, Y-Low, Z-Low
    */
   "0": Point3D;
   /**
    * X-High, Y-Low, Z-Low
    */
   "1": Point3D
   /**
    * X-Low, Y-High, Z-Low
    */
   "2": Point3D
   /**
    * X-High, Y-High, Z-Low
    */
   "3": Point3D
   /**
    * X-Low, Y-Low, Z-High
    */
   "4": Point3D
   /**
    * X-High, Y-Low, Z-High
    */
   "5": Point3D
   /**
    * X-Low, Y-High, Z-High
    */
   "6": Point3D
   /**
    * X-High, Y-High, Z-High
    */
   "7": Point3D
}