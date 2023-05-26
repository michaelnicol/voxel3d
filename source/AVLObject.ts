import { VoxelStorage } from "./VoxelStorage.js";
import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";
import { Point2D } from "./Point2D.js";
import { Point3D } from "./Point3D.js";
import { Utilities } from "./Utilities.js";

export class AVLObject<E extends Point> implements ValidObject {
   internalStorage: VoxelStorage<E>;
   pointFactoryMethod: Function;
   maxDimensions: number;
   constructor(maxDimensions: number, pointFactoryMethod: Function) {
      this.maxDimensions = maxDimensions;
      this.pointFactoryMethod = pointFactoryMethod;
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

   getCoordinateList(duplicates: boolean): E[] {
      return this.internalStorage.getCoordinateList(duplicates);
   }

   addCoordinates(coordinatesToAdd: E[], allowDuplicates: boolean): AVLObject<E> {
      for (let c of coordinatesToAdd) {
         this.internalStorage.addCoordinate(c, allowDuplicates);
      }
      return this;
   }

   removeVoxels(coordinatesToRemove: E[]): AVLObject<E> {
      let removeRanges: number[] = [];
      for (let c of coordinatesToRemove) {
         removeRanges.push(...this.internalStorage.removeCoordinate(c, false));
      }
      this.internalStorage.findRangeInclusive(removeRanges, this.internalStorage.dimensionRange);
      return this;
   }

   static getSortedRange(internalStorage: VoxelStorage<Point3D>): [Map<number, Point2D[]>, number[]] {
      let rangeCoordinates = new Map<number, Point2D[]>();
      let points: Point3D[] = internalStorage.getCoordinateList(false);
      let storageRange: Map<number, number[]> = internalStorage.dimensionRange;
      let longestRangeKeys = internalStorage.getSortedRangeIndices()
      let longestRangeKey = longestRangeKeys[0]
      // needs to be a sorted list. Maybe range should produce it.
      let longestRangeSize = 0;
      for (let i = (storageRange.get(longestRangeKey) as number[])[0]; i <= (storageRange.get(longestRangeKey) as number[])[2]; i++) {
         rangeCoordinates.set(i, [])
      }
      // Storage best case is O(0.66N) = O(N), worst case is still O(N)
      for (let coord of points) {
         const { arr } = coord;
         if (longestRangeKey === 0) {
            (rangeCoordinates.get(arr[0]) as Point2D[]).push(new Point2D(arr[1], arr[2]))
         } else if (longestRangeKey === 1) {
            (rangeCoordinates.get(arr[1]) as Point2D[]).push(new Point2D(arr[0], arr[2]))
         } else if (longestRangeKey === 2) {
            (rangeCoordinates.get(arr[2]) as Point2D[]).push(new Point2D(arr[0], arr[1]))
         }
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

   preHash(): AVLObject<E> {
      return this;
   }

   toPrint(): string {
      let list: E[] = this.internalStorage.getCoordinateList(true);
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