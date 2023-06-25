import { VoxelStorage } from "./VoxelStorage.js";
import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";

export class AVLObject<E extends Point, K extends Point> implements ValidObject {
   internalStorage: VoxelStorage<E>;
   pointFactoryMethod: Function;
   dimensionLowerFactoryMethod: Function;
   maxDimensions: number;
   constructor(maxDimensions: number, pointFactoryMethod: Function, dimensionLowerFactoryMethod: Function) {
      this.maxDimensions = maxDimensions;
      this.pointFactoryMethod = pointFactoryMethod;
      this.dimensionLowerFactoryMethod = dimensionLowerFactoryMethod;
      this.internalStorage = new VoxelStorage<E>(maxDimensions, pointFactoryMethod)
   }

   setStorage(newStorage: VoxelStorage<E>) {
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

   getCoordinateList(duplicates: boolean, instances: boolean): E[] | number[][] {
      return this.internalStorage.getCoordinateList(duplicates, instances);
   }

   addCoordinates(coordinatesToAdd: E[], allowDuplicates: boolean): AVLObject<E, K> {
      for (let c of coordinatesToAdd) {
         this.internalStorage.addCoordinate(c, allowDuplicates);
      }
      return this;
   }

   removeVoxels(coordinatesToRemove: E[]): AVLObject<E,K> {
      let removeRanges: number[] = [];
      for (let c of coordinatesToRemove) {
         removeRanges.push(...this.internalStorage.removeCoordinate(c, false));
      }
      this.internalStorage.findRangeInclusive(removeRanges);
      return this;
   }

   getSortedRange(targetDimension: number): [Map<number, K[]>, number[]] {
      let rangeCoordinates = new Map<number, K[]>();
      let points: E[] = this.internalStorage.getCoordinateList(false, false) as E[];
      let storageRange: Map<number, number[]> = this.internalStorage.dimensionRange;
      let longestRangeKeys = this.internalStorage.getSortedRangeIndices()
      let longestRangeKey = longestRangeKeys[targetDimension]
      // needs to be a sorted list. Maybe range should produce it.
      for (let i = (storageRange.get(longestRangeKey) as number[])[0]; i <= (storageRange.get(longestRangeKey) as number[])[2]; i++) {
         rangeCoordinates.set(i, [])
      }
      // Storage best case is O(0.5N) = O(N), worst case is still O(N)
      for (let coord of points) {
         (rangeCoordinates.get(coord.arr[longestRangeKey]) as K[]).push(this.dimensionLowerFactoryMethod([...coord.arr].filter((v, i) => i != longestRangeKey)))
      }
      for (let [key, value] of rangeCoordinates) {
         value.sort((a, b) => Utilities.pythagorean(a, b))
      }
      return [rangeCoordinates, longestRangeKeys]
   }

   getRanges(): Map<number, number[]> {
      let mapToReturn: Map<number, number[]> = new Map<number, number[]>();
      for (let [key, value] of this.internalStorage.dimensionRange) {
         mapToReturn.set(key, [...value])
      }
      return mapToReturn;
   }

   preHash(): AVLObject<E, K> {
      return this;
   }

   toPrint(): string {
      let list: E[] = this.internalStorage.getCoordinateList(true, false) as E[];
      let str = "[";
      for (let i = 0; i < list.length; i++) {
         str += list[i].toPrint()
         if (i + 1 != list.length) {
            str += ","
         }
      }
      return str + "]"
   }
}