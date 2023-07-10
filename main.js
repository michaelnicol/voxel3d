import { Utilities } from "./build/Utilities.js"
import { Point2D } from "./build/Point2D.js";
import { BoundingBox2D } from "./build/BoundingBox2D.js";

let data2 = 
[[18,20], [20,20], [18,-1.1102230246251565e-16], [20,0]] 
let data1 = 
[[-1.5,1.5], [1.5,1.5], [-1.5,-1.5], [1.5,-1.5]] 

data2 = data2.map((value) => new Point2D(value[0], value[1]))
data1 = data1.map((value) => new Point2D(value[0], value[1]))

let boxTwo = BoundingBox2D.createFromExtremes(data2, 0)
let boxOne = BoundingBox2D.createFromExtremes(data1, 0)

console.log(boxTwo)
console.log(boxOne)

console.log(boxOne.canDimensionsFit(boxTwo))