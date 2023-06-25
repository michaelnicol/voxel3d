import { HashObject } from "./HashObject.js";
import { HashStorage } from "./HashStorage.js";
import { Point } from "./Point.js";
import { Utilities } from "./Utilities.js"

export class HashLinearLine<E extends Point> extends HashObject<E> {
   startPoint!: E;
   endPoint!: E;
   constructor(maxDimensions: number, pointFactoryMethod: Function, startPoint: E, endPoint: E) {
      super(maxDimensions, pointFactoryMethod)
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.internalStorage.addCoordinate(startPoint, false);
      this.internalStorage.addCoordinate(endPoint, false);
   }
   generateLine(): HashLinearLine<E> {
      this.setStorage(Utilities.bresenham(this.startPoint, this.endPoint, 2) as HashStorage<E>);
      return this;
   }
   changeEndPoints(startPoint: E, endPoint: E): HashLinearLine<E> {
      this.startPoint = startPoint;
      this.endPoint = endPoint;
      this.setStorage(new HashStorage<E>(this.maxDimensions, this.pointFactoryMethod));
      this.internalStorage.addCoordinate(startPoint, false);
      this.internalStorage.addCoordinate(endPoint, false);
      return this;
   }
}

