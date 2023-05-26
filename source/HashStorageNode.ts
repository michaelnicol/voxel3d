import { Point } from "./Point.js";
import { ValidObject } from "./ValidObject.js";

export class HashStorageNode<E extends Point> implements ValidObject {
   hashMap: Map<number, HashStorageNode<E>> = new Map<number, HashStorageNode<E>>();
   private value!: number;
   amount: number = 1;
   constructor(value: number) {
      this.value = value;
   };
   preHash() {
       return this;
   }
   getValue() {
      return this.value;
   }
   toPrint(): string {
      let str = "["+this.value+": ";
      for (let [key, value] of this.hashMap) {
         str+=`<${key}, ${this.hashMap.get(Number(value))}>`
      }
      return str+"]";
   }
   increaseAmount(): void {
      this.amount+=1;
   }
   decreaseAmount(): void {
      this.amount-=1;
      if (this.amount < 0) {
         throw new Error("Negative Amount")
      }
   }
   getAmount(): number {
      return this.amount;
   }
   getHashMap(): Map<number, HashStorageNode<E>> {
      return this.hashMap;
   }
}