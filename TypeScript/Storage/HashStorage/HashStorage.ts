import { Point } from "../../Point.js";
import { HashStorageNode } from "../../HashStorageNode.js";
import { ValidObject } from "../../ValidObject.js";
import { PointFactoryMethods } from "../../PointFactoryMethods.js";
import { DimensionalRanges, PointStorage } from "../PointStorage.js";

export class HashStorage<E extends Point> implements PointStorage<E> {
   hashMap = new Map<number, HashStorageNode<E>>;
   uniqueCoordinateCount: number = 0;
   allCoordinateCount: number = 0;
   dimensionCount!: number;
   dimensionalRanges: DimensionalRanges = new Map<number, number[]>()
   outdatedDimensionRanges: Map<number, boolean> = new Map<number, boolean>()
   pointFactoryMethod: Function
   constructor(dimensionCount: number) {
      if (dimensionCount < 1) {
         throw new Error("Invalid Depth: Can not be less than 1: " + dimensionCount)
      }
      this.dimensionCount = dimensionCount;
      for (let i = 0; i < this.dimensionCount; i++) {
         this.dimensionalRanges.set(i, [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0]);
         this.outdatedDimensionRanges.set(i, false)
      }
      this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(dimensionCount);
   }

   reset(): HashStorage<E> {
      this.hashMap = new Map<number, HashStorageNode<E>>;
      this.uniqueCoordinateCount = 0
      this.allCoordinateCount = 0
      this.outdatedDimensionRanges = new Map<number, boolean>()
      this.dimensionalRanges = new Map<number, number[]>()
      return this
   }

