import { Point } from "./Point.js";
import { HashStorageNode } from "./HashStorageNode.js";
import { ValidObject } from "./ValidObject.js";

export class HashStorage<E extends Point> implements ValidObject {
   hashMap = new Map<number, HashStorageNode<E>>;
   maxDimensions!: number;
   pointFactoryMethod!: Function;
   constructor(maxDimensions: number, pointFactoryMethod: Function) {
      if (maxDimensions < 1) {
         throw new Error("Invalid Depth: Can not be less than 1")
      }
      this.maxDimensions = maxDimensions;
      this.pointFactoryMethod = pointFactoryMethod;
   }

   removeCoordinate(p: E): void {

      if (!this.hasCoordinate(p)) {
         return;
      }

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

   addCoordinate(p: E, allowDuplicates: boolean): void {
      if (this.hasCoordinate(p) && !allowDuplicates) {
         return;
      }
      var workingMap: Map<number, HashStorageNode<E>> = this.hashMap;
      for (let i = 0; i < p.arr.length; i++) {
         if (workingMap.has(p.arr[i])) {
            let targetNode: HashStorageNode<E> = this.hashMap.get(p.arr[i]) as HashStorageNode<E>;
            targetNode.increaseAmount();
            workingMap = targetNode.getHashMap();
         } else {
            workingMap = workingMap.set(p.arr[i], new HashStorageNode<E>(p.arr[i]))
            workingMap = (workingMap.get(p.arr[i]) as HashStorageNode<E>).getHashMap();
         }
      }
   }

   #getCoordinateListRecursiveCall(currentNode: HashStorageNode<E>, currentCoordinate: number[], coordinateList: E[], depth: number, duplicates: boolean) {
      currentCoordinate.push(currentNode.getValue());
      if (depth === this.maxDimensions) {
         if (duplicates) {
            for (let i = 0; i < currentNode.amount; i++) {
               coordinateList.push(this.pointFactoryMethod(currentCoordinate))
            }
         } else {
            coordinateList.push(this.pointFactoryMethod(currentCoordinate))
         }
      } else {
         for (let [key, value] of currentNode.getHashMap()) {
            this.#getCoordinateListRecursiveCall(value, currentCoordinate, coordinateList, ++depth, duplicates)
         }
      }
   }
   getCoordinateList(allowDuplicates: boolean): E[] {
      let coordinateList: E[] = [];
      for (let [key, value] of this.hashMap) {
         this.#getCoordinateListRecursiveCall(value, [], coordinateList, 1, allowDuplicates)
      }
      return coordinateList;
   }
   preHash() {
      return this;
   }
   toPrint(): string {
      return "" + this.getCoordinateList(true);
   }
}