import { AVLObject } from "./AVLObject.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";
export class AVLPolygon3D extends AVLObject {
    vertices = [];
    constructor(pointFactoryMethod, v) {
        super(3, pointFactoryMethod);
        for (let coord of v) {
            this.vertices.push(coord.clone());
        }
    }
    createEdges() {
        this.internalStorage = new VoxelStorage(3, this.pointFactoryMethod);
        for (let i = 0; i < this.vertices.length; i++) {
            if (i + 1 === this.vertices.length) {
                this.internalStorage, this.addCoordinates(Utilities.brensenham(this.vertices[i], this.vertices[0], 0), false);
            }
            else {
                this.internalStorage, this.addCoordinates(Utilities.brensenham(this.vertices[i], this.vertices[i + 1], 0), false);
            }
        }
        return this;
    }
    convert2Dto3D(p2d, insertionIndex, insertionValue) {
        return this.pointFactoryMethod([...p2d.arr].splice(insertionIndex, 0, insertionValue));
    }
    fillPolygon() {
        let rangeCoordinates = AVLObject.getSortedRange(this.internalStorage);
        let sortedCoordinates = rangeCoordinates[0];
        let largestDepth = rangeCoordinates[1];
        let TS_REF = this;
        for (let [key, value] of sortedCoordinates) {
            if (value.length >= 2) {
                this.addCoordinates(Utilities.brensenham(value[0], value[1], 0).reduce(function (accumulator, currentValue) {
                    return accumulator.push(TS_REF.convert2Dto3D(currentValue, largestDepth, key)), accumulator;
                }, []), false);
            }
            else if (value.length === 1) {
                this.internalStorage.addCoordinate(TS_REF.convert2Dto3D(value[0], largestDepth, key), false);
            }
        }
        return this;
    }
}
