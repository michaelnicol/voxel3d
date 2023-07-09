import {Utilities} from "./build/Utilities.js"
import { Point2D } from "./build/Point2D.js";
import { BoundingBox2D } from "./build/BoundingBox2D.js";

let data =  [[-4.755282402038574,4.522542476654053], [4.755282402038574,4.522542476654053], [-4.755282402038574,-4.522542476654053], [4.755282402038574,-4.522542476654053]]

let data2 = [[0,20], [20,20], [0,0], [20,0]] 

data = data.map((value) => new Point2D(value[0], value[1]))
data2 = data2.map((value) => new Point2D(value[0], value[1]))

console.log(data)

let boxOne = BoundingBox2D.createFromExtremes(data, 0)
let boxTwo = BoundingBox2D.createFromExtremes(data2, 0)

console.log(boxTwo.canDimensionsFit(boxOne))