   #findRangeRecursiveCall(inclusiveRange: number[], maxDimensions: number, useInclusive: boolean, currentDepth: number, currentNode: HashStorageNode<E>) {
      if (useInclusive && inclusiveRange.indexOf(currentDepth) === -1) {
         for (let [key, value] of currentNode.hashMap) {
            this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, currentDepth + 1, value)
         }
      } else {
         for (let [key, value] of currentNode.hashMap) {
            const coordinateValue = value.getValue()
            const workingRange = this.dimensionalRanges.get(currentDepth) as number[]
            if (coordinateValue < workingRange[0]) {
               workingRange[0] = coordinateValue
               workingRange[1] = value.getAmount()
            } else if (coordinateValue > workingRange[2]) {
               workingRange[2] = coordinateValue
               workingRange[3] = value.getAmount()
            } else if (coordinateValue === workingRange[0]) {
               workingRange[1] += value.getAmount()
            } else if (coordinateValue === workingRange[3]) {
               workingRange[3] += value.getAmount()
            }
            this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, currentDepth + 1, value)
         }
      }
   }

   #findRange(inclusiveRange: number[], maxDimensions: number, useInclusive: boolean) {
      if (useInclusive) {
         for (let i = 0; i < inclusiveRange.length; i++) {
            this.dimensionalRanges.set(inclusiveRange[i], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0])
         }
      } else {
         for (let i = 0; i < maxDimensions; i++) {
            this.dimensionalRanges.set(inclusiveRange[i], [Number.MAX_SAFE_INTEGER, 0, Number.MIN_SAFE_INTEGER, 0])
         }
      }
      let rootNode = new HashStorageNode<E>(-1)
      rootNode.hashMap = this.hashMap
      this.#findRangeRecursiveCall(inclusiveRange, maxDimensions, useInclusive, 0, rootNode)
   }

   findRangeInclusive(inclusiveRange: number[]): DimensionalRanges {
      this.#findRange(inclusiveRange, -1, true)
      return this.dimensionalRanges
   }
   findRangeExclusive(maxDimensions: number): DimensionalRanges {
      this.#findRange([], maxDimensions, false)
      return this.dimensionalRanges
   }

   removeCoordinates(coordinates: E[], calculateRange: boolean): number[] {
      let rangesToCalculate = [] as number[]
      for (let coordinate of coordinates) {
         let result: number[] = this.removeCoordinate(coordinate, false)
         for (let x of result) {
            if (rangesToCalculate.indexOf(x) === -1) {
               rangesToCalculate.push(x)
            }
         }
      }
      if (calculateRange) {
         this.findRangeInclusive(rangesToCalculate)
      }
      return rangesToCalculate;
   }

   removeCoordinate(coordinate: E, calculateRange: boolean): number[] {
      const { arr } = coordinate
      let hasCoordinate = this.hasCoordinate(coordinate)
      if (!hasCoordinate[0]) {
         return []
      }
      if (hasCoordinate[1] === 1) {
         this.uniqueCoordinateCount -= 1;
         this.allCoordinateCount -= 1;
      } else {
         this.allCoordinateCount -= 1;
      }
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      let rangesToCalculate: number[] = []
      for (let i = 0; i < arr.length; i++) {
         let workingRange = this.dimensionalRanges.get(i) as number[]
         if (arr[i] === workingRange[0]) {
            workingRange[1] -= 1;
         }
         if (arr[i] === workingRange[2]) {
            workingRange[3] -= 1;
         }
         if (workingRange[1] === 0 || workingRange[3] === 0) {
            this.outdatedDimensionRanges.set(i, true)
            rangesToCalculate.push(i)
         }
         let workingNode: HashStorageNode<E> = workingMap.get(arr[i]) as HashStorageNode<E>
         workingNode.decreaseAmount();
         if (workingNode.getAmount() === 0) {
            workingNode.getHashMap().delete(arr[i])
            if (calculateRange) {
               this.findRangeInclusive(rangesToCalculate)
            }
            return rangesToCalculate
         }
         workingMap = workingNode.getHashMap() as Map<number, HashStorageNode<E>>;
      }
      return []
   }

   hasCoordinate(p: E): [boolean, number] {
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      var amount = 0;
      for (let i = 0; i < p.arr.length; i++) {
         let j = p.arr[i];
         if (workingMap.has(j)) {
            amount = (workingMap.get(j) as HashStorageNode<E>).getAmount()
            workingMap = (workingMap.get(j) as HashStorageNode<E>).getHashMap() as Map<number, HashStorageNode<E>>;
         } else {
            return [false, 0];
         }
      }
      return [true, amount];
   }

   addCoordinates(coordinates: E[], allowDuplicates: boolean): void {
      for (let point of coordinates) {
         this.addCoordinate(point, allowDuplicates)
      }
   }

   addCoordinate(p: E, allowDuplicates: boolean): void {
      if (this.hasCoordinate(p)[0] && !allowDuplicates) {
         return;
      }
      if (!this.hasCoordinate(p)[0]) {
         this.uniqueCoordinateCount += 1
         this.allCoordinateCount += 1;
      } else {
         this.allCoordinateCount += 1;
      }
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      const { arr } = p
      for (let i = 0; i < arr.length; i++) {
         const range: number[] = this.dimensionalRanges.get(i) as number[];
         // Calculates the range as each dimension is traversed to prevent needing to call findRange
         if (arr[i] < range[0]) {
            range[0] = arr[i];
            range[1] = 1;
         }
         else if (arr[i] === range[0]) {
            range[1] += 1;
         }
         if (arr[i] > range[2]) {
            range[2] = arr[i];
            range[3] = 1;
         }
         else if (arr[i] === range[2]) {
            range[3] += 1;
         }
         if (workingMap.has(arr[i])) {
            let targetNode: HashStorageNode<E> = workingMap.get(arr[i]) as HashStorageNode<E>;
            targetNode.increaseAmount();
            workingMap = targetNode.getHashMap();
         } else {
            workingMap = workingMap.set(arr[i], new HashStorageNode<E>(arr[i]))
            workingMap = (workingMap.get(arr[i]) as HashStorageNode<E>).getHashMap();
         }
      }
   }

   #getCoordinatesListRecursiveCall(currentNode: HashStorageNode<E>, currentCoordinate: number[], coordinateList: E[] | number[][], depth: number, duplicates: boolean, instances: boolean) {
      currentCoordinate.push(currentNode.getValue());
      if (depth === this.dimensionCount) {
         for (let i = 0; i < currentNode.amount; i++) {
            if (instances) {
               (coordinateList as E[]).push(this.pointFactoryMethod(currentCoordinate) as E)
            } else {
               (coordinateList as number[][]).push([...(currentCoordinate as number[])] as number[])
            }
            if (!duplicates) {
               break;
            }
         }
      } else {
         for (let [key, value] of currentNode.getHashMap()) {
            this.#getCoordinatesListRecursiveCall(value, [...currentCoordinate], coordinateList, depth + 1, duplicates, instances)
         }
      }
   }
   getSortedRange(): number[][] {
      // Each element is a [dimensionNumber, dimensionSpan]
      let list: number[][] = []
      // For each range in the hashmap
      for (let [key, value] of this.dimensionalRanges) {
         // Calculate the span of that dimension. Difference between min and max. 
         let r = Math.abs(value[0] - value[2])
         // Add the [dimensionNumber: span] to the list.
         list.push([key, r])
      }
      // Sort from highest to lowest dimension.
      list.sort((a, b) => b[1] - a[1])
      // Then return that.
      return list;
   }
   correctOutdatedRanges(): DimensionalRanges {
      let ranges: number[] = []
      for (let [key, value] of this.outdatedDimensionRanges) {
         if (value) {
            ranges.push(key)
         }
      }
      return this.findRangeInclusive(ranges)
   }
   hasOutdatedRanges(): boolean {
      for (let [key, value] of this.outdatedDimensionRanges) {
         if (value) {
            return true;
         }
      }
      return false;
   }
   clone(): HashStorage<E> {
      const newStorage = new HashStorage<E>(this.dimensionCount)
      const coordinates: E[] = this.getCoordinates(true, true) as E[]
      coordinates.forEach(value => newStorage.addCoordinate(value.clone() as E, true))
      return newStorage;
   }
   getCoordinates(allowDuplicates: boolean, instances: boolean): E[] | number[][] {
      let coordinateList: E[] | number[][] = [];
      for (let [key, value] of this.hashMap) {
         this.#getCoordinatesListRecursiveCall(value, [], coordinateList, 1, allowDuplicates, instances)
      }
      return coordinateList;
   }
   preHash() {
      return this;
   }
   toPrint(): string {
      return JSON.stringify(this.getCoordinates(true, false));
   }
}