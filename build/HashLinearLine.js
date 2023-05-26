import { HashObject } from "./HashObject.js";
import { HashStorage } from "./HashStorage.js";
import { Utilities } from "./Utilities.js";
export class HashLinearLine extends HashObject {
    startPoint;
    endPoint;
    constructor(maxDimensions, pointFactoryMethod, startPoint, endPoint) {
        super(maxDimensions, pointFactoryMethod);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.internalStorage.addCoordinate(startPoint, false);
        this.internalStorage.addCoordinate(endPoint, false);
    }
    generateLine() {
        this.setStorage(Utilities.brensenham(this.startPoint, this.endPoint, 2));
        return this;
    }
    changeEndPoints(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.setStorage(new HashStorage(this.maxDimensions, this.pointFactoryMethod));
        this.internalStorage.addCoordinate(startPoint, false);
        this.internalStorage.addCoordinate(endPoint, false);
        return this;
    }
}
