import { AVLObject } from "./AVLObject.js";
import { Utilities } from "./Utilities.js";
import { VoxelStorage } from "./VoxelStorage.js";
export class AVLPolygon3D extends AVLObject {
    vertices = [];
    constructor(pointFactoryMethod, v) {
        super(3, pointFactoryMethod);
        for (let coord of v) {
            this.vertices.push(coord.clone());
            this.internalStorage.addCoordinate(coord, false);
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
        let x = [...p2d.arr];
        x.splice(insertionIndex, 0, insertionValue);
        return this.pointFactoryMethod(x);
    }
    fillPolygon() {
        let rangeCoordinates = AVLObject.getSortedRange(this.internalStorage);
        let TS_REF = this;
        // Just for laughs, here is the entire 3D polygon rasterization interface in one line 
        return rangeCoordinates[0].forEach(function (value, key) { value.length >= 2 ? TS_REF.addCoordinates(Utilities.brensenham(value[0], value[value.length - 1], 0).reduce(function (accumulator, currentValue) { return accumulator.push(TS_REF.convert2Dto3D(currentValue, rangeCoordinates[1][0], key)), accumulator; }, []), false) : value.length === 1 ? TS_REF.internalStorage.addCoordinate(TS_REF.convert2Dto3D(value[0], rangeCoordinates[1][0], key), false) : null; }), this;
    }
}
