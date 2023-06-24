import { AVLObject } from "./AVLObject.js";
import { HashObject } from "./HashObject.js";
import { Point } from "./Point.js";

export type BaseObject<E> = HashObject<Point> | AVLObject<Point, Point>
