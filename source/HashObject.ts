import { HashStorage } from "./HashStorage.js";
import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";

export class HashObject<E extends Point> implements ValidObject {
   internalStorage: HashStorage<E>;
   pointFactoryMethod: Function;
   maxDimensions: number;
   constructor(maxDimensions: number, pointFactoryMethod: Function) {
      this.maxDimensions = maxDimensions;
      this.pointFactoryMethod = pointFactoryMethod;
      this.internalStorage = new HashStorage<E>(maxDimensions, pointFactoryMethod)
   }

   setStorage(newStorage: HashStorage<E>) {
      this.internalStorage = newStorage;
   }

   hasCoordinate(p: E): boolean {
      return this.internalStorage.hasCoordinate(p);
   }

   getFactoryMethod(): Function {
      return this.pointFactoryMethod;
   }

   getMaxDimensions(): number {
      return this.maxDimensions;
   }

   getCoordinateCount(): number {
      return this.internalStorage.getCoordinateCount();
   }

   getCoordinateList(duplicates: boolean): E[] {
      return this.internalStorage.getCoordinateList(duplicates);
   }

   addCoordinates(coordinatesToAdd: E[], allowDuplicates: boolean): HashObject<E> {
      for (let c of coordinatesToAdd) {
         this.internalStorage.addCoordinate(c, allowDuplicates);
      }
      return this;
   }

   removeVoxels(coordinatesToRemove: E[]): HashObject<E> {
      for (let c of coordinatesToRemove) {
         this.internalStorage.removeCoordinate(c);
      }
      return this;
   }

   preHash(): HashObject<E> {
      return this;
   }

   toPrint(): string {
      return ""+this.internalStorage.getCoordinateList(true);
   }
}