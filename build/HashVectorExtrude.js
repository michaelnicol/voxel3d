import { AVLPolygon } from "./AVLPolygon.js";
import { HashObject } from "./HashObject.js";
import { Utilities } from "./Utilities.js";
export class HashVectorExtrude extends HashObject {
    objectToExtrude;
    extrudeVector;
    constructor(maxDimensions, pointFactoryMethod, objectToExtrude, extrudeVector) {
        super(maxDimensions, pointFactoryMethod);
        this.extrudeVector = pointFactoryMethod(new Array(maxDimensions).fill(0));
        this.objectToExtrude = objectToExtrude;
        this.extrudeVector = extrudeVector;
    }
    /**
     * Extrude all points on the object by the given vector.
     * @param extrudeVector
     * @param shell If the object is of type AVLPolygon<E>, a shell can be computed.
     */
    extrude(extrudeVector, shell) {
        this.extrudeVector = extrudeVector;
        this.internalStorage.reset();
        if (!shell) {
            let points = this.internalStorage.getCoordinateList(false, true);
            for (let point of points) {
                this.internalStorage.addCoordinates(Utilities.bresenham(point, extrudeVector, 0), false);
            }
        }
        else {
            let assertedObject = this.objectToExtrude;
            let vertices = [...assertedObject.vertices];
            //Copy each vertex and extrude it by the extrudeVector
            let topLayer = new AVLPolygon(vertices.map((value) => this.pointFactoryMethod([...value.arr].map((v, i) => v += extrudeVector.arr[i]))));
            topLayer.createEdges().fillPolygon(assertedObject.passes, assertedObject.useSort);
            let bottomLayer = new AVLPolygon(vertices);
            bottomLayer.createEdges();
            for (let point of bottomLayer.getCoordinateList(false, true)) {
                this.addCoordinates(Utilities.bresenham(point, this.pointFactoryMethod([...point.arr].map((v, i) => v += extrudeVector.arr[i])), 0), false);
            }
            bottomLayer.fillPolygon(assertedObject.passes, assertedObject.useSort);
            this.addCoordinates(bottomLayer.getCoordinateList(false, true), false);
            this.addCoordinates(topLayer.getCoordinateList(false, true), false);
        }
        return this;
    }
}
