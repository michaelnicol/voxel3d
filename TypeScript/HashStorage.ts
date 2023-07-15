import { Point } from "./Point.js";
import { HashStorageNode } from "./HashStorageNode.js";
import { ValidObject } from "./ValidObject.js";
import { PointFactoryMethods } from "./PointFactoryMethods.js";

export class HashStorage<E extends Point> implements ValidObject {
   hashMap = new Map<number, HashStorageNode<E>>;
   maxDimensions!: number;
   pointFactoryMethod!: Function;
   coordinateCount: number = 0;
   constructor(maxDimensions: number) {
      if (maxDimensions < 1 || maxDimensions === undefined) {
         throw new Error("Invalid Depth: Can not be less than 1 or undefined: " + maxDimensions)
      }
      this.maxDimensions = maxDimensions;
      this.pointFactoryMethod = PointFactoryMethods.getFactoryMethod(maxDimensions);
   }

   reset() {
      this.hashMap = new Map<number, HashStorageNode<E>>;
      this.coordinateCount = 0
   }

   removeCoordinate(p: E): void {
      if (!this.hasCoordinate(p)) {
         return;
      }
      this.coordinateCount -= 1;
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      for (let i = 0; i < p.arr.length; i++) {
         let j = p.arr[i];
         let workingNode: HashStorageNode<E> = workingMap.get(j) as HashStorageNode<E>
         workingNode.decreaseAmount();
         if (workingNode.getAmount() === 0) {
            workingNode.getHashMap().delete(j)
            return;
         }
         workingMap = workingNode.getHashMap() as Map<number, HashStorageNode<E>>;
      }
   }

   hasCoordinate(p: E): boolean {
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      for (let i = 0; i < p.arr.length; i++) {
         let j = p.arr[i];
         if (workingMap.has(j)) {
            workingMap = (workingMap.get(j) as HashStorageNode<E>).getHashMap() as Map<number, HashStorageNode<E>>;
         } else {
            return false;
         }
      }
      return true;
   }

   addCoordinates(coordinates: E[], allowDuplicates: boolean): void {
      for (let point of coordinates) {
         this.addCoordinate(point, allowDuplicates)
      }
   }

   addCoordinate(p: E, allowDuplicates: boolean): void {
      if (this.hasCoordinate(p) && !allowDuplicates) {
         return;
      }
      if (!this.hasCoordinate(p)) {
         this.coordinateCount += 1;
      }
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      for (let i = 0; i < p.arr.length; i++) {
         if (workingMap.has(p.arr[i])) {
            let targetNode: HashStorageNode<E> = workingMap.get(p.arr[i]) as HashStorageNode<E>;
            targetNode.increaseAmount();
            workingMap = targetNode.getHashMap();
         } else {
            workingMap = workingMap.set(p.arr[i], new HashStorageNode<E>(p.arr[i]))
            workingMap = (workingMap.get(p.arr[i]) as HashStorageNode<E>).getHashMap();
         }
      }
   }

   #getCoordinatesListRecursiveCall(currentNode: HashStorageNode<E>, currentCoordinate: number[], coordinateList: E[] | number[][], depth: number, duplicates: boolean, instances: boolean) {
      currentCoordinate.push(currentNode.getValue());
      if (depth === this.maxDimensions) {
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
   getCoordinateList(allowDuplicates: boolean, instances: boolean): E[] | number[][] {
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
      return JSON.stringify(this.getCoordinateList(true, false));
   }
   getCoordinateCount(): number {
      return this.coordinateCount;
   }
}