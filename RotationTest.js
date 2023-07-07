import { Point2D } from "./build/Point2D.js"
import { Utilities } from "./build/Utilities.js"

let points = [new Point2D(0.5, -0.5), new Point2D(0.5, 0.5), new Point2D(-0.5, 0.5), new Point2D(-0.5, -0.5)]

let center = new Point2D(0,0)

let angle = 0;

Utilities.printPointList(Utilities.rotatePoint(points[0], center, 0